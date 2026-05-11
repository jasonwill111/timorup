// Test endpoint for debugging AI generation
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  // Get API key
  const apiKey = typeof process !== 'undefined' && process.env?.MINIMAX_API_KEY
    ? process.env.MINIMAX_API_KEY
    : typeof import.meta !== 'undefined' && (import.meta.env as any)?.MINIMAX_API_KEY
      ? (import.meta.env as any).MINIMAX_API_KEY
      : '';

  const apiKeyStatus = apiKey ? `SET (length: ${apiKey.length})` : 'NOT SET';

  // Try a simple fetch
  let fetchResult = 'not tested';
  try {
    const response = await fetch('https://api.minimax.chat/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    fetchResult = `Status: ${response.status}`;
  } catch (e) {
    fetchResult = `Error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return new Response(JSON.stringify({
    apiKeyStatus,
    fetchResult,
    envKeys: Object.keys(process.env || {}).filter(k => k.includes('MINIMAX')),
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

// Test actual AI generation via POST
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { topic } = body;

  // Get API key
  const apiKey = typeof process !== 'undefined' && process.env?.MINIMAX_API_KEY
    ? process.env.MINIMAX_API_KEY
    : typeof import.meta !== 'undefined' && (import.meta.env as any)?.MINIMAX_API_KEY
      ? (import.meta.env as any).MINIMAX_API_KEY
      : '';

  console.log('[Test AI] API Key status:', apiKey ? `SET (${apiKey.length})` : 'NOT SET');
  console.log('[Test AI] Topic:', topic);

  try {
    const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: `Write a short blog about "${topic}". Return JSON.` }],
        max_tokens: 2000,
      }),
    });

    console.log('[Test AI] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `API error: ${response.status} - ${errorText}`
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';

    console.log('[Test AI] Content length:', content.length);

    return new Response(JSON.stringify({
      success: true,
      content: content.slice(0, 500),
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('[Test AI] Error:', err.message);
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};