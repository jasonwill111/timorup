// Astro Server Actions for Admin Users Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, or, like } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

const listSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['user', 'editor', 'admin', 'super_admin']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
});

const updateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.email().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.enum(['user', 'editor', 'admin', 'super_admin']).optional(),
});

export const adminUsers = {
  // List users with optional search and role filter
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      let query = db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      }).from(users);

      const conditions = [];
      if (input?.search) {
        conditions.push(
          or(
            like(users.name, `%${input.search}%`),
            like(users.email, `%${input.search}%`)
          )
        );
      }
      if (input?.role) {
        conditions.push(eq(users.role, input.role));
      }

      const allUsers = conditions.length > 0
        ? await query.where(or(...conditions)).all()
        : await query.all();

      return { success: true, data: allUsers };
    },
  }),

  // Get single user by ID
  getById: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const userRecord = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1)
        .get();

      if (!userRecord) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } };
      }

      return { success: true, data: userRecord };
    },
  }),

  // Update user details (name, email, phone)
  update: defineAction({
    input: updateSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const existing = await db.select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1)
        .get();

      if (!existing) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'User not found');

      const updateData: Record<string, unknown> = { updatedAt: Math.floor(Date.now() / 1000) };
      if (input.name !== undefined) updateData.name = input.name;
      if (input.email !== undefined) updateData.email = input.email || null;
      if (input.phone !== undefined) updateData.phone = input.phone || null;

      await db.update(users)
        .set(updateData)
        .where(eq(users.id, input.id))
        .run();

      return { success: true, data: { id: input.id, ...updateData } };
    },
  }),

  // Delete user
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      // Prevent self-deletion
      if (input.id === user.id) {
        return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Cannot delete your own account');
      }

      const existing = await db.select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1)
        .get();

      if (!existing) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'User not found');

      await db.delete(users).where(eq(users.id, input.id)).run();

      return { success: true };
    },
  }),
};