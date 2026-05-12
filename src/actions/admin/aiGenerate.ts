// Astro Server Actions for Admin AI Content Generation
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAdminUser } from '@/lib/admin-auth';

const AI_TIMEOUT = 120000; // 2 minutes

// Get API key - same logic as Mastra agents
function getApiKey(): string {
  if (typeof globalThis !== 'undefined' && (globalThis as any).env?.MINIMAX_API_KEY) {
    return (globalThis as any).env.MINIMAX_API_KEY;
  }
  if (typeof import.meta !== 'undefined') {
    const env = import.meta.env as Record<string, string | undefined>;
    if (env?.MINIMAX_API_KEY) return env.MINIMAX_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.MINIMAX_API_KEY) {
    return process.env.MINIMAX_API_KEY;
  }
  return '';
}

export const aiGenerate = defineAction({
  input: z.object({
    type: z.enum(['listing', 'sku', 'blog', 'landing']),
    data: z.record(z.unknown()),
  }),
  handler: async (input, context) => {
    console.log('[AI Action] Called with type:', input.type);

    const request = context?.request as Request | undefined;
    if (!request) {
      throw new Error('Request context not available');
    }

    const user = await getAdminUser(request);
    if (!user) throw new Error('Unauthorized');

    const data = input.data as Record<string, unknown>;
    const apiKey = getApiKey();

    console.log('[AI] API Key status:', apiKey ? `SET (length: ${apiKey.length})` : 'NOT SET');

    // Build user message based on type
    let userMessage = '';

    switch (input.type) {
      case 'listing': {
        const title = String(data.title ?? '');
        const entityType = String(data.entityType ?? 'business');
        const contactName = String(data.contactName ?? '');
        const phone = String(data.phone ?? '');
        const email = String(data.email ?? '');
        const address = String(data.address ?? '');
        const about = String(data.about ?? '');
        const tags = Array.isArray(data.tags) ? data.tags : String(data.tags ?? '').split(',');
        userMessage = `Create a listing for "${title}" (${entityType}).
Contact: ${contactName || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
Address: ${address || 'N/A'}
About: ${about || 'N/A'}
Tags: ${Array.isArray(tags) ? tags.join(', ') : tags || 'N/A'}

IMPORTANT: Return ONLY valid JSON. Format:
{
  "title": "Business name",
  "entityType": "business",
  "contactName": "Contact name",
  "contactNumber": "77000000",
  "countryCode": "+670",
  "email": "email@example.tl",
  "address": "Full address",
  "aboutUs": "<p>HTML description</p>",
  "tags": ["tag1", "tag2"],
  "status": "draft"
}`;
        break;
      }
      case 'sku': {
        const skuTitle = String(data.title ?? '');
        const skuDesc = String(data.description ?? '');
        const priceVal = String(data.priceValue ?? 'N/A');
        const priceFields = Array.isArray(data.priceFields) ? data.priceFields : [];
        const priceInfo = priceFields.length > 0
          ? priceFields.map((p: any) => `${p.label}: ${p.value} ${p.unit || ''}`).join(', ')
          : `Price: ${priceVal}`;
        userMessage = `Create a ${data.serviceType || 'product'} called "${skuTitle}".
Description: ${skuDesc}
${priceInfo}

IMPORTANT: Return ONLY valid JSON. Format:
{
  "title": "Product name",
  "serviceType": "product|service|rental",
  "description": "<p>HTML description</p>",
  "priceFields": [{"label": "Price", "value": "25.00", "unit": "/hour"}],
  "status": "draft"
}`;
        break;
      }
      case 'blog': {
        const topic = String(data.topic ?? '');
        userMessage = `Write a ${data.type || 'general'} article about "${topic}".
Length: ${data.length || 'medium'}
Requirements: ${data.prompt || 'N/A'}

Respond ONLY with a JSON object. No other text before or after.
Example valid response: {"title":"My Article","excerpt":"A brief summary","content":"<p>Article body here</p>","tags":["tag1"],"slug":"my-article","status":"draft"}
        `;
        break;
      }
      case 'landing': {
        const lpTitle = String(data.title ?? '');
        userMessage = `Create a ${data.type || 'promotion'} landing page for "${lpTitle}".
Description: ${data.description || 'N/A'}
Requirements: ${data.prompt || 'N/A'}

IMPORTANT: Return ONLY valid JSON. Format:
{
  "hero": {"title": "Hero title", "subtitle": "Hero subtitle", "ctaText": "Get Started"},
  "description": "<p>HTML description</p>",
  "features": [{"title": "Feature 1", "description": "Desc 1"}],
  "cta": {"title": "CTA title", "description": "<p>CTA description</p>", "buttonText": "Sign Up"}
}`;
        break;
      }
    }

    // Direct MiniMax API call
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT);

      console.log('[AI] Calling MiniMax API directly...');

      const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'MiniMax-M2.7',
          messages: [{ role: 'user', content: userMessage }],
          max_tokens: 4000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[AI] MiniMax API error:', response.status, errorBody);
        throw new Error(`API error: ${response.status} - ${errorBody}`);
      }

      const result = await response.json();
      console.log('[AI] API Response received, content length:', result.choices?.[0]?.message?.content?.length || 0);

      const text = result.choices?.[0]?.message?.content || '';

      if (!text) {
        return { success: false, error: { code: 'EMPTY_RESPONSE', message: 'AI returned empty response' } };
      }

      // Clean the response: remove think blocks, markdown code fences
      let cleanedText = text
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      // Try to parse as JSON - find JSON object bounds
      let parsed: Record<string, unknown>;
      try {
        // Find the first { and last } to extract JSON
        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonStr = cleanedText.substring(firstBrace, lastBrace + 1);
          parsed = JSON.parse(jsonStr);
          console.log('[AI] Parsed JSON keys:', Object.keys(parsed));
          return { success: true, object: parsed };
        }
        // If no JSON found, return the whole text as content
        return { success: true, object: { title: data.topic as string, content: cleanedText, excerpt: cleanedText.substring(0, 200), tags: [], slug: '', status: 'draft' } };
      } catch {
        // If parsing fails, return as plain content
        return { success: true, object: { title: data.topic as string, content: cleanedText, excerpt: cleanedText.substring(0, 200), tags: [], slug: '', status: 'draft' } };
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[AI] Error:', error.message);

      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        return { success: false, error: { code: 'TIMEOUT', message: 'AI generation timed out' } };
      }

      return { success: false, error: { code: 'ERROR', message: error.message } };
    }
  },
});