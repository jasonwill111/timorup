import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { defineAction } from 'astro:actions';
import { z } from 'zod';

export const getSession = defineAction({
  accept: 'json',
  input: z.object({}),
  handler: async (_, { request }) => {
    const cookieHeader = request.headers.get('cookie');

    try {
      const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

      if (!tokenMatch?.[1]) {
        return { user: null, session: null };
      }

      const token = tokenMatch[1];
      const db = await getDb();
if (!db) throw new Error("Database not available");

      const session = await db.select()
        .from(sessions)
        .where(eq(sessions.token, token))
        .limit(1)
        .get();

      if (!session || !session.expiresAt) {
        return { user: null, session: null };
      }

      // expiresAt in D1 is Unix timestamp (seconds), need to convert to milliseconds
      const expiresAtMs = typeof session.expiresAt === 'number'
        ? session.expiresAt * 1000
        : new Date(session.expiresAt).getTime();

      if (expiresAtMs <= Date.now()) {
        return { user: null, session: null };
      }

      // Session valid, get user
      const user = await db.select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1)
        .get();

      if (!user) {
        return { user: null, session: null };
      }

      return {
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
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Session Action] Error:', errorMessage);
      return { user: null, session: null };
    }
  },
});