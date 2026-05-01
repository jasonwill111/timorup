// Auth API - Session (Get current user)
export const prerender = false;

import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie');
  console.log('[Session] Cookie header:', cookieHeader?.substring(0, 100));

  try {
    // Direct DB query to verify session exists
    const db = await getDb();
    const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      console.log('[Session] Extracted token:', token?.substring(0, 20));

      const now = Math.floor(Date.now() / 1000);
      console.log('[Session] Current timestamp:', now);

      const result = await db.select()
        .from(sessions)
        .where(eq(sessions.token, token))
        .limit(1)
        .get();

      console.log('[Session] Direct DB query result:', JSON.stringify(result)?.substring(0, 200));
      console.log('[Session] Expires at:', result?.expiresAt);
      console.log('[Session] Expires at > now:', result?.expiresAt && result.expiresAt > new Date(now * 1000));
    }

    const authApi = (await initAuth()).api;
    console.log('[Session] Auth API initialized');

    const session = await authApi.getSession({
      headers: request.headers,
    });

    console.log('[Session] Raw session result type:', typeof session);
    console.log('[Session] Raw session result:', JSON.stringify(session));
    console.log('[Session] Session keys:', session ? Object.keys(session) : 'null');
    console.log('[Session] Session user:', session?.user ? JSON.stringify(session.user) : 'null');
    console.log('[Session] Session session:', session?.session ? JSON.stringify(session.session) : 'null');

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
