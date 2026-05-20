// Admin Auth Server Action - Login
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const login = defineAction({
  accept: 'form',
  input: z.object({
    email: z.email({ error: 'Valid email required' }),
    password: z.string().min(1, 'Password required'),
  }),
  handler: async (input) => {
    try {
      const auth = await initAuth();
      const result = await auth.api.signInEmail({
        body: { email: input.email, password: input.password }
      });

      if (!result.user) {
        return { success: false, error: { message: 'Invalid email or password' } };
      }

      // Query DB for role (better-auth doesn't return custom fields)
      const db = await getDb();
if (!db) throw new Error("Database not available");
      const dbUser = await db.select({ role: users.role })
        .from(users)
        .where(eq(users.id, result.user.id))
        .limit(1)
        .get();

      const userRole = dbUser?.role || 'user';

      if (!['admin', 'super_admin', 'editor'].includes(userRole)) {
        return { success: false, error: { message: 'Access denied. Admin role required.' } };
      }

      const sessionResult = result as { user: { id: string; name: string; email: string }; session?: { id: string; userId: string; expiresAt: number } };

      return {
        success: true,
        user: {
          id: sessionResult.user.id,
          name: sessionResult.user.name,
          email: sessionResult.user.email,
          role: userRole
        },
        session: sessionResult.session ? {
          id: sessionResult.session.id,
          userId: sessionResult.session.userId,
          expiresAt: sessionResult.session.expiresAt
        } : null
      };
    } catch (error) {
      console.error('Admin sign in error:', error);
      return { success: false, error: { message: 'Failed to sign in as admin' } };
    }
  },
});