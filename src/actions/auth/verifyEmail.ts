// Auth Server Action - Verify Email
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';

export const verifyEmail = defineAction({
  accept: 'form',
  input: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
  handler: async (input) => {
    try {
      const auth = await initAuth();
      const api = auth.api as { verifyEmail?: (opts: { body: { token: string } }) => Promise<unknown> };
      if (api?.verifyEmail) {
        await api.verifyEmail({
          body: { token: input.token }
        });
      }
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: { code: 'VERIFY_ERROR', message } };
    }
  },
});