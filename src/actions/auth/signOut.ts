// Auth Server Action - Sign Out
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';

export const signOut = defineAction({
  accept: 'form',
  input: z.object({}),
  handler: async (_, { cookies }) => {
    try {
      const authApi = (await initAuth()).api;
      const cookieHeader = cookies.get('better-auth.session_token')?.value || '';

      if (cookieHeader) {
        await authApi.signOut({
          headers: { cookie: `better-auth.session_token=${cookieHeader}` },
        });
      }

      // Clear cookie with secure flags
      cookies.set('better-auth.session_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return { success: true };
    } catch (error) {
      // Ignore sign out errors, still return success
      return { success: true };
    }
  },
});