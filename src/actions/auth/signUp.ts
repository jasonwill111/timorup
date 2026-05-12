// Auth Server Action - Sign Up
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  if (process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true') {
    return true;
  }
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

export const signUp = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
  }),
  handler: async (input, { request }) => {
    const clientIP = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(`signup:${clientIP}`)) {
      return { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } };
    }

    try {
      const auth = await initAuth();
      const authApi = auth.api;

      const user = await authApi.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        }
      });

      return { success: true, user };
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes('already exists') || message.includes('already registered')) {
        return { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email already exists' } };
      }
      return { success: false, error: { code: 'SIGN_UP_ERROR', message } };
    }
  },
});