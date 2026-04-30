// Auth API - Sign In
export const prerender = false;

import { initAuth } from '@/lib/auth';

// Rate limiter
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
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'Email and password are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const result = await authApi.signInEmail({
      body: { email, password },
    });

    const user = result.user;
    const token = result.token;

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers.set('Set-Cookie', `better-auth.session_token=${token}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Path=/`);
    }

    const response = new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers,
    });

    return response;
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SIGN_IN_ERROR', message: getErrorMessage(error) || 'Invalid credentials' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}
