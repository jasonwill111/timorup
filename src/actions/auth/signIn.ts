// Auth Server Action - Sign In
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users, sessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const signIn = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
  handler: async (input) => {
    if (!checkRateLimit(`signin:${input.email}`)) {
      return { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } };
    }

    try {
      const db = await getDb();
      const auth = await initAuth();
      const authApi = auth.api;

      // Check if user exists by email
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()))
        .limit(1)
        .get();

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
          .get();

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