// Auth Server Action - Reset Password
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';

export const resetPassword = defineAction({
  accept: 'form',
  input: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  handler: async (input) => {
    try {
      const auth = await initAuth();
      await auth.api.resetPassword({
        body: { token: input.token, password: input.password }
      });
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: { code: 'RESET_ERROR', message } };
    }
  },
});