// Astro Server Actions for Admin User Role Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

const VALID_ROLES = ['user', 'editor', 'admin', 'super_admin'] as const;
type Role = typeof VALID_ROLES[number];

export const setUserRole = defineAction({
  input: z.object({
    userId: z.string(),
    role: z.enum(VALID_ROLES),
  }),
  handler: async (input) => {
    const currentUser = await getAdminUser();
    if (!currentUser) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
    if (currentUser.role !== 'super_admin') return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Only super_admin can change roles');

    // Prevent self-demotion
    if (input.userId === currentUser.id) {
      return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Cannot change your own role');
    }

    const db = await getDb();
    if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

    // Get target user
    const targetUser = await db.select()
      .from(users)
      .where(eq(users.id, input.userId))
      .limit(1)
      .get();

    if (!targetUser) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'User not found');

    // Update role
    await db.update(users)
      .set({ role: input.role, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(users.id, input.userId))
      .run();

    return { success: true, data: { id: input.userId, role: input.role } };
  },
});