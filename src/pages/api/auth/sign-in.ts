// Auth API - Sign In
export const prerender = false;

import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users, sessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { signInSchema } from '@/lib/api-validation';

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

export async function POST({ request }: { request: Request }) {
  const authApi = (await initAuth()).api;
  const clientIP = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(`signin:${clientIP}`)) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please try again later.' }
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const result = signInSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: result.error.issues[0]?.message || 'Invalid input' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email, password, rememberMe } = result.data;

    const db = await getDb();

    // Step 1: Check if user exists by email
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .get();
    // Step 2: Call better-auth to verify password and create session
    const sessionResult = await authApi.signInEmail({
      body: { email, password },
    });

    const newUser = sessionResult.user;
    const token = sessionResult.token;

    let userId: string;
    let userRole: string;

    if (existingUser && newUser.id !== existingUser.id) {
      // better-auth created a NEW user instead of finding existing one
      // Fix: delete the new user, use existing user's session

      // Delete the newly created (duplicate) user
      await db.delete(users).where(eq(users.id, newUser.id)).run();

      // Update session to point to existing user
      await db.update(sessions)
        .set({ userId: existingUser.id })
        .where(and(eq(sessions.token, token!), eq(sessions.userId, newUser.id)))
        .run();

      userId = existingUser.id;
      userRole = existingUser.role || 'user';
    } else if (existingUser) {
      // User exists and IDs match - normal flow
      userId = existingUser.id;
      userRole = existingUser.role || 'user';
    } else {
      // New user created by better-auth - use new user's data
      userId = newUser.id;
      userRole = 'user';
    }

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const isProduction = process.env.NODE_ENV === 'production';

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (token) {
      const secureFlag = isProduction ? '; Secure' : '';
      headers.set('Set-Cookie', `better-auth.session_token=${token}; HttpOnly; SameSite=Strict${secureFlag}; Max-Age=${maxAge}; Path=/`);
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: userId,
        email: existingUser?.email || email.toLowerCase(),
        name: existingUser?.name || newUser.name,
        role: userRole,
        emailVerified: existingUser?.emailVerified ?? 0,
        image: existingUser?.image ?? null,
        createdAt: existingUser?.createdAt ? String(existingUser.createdAt) : String(newUser.createdAt),
        updatedAt: existingUser?.updatedAt ? String(existingUser.updatedAt) : String(newUser.updatedAt),
      }
    }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[SignIn] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SIGN_IN_ERROR', message: getErrorMessage(error) || 'Invalid credentials' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}
