import { initAuthInstance } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/db/schema';
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

      // Get env from context - this works in Astro SSR
      const { env } = await import('cloudflare:workers');

      // Initialize auth with env
      initAuthInstance(env as Record<string, unknown>);

      // Read session from KV
      if (!env.SESSION) {
        console.error('[Session Action] SESSION KV not available');
        return { user: null, session: null };
      }

      const stored = await env.SESSION.get(token);

      if (!stored) {
        return { user: null, session: null };
      }

      const data = JSON.parse(stored);
      const kvSession = data.session;
      const kvUser = data.user;

      // Check if session is expired
      if (!kvSession || new Date(kvSession.expiresAt) <= new Date()) {
        return { user: null, session: null };
      }

      // Get role from database
      let role = 'user';
      if (env.DB) {
        try {
          const db = drizzle(env.DB as D1Database, { schema: { users } });
          const dbUser = await db.select({ role: users.role })
            .from(users)
            .where(eq(users.id, kvSession.userId))
            .limit(1)
            .get();
          if (dbUser) {
            role = dbUser.role || 'user';
          }
        } catch (e) {
          console.error('[Session] DB error:', e);
        }
      }

      return {
        user: {
          id: kvSession.userId,
          email: kvUser?.email || '',
          name: kvUser?.name || '',
          emailVerified: kvUser?.emailVerified ?? false,
          image: kvUser?.image ?? null,
          role: role,
        },
        session: {
          id: kvSession.id,
          expiresAt: kvSession.expiresAt,
          token: kvSession.token,
          userId: kvSession.userId,
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Session Action] Error:', errorMessage);
      return { user: null, session: null };
    }
  },
});