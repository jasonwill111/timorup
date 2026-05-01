// Auth API - Session (Get current user)
export const prerender = false;

import { initAuth } from '@/lib/auth';

export async function GET({ request }: { request: Request }) {
  try {
    console.log('[Session] Request headers:', JSON.stringify(Object.fromEntries(request.headers.entries())));
    const authApi = (await initAuth()).api;
    console.log('[Session] Auth API initialized');
    const session = await authApi.getSession({
      headers: request.headers,
    });
    console.log('[Session] Result:', JSON.stringify(session));
    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Session] Error:', error);
    return new Response(JSON.stringify({ user: null, session: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
