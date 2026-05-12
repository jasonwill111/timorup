// Auth Server Action - Forgot Password
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

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

export const forgotPassword = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email('Valid email required'),
  }),
  handler: async (input) => {
    if (!checkRateLimit(`forgot:${input.email}`)) {
      return { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } };
    }

    try {
      const auth = await initAuth();
      await auth.api.forgotPassword({
        body: { email: input.email }
      });
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      // Don't reveal if email exists
      return { success: true, message: 'If an account exists, a reset email was sent' };
    }
  },
});