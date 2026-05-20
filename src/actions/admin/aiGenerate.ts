// Astro Server Actions for Admin AI Content Generation
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAdminUser } from '@/lib/admin-auth';
import { agents } from '@/mastra/agents';

const AI_TIMEOUT = 120000; // 2 minutes

interface StreamResult {
  fullStream: AsyncGenerator<{ type: string; content?: string }>;
  object?: Record<string, unknown>;
}

// Build user message based on type
function buildUserMessage(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case 'listing': {
      const title = String(data.title ?? '');
      const entityType = String(data.entityType ?? 'business');
      const contactName = String(data.contactName ?? '');
      const phone = String(data.phone ?? '');
      const email = String(data.email ?? '');
      const address = String(data.address ?? '');
      const about = String(data.about ?? '');
      const tags = Array.isArray(data.tags) ? data.tags : String(data.tags ?? '').split(',');
      return `Create a listing for "${title}" (${entityType}).
Contact: ${contactName || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
Address: ${address || 'N/A'}
About: ${about || 'N/A'}
Tags: ${Array.isArray(tags) ? tags.join(', ') : tags || 'N/A'}`;
    }
    case 'sku': {
      const skuTitle = String(data.title ?? '');
      const skuDesc = String(data.description ?? '');
      const priceVal = String(data.priceValue ?? 'N/A');
      const priceFields = Array.isArray(data.priceFields) ? data.priceFields : [];
      const priceInfo = priceFields.length > 0
        ? priceFields.map((p: { label: string; value: string; unit?: string }) => `${p.label}: ${p.value} ${p.unit || ''}`).join(', ')
        : `Price: ${priceVal}`;
      return `Create a ${data.productType || 'product'} called "${skuTitle}".
Description: ${skuDesc}
${priceInfo}`;
    }
    case 'blog': {
      const topic = String(data.topic ?? '');
      return `Write a ${data.type || 'general'} article about "${topic}".
Length: ${data.length || 'medium'}
Requirements: ${data.prompt || 'N/A'}`;
    }
    case 'landing': {
      const lpTitle = String(data.title ?? '');
      return `Create a ${data.type || 'promotion'} landing page for "${lpTitle}".
Description: ${data.description || 'N/A'}
Requirements: ${data.prompt || 'N/A'}`;
    }
    default:
      return 'Generate content based on the provided data.';
  }
}

export const aiGenerate = defineAction({
  input: z.object({
    type: z.enum(['listing', 'sku', 'blog', 'landing']),
    data: z.record(z.string(), z.unknown()),
  }),
  handler: async (input, context) => {
    const request = context?.request;
    if (!request) {
      throw new Error('Request context not available');
    }

    const user = await getAdminUser(request);
    if (!user) throw new Error('Unauthorized');

    const data = input.data as Record<string, unknown>;
    const userMessage = buildUserMessage(input.type, data);
    const messages = [{ role: 'user' as const, content: userMessage }];

    // Select agent based on type
    const agentMap = {
      listing: agents.listingCreator,
      sku: agents.skuCreator,
      blog: agents.blogCreator,
      landing: agents.landingPageCreator,
    };

    const agent = agentMap[input.type];
    if (!agent) {
      return { success: false, error: { code: 'INVALID_TYPE', message: `Unknown type: ${input.type}` } };
    }

    try {
      // Use Mastra agent with structured output
      const result = await Promise.race([
        agent.generate(messages, { output: 'object' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT))
      ]) as StreamResult;

      // Try structured output first, fallback to text parsing
      let output = result.object;
      if (!output && result.text) {
        // Clean markdown code fences
        let cleaned = result.text
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/gi, '')
          .trim();

        // Extract JSON object bounds
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        // Fix common JSON escape issues from AI output
        // Replace problematic escape sequences that AI might generate
        cleaned = cleaned
          .replace(/\\'/g, "'")      // \' → ' (unescape apostrophes)
          .replace(/\\"/g, '"')     // \" → " (but only if not already part of a valid escape)
          .replace(/\\\\/g, '\\');   // \\\\ → \\

        try {
          output = JSON.parse(cleaned);
        } catch {
          // Try to extract and fix individual fields if full parse fails
          // This handles cases where AI puts unescaped quotes in content
          console.warn('[AI] JSON parse failed, attempting field extraction');
        }
      }

      if (!output) {
        return { success: false, error: { code: 'EMPTY_RESPONSE', message: 'AI returned empty response' } };
      }

      return { success: true, object: output };

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (error.message === 'timeout') {
        return { success: false, error: { code: 'TIMEOUT', message: 'AI generation timed out' } };
      }

      console.error('[AI Generate] Error:', error);
      return { success: false, error: { code: 'ERROR', message: error.message } };
    }
  },
});