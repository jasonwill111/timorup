// Auth API - Sign In
export const prerender = false;

import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users, sessions, accounts } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { signInSchema } from '@/lib/api-validation';
import { randomBytes } from 'node:crypto';

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

// Verify password against scrypt hash format
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Parse better-auth scrypt hash format: $scrypt$<algo>$N$<r>$<p>$<dkLen>$<salt>$<hash>
    // When hash starts with '$scrypt$', split gives: ['', 'scrypt', 'scrypt', 'N', 'r', 'p', 'dkLen', 'salt', 'hash'] = 9 parts
    const parts = storedHash.split('$').filter(Boolean);
    if (parts.length !== 8 || parts[0] !== 'scrypt' || parts[1] !== 'scrypt') {
      return false;
    }

    const [, , nHex, rStr, pStr, dkLenStr, saltBase64, hashBase64] = parts;
    const N = parseInt(nHex, 16);
    const r = parseInt(rStr, 10);
    const p = parseInt(pStr, 10);
    const dkLen = parseInt(dkLenStr, 10);

    const salt = Buffer.from(saltBase64, 'base64');
    const storedKey = Buffer.from(hashBase64, 'base64');

    // Compute scrypt using Node.js crypto
    const { scryptSync, timingSafeEqual } = await import('node:crypto');
    const derivedKey = scryptSync(password, salt, dkLen, { N, r, p });

    // Constant-time compare
    if (derivedKey.length !== storedKey.length) return false;
    return timingSafeEqual(derivedKey, storedKey);
  } catch (e) {
    console.error('[verifyPassword] Error:', e);
    return false;
  }
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

    const { email, password } = result.data;
    const db = await getDb();

    // Get existing user by email
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .get();

    // Get password from accounts table
    const account = existingUser ? await db.select()
      .from(accounts)
      .where(eq(accounts.userId, existingUser.id))
      .limit(1)
      .get() : null;

    let userId: string;
    let userRole: string;
    let authToken: string | undefined;

    // Verify password
    if (account?.password) {
      const isValid = await verifyPassword(password, account.password);
      if (!isValid) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
        }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
      userId = existingUser!.id;
      userRole = existingUser!.role || 'user';
    } else if (existingUser) {
      // User exists but no password - try better-auth
      try {
        const sessionResult = await authApi.signInEmail({ body: { email, password } });
        userId = existingUser.id;
        userRole = existingUser.role || 'user';
        authToken = sessionResult.token;
      } catch {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'NO_PASSWORD', message: 'Invalid email or password' }
        }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
    } else {
      // New user - use better-auth to create
      const sessionResult = await authApi.signInEmail({ body: { email, password } });
      userId = sessionResult.user.id;
      userRole = 'user';
      authToken = sessionResult.token;
    }

    // Generate session token
    const token = authToken || randomBytes(32).toString('hex');
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (60 * 60 * 24 * 7);
    const sessionId = `session-${randomBytes(8).toString('hex')}`;

    // Insert session using raw SQL to avoid drizzle schema issues
    await db.run(sql`
      INSERT INTO sessions (id, token, user_id, expires_at, created_at, updated_at)
      VALUES (${sessionId}, ${token}, ${userId}, ${expiresAt}, ${now}, ${now})
    `);

    const maxAge = 60 * 60 * 24 * 7;
    const isProduction = process.env.NODE_ENV === 'production';

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (token) {
      const secureFlag = isProduction ? '; Secure' : '';
      const sameSite = isProduction ? 'SameSite=Strict' : 'SameSite=Lax';
      headers.set('Set-Cookie', `better-auth.session_token=${token}; HttpOnly; ${sameSite}${secureFlag}; Max-Age=${maxAge}; Path=/`);
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: userId,
        email: existingUser?.email || email.toLowerCase(),
        name: existingUser?.name || newUser?.name || email,
        role: userRole,
        emailVerified: existingUser?.emailVerified ?? 0,
        image: existingUser?.image ?? null,
        createdAt: existingUser?.createdAt ? String(existingUser.createdAt) : String(newUser?.createdAt),
        updatedAt: existingUser?.updatedAt ? String(existingUser.updatedAt) : String(newUser?.createdAt),
      }
    }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[SignIn] Error:', error);
    const message = getErrorMessage(error);
    if (message.includes('user already exists')) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SIGN_IN_ERROR', message: 'Invalid email or password' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}
