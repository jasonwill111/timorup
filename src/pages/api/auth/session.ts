// Auth API - Session (Get current user)
export const prerender = false;

import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie');

  try {
    // Get session the same way the sign-in does - check token directly from DB
    const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      const db = await getDb();

      // Direct query matching what better-auth creates
      const session = await db.select()
        .from(sessions)
        .where(eq(sessions.token, token))
        .limit(1)
        .get();

      if (session) {
        // Session exists, now get user
        const user = await db.select()
          .from(users)
          .where(eq(users.id, session.userId))
          .limit(1)
          .get();

        if (user) {
          return new Response(JSON.stringify({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              emailVerified: user.emailVerified ?? false,
              image: user.image ?? null,
              createdAt: user.createdAt?.toISOString?.() ?? null,
              updatedAt: user.updatedAt?.toISOString?.() ?? null,
            },
            session: {
              id: session.id,
              expiresAt: session.expiresAt?.toISOString?.() ?? null,
              token: session.token,
              createdAt: session.createdAt?.toISOString?.() ?? null,
              updatedAt: session.updatedAt?.toISOString?.() ?? null,
              ipAddress: session.ipAddress,
              userAgent: session.userAgent,
              userId: session.userId,
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Fallback to better-auth's getSession
    const authApi = (await initAuth()).api;
    const session = await authApi.getSession({
      headers: request.headers,
    });

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Session] Error:', errorMessage);
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
