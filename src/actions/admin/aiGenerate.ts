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
      case 'listing':
        userMessage = `Create a listing for "${data.title}" (${data.entityType || 'business'}).
Contact: ${data.contactName || 'N/A'}
Phone: ${data.phone || 'N/A'}
Email: ${data.email || 'N/A'}
Address: ${data.address || 'N/A'}
About: ${data.about || 'N/A'}
Tags: ${Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || 'N/A'}

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
      case 'sku':
        userMessage = `Create a ${data.serviceType || 'product'} called "${data.title}".
Description: ${data.description || 'N/A'}
Price: ${data.priceValue || 'N/A'}

IMPORTANT: Return ONLY valid JSON. Format:
{
  "title": "Product name",
  "serviceType": "product|service|rental",
  "description": "<p>HTML description</p>",
  "priceFields": [{"label": "Price", "value": "25.00", "unit": "/hour"}],
  "status": "draft"
}`;
        break;
      case 'blog':
        userMessage = `Write a ${data.type || 'general'} article about "${data.topic}".
Length: ${data.length || 'medium'}
Requirements: ${data.prompt || 'N/A'}

IMPORTANT: Return ONLY valid JSON. Format:
{
  "title": "Article title",
  "excerpt": "Short summary",
  "content": "<p>HTML article content with h2, p, ul tags</p>",
  "tags": ["tag1", "tag2"],
  "slug": "url-friendly-slug",
  "status": "draft"
}`;
        break;
      case 'landing':
        userMessage = `Create a ${data.type || 'promotion'} landing page for "${data.title}".
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
          max_tokens: 2000,
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
      console.log('[AI] API Response received');

      const text = result.choices?.[0]?.message?.content || '';

      if (!text) {
        return { success: false, error: { code: 'EMPTY_RESPONSE', message: 'AI returned empty response' } };
      }

      // Try to parse as JSON
      let parsed: Record<string, unknown>;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
          // If it has nested data structure, use that directly
          if (parsed.data && typeof parsed.data === 'object') {
            return { success: true, object: parsed.data as Record<string, unknown> };
          }
          return { success: true, object: parsed };
        }
        // Not JSON - return as plain content
        return { success: true, object: { title: data.topic as string, content: text, excerpt: text.substring(0, 200), tags: [], slug: '', status: 'draft' } };
      } catch {
        return { success: true, object: { title: data.topic as string, content: text, excerpt: text.substring(0, 200), tags: [], slug: '', status: 'draft' } };
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