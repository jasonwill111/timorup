// Auth API - Session (Get current user)
// Reads session directly from KV and queries DB for role
export const prerender = false;

import { initAuthInstance } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  try {
    const { env } = await import('cloudflare:workers');

    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    const match = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = match[1];

    // Read session directly from KV
    if (env.SESSION) {
      const stored = await env.SESSION.get(token);

      if (stored) {
        try {
          const data = JSON.parse(stored);
          const session = data.session;
          const kvUser = data.user;

          // Check if session is expired
          if (session && new Date(session.expiresAt) > new Date()) {
            // Initialize auth
            initAuthInstance(env as Record<string, unknown>);

            // Get role from database
            let role = 'user';
            if (env.DB) {
              try {
                const db = drizzle(env.DB as D1Database, {
                  schema: { users }
                });
                const dbUser = await db.select({ role: users.role })
                  .from(users)
                  .where(eq(users.id, session.userId))
                  .limit(1)
                  .get();
                if (dbUser) {
                  role = dbUser.role || 'user';
                }
              } catch (e) {
                console.error('[Session] DB error:', e);
              }
            }

            return new Response(JSON.stringify({
              user: {
                id: session.userId,
                email: kvUser?.email || '',
                name: kvUser?.name || '',
                emailVerified: kvUser?.emailVerified ?? false,
                image: kvUser?.image ?? null,
                role: role,
              },
              session: {
                id: session.id,
                expiresAt: new Date(session.expiresAt).toISOString(),
                token: session.token,
                userId: session.userId,
              }
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } catch (e) {
          console.error('[Session] Parse error:', e);
        }
      }
    }

    return new Response(JSON.stringify({ user: null, session: null }), {
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
