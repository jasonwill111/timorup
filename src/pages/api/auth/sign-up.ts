// Auth API - Sign Up
export const prerender = false;

import { auth } from '@/lib/auth';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authApi = (auth as any).api;

export async function POST({ request }: { request: Request }) {
  const clientIP = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(`signup:${clientIP}`)) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_REQUEST', message: 'Email, password, and name are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { user, session } = await authApi.signUp({
      body: { email, password, name },
    });

    const response = new Response(JSON.stringify({ success: true, user, session }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `better-auth.session_token=${session.token}; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`
      }
    });

    return response;
  } catch (error: any) {
    const errorMessage = error.message || '';
    if (errorMessage.toLowerCase().includes('email') &&
        (errorMessage.toLowerCase().includes('exists') ||
         errorMessage.toLowerCase().includes('already'))) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email already registered' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SIGN_UP_ERROR', message: errorMessage || 'Failed to sign up' }
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
