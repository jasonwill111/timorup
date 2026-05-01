// Auth API - Session (Get current user)
export const prerender = false;

import { initAuth } from '@/lib/auth';

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie');
  console.log('[Session] Cookie header:', cookieHeader?.substring(0, 100));

  try {
    const authApi = (await initAuth()).api;
    console.log('[Session] Auth API initialized');

    const session = await authApi.getSession({
      headers: request.headers,
    });

    console.log('[Session] Raw session result type:', typeof session);
    console.log('[Session] Raw session result:', JSON.stringify(session));

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Session] Error:', errorMessage);
    console.error('[Session] Stack:', error instanceof Error ? error.stack : '');
    return new Response(JSON.stringify({
      error: errorMessage,
      user: null,
      session: null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
