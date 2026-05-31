// Auth Server Action - Sign In
import { defineAction } from 'astro:actions';
import * as z from 'zod';
import { getAuth } from '@/lib/auth';
import { emailSchema, requiredString } from '@/lib/schemas/common';
import { checkRateLimit } from '@/lib/rate-limit';
import { createErrorResponse, getErrorMessage } from '@/lib/errors';
import { ErrorCode } from '@/lib/errors';

export const signIn = defineAction({
  accept: 'json',
  input: z.object({
    email: emailSchema,
    password: requiredString('Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
  handler: async (input) => {
    // Simple in-memory rate limiting (no KV overhead)
    const rateLimit = checkRateLimit('auth-sign-in');
    if (!rateLimit.allowed) {
      return createErrorResponse(
        ErrorCode.AUTH_RATE_LIMITED,
        'Too many sign-in attempts. Please try again later.',
        { resetIn: rateLimit.resetIn }
      );
    }

    try {
      // Use singleton getAuth - instance cached across requests
      const auth = await getAuth();

      const result = await auth.api.signInEmail({
        body: { email: input.email, password: input.password },
      });

      return {
        success: true,
        user: result.user,
        token: result.token,
      };
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes('invalid') || message.includes('incorrect') || message.includes('wrong')) {
        return createErrorResponse(ErrorCode.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');
      }
      return createErrorResponse(ErrorCode.AUTH_INVALID, message);
    }
  },
});