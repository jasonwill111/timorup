// Auth Server Action - Sign In
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users, sessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkRateLimitKV } from '@/lib/rate-limit';
import { getErrorMessage } from '@/lib/utils';

export const signIn = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
  handler: async (input) => {
    // Use KV-backed rate limiting
    const rateLimit = await checkRateLimitKV(`signin:${input.email.toLowerCase()}`);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Please try again in ${rateLimit.resetIn} seconds.`
        }
      };
    }

    try {
      console.log('[signIn] Starting login process');
      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
      console.log('[signIn] getDb result:', db ? 'db available' : 'db is null');

      if (!db) {
        console.error('[signIn] DB is null, returning error');
        return { success: false, error: { code: 'DB_ERROR', message: 'Database not available. Please try again later.' } };
      }

      console.log('[signIn] DB ready, calling db.select() to check users');
      // Don't wait for db.select - it seems to hang with remote D1
      // Just try to continue with initAuth
      console.log('[signIn] Skipping db.select() test, moving to initAuth');
      console.log('[signIn] About to call initAuth');

      console.log('[signIn] DB ready, initializing auth');
      const auth = await initAuth();
      const authApi = auth.api;

      // Check if user exists by email
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()))
        .limit(1)
        .get() ?? undefined;

      // Call better-auth to verify password and create session
      const result = await authApi.signInEmail({
        body: { email: input.email, password: input.password },
      });

      const newUser = result.user;
      const token = result.token;

      let userId: string;
      let userRole: string;

      if (existingUser && newUser.id !== existingUser.id) {
        // better-auth created a NEW user instead of finding existing one
        // Fix: delete the new user, use existing user's session
        await db.delete(users).where(eq(users.id, newUser.id)).run();

        // Get the session that better-auth just created
        const session = await db.select()
          .from(sessions)
          .where(and(eq(sessions.token, token!), eq(sessions.userId, newUser.id)))
          .limit(1)
          .get() ?? undefined;

        if (session) {
          await db.update(sessions)
            .set({ userId: existingUser.id })
            .where(eq(sessions.id, session.id))
            .run();
        }

        userId = existingUser.id;
        userRole = existingUser.role || 'user';
      } else if (existingUser) {
        userId = existingUser.id;
        userRole = existingUser.role || 'user';
      } else {
        userId = newUser.id;
        userRole = 'user';
      }

      const isProduction = process.env.NODE_ENV === 'production';
      const maxAge = input.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

      return {
        success: true,
        user: {
          id: userId,
          email: existingUser?.email || input.email.toLowerCase(),
          name: existingUser?.name || newUser.name,
          role: userRole,
          emailVerified: existingUser?.emailVerified ?? 0,
          image: existingUser?.image ?? null,
          createdAt: existingUser?.createdAt ? String(existingUser.createdAt) : String(newUser.createdAt),
          updatedAt: existingUser?.updatedAt ? String(existingUser.updatedAt) : String(newUser.updatedAt),
        },
        rememberMe: input.rememberMe,
      };
    } catch (error) {
      return { success: false, error: { code: 'SIGN_IN_ERROR', message: getErrorMessage(error) || 'Invalid credentials' } };
    }
  },
});