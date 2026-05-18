// Auth API - Session (Get current user)
export const prerender = false;

import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie');

  try {
    const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

    if (tokenMatch) {
      const token = tokenMatch[1];
      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

      const session = await db.select()
        .from(sessions)
        .where(eq(sessions.token, token))
        .limit(1)
        .get() ?? undefined;

      // expiresAt in D1 is Unix timestamp (seconds), need to convert to milliseconds
      if (session && session.expiresAt) {
        const expiresAtMs = typeof session.expiresAt === 'number'
          ? session.expiresAt * 1000  // Convert seconds to milliseconds
          : new Date(session.expiresAt).getTime();

        if (expiresAtMs > Date.now()) {
          // Session valid, get user
          const user = await db.select()
            .from(users)
            .where(eq(users.id, session.userId))
            .limit(1)
            .get() ?? undefined;

          if (user) {
            return new Response(JSON.stringify({
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                emailVerified: user.emailVerified ?? false,
                image: user.image ?? null,
                role: user.role ?? 'user',
              },
              session: {
                id: session.id,
                expiresAt: new Date(expiresAtMs).toISOString(),
                token: session.token,
                userId: session.userId,
              }
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
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
