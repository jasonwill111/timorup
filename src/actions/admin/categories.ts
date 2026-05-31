// Astro Server Actions for Admin Categories Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businessCategories as categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

// Input validation schemas
const CreateCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional().default(''),
  icon: z.string().optional().default(''),
  parentId: z.string().optional().nullable(),
});

const UpdateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

export const adminCategories = {
  // Get all categories (with optional entityType filter)
  getAll: defineAction({
    input: z.object({
      entityType: z.enum(['business', 'nonprofit']).optional(),
    }).optional(),
    handler: async () => {
      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const result = await db.select()
        .from(categories)
        .orderBy(desc(categories.createdAt))
        .all();
      return { success: true, data: result };
    },
  }),

  // Create category
  create: defineAction({
    input: CreateCategorySchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');
      const id = `cat-${Date.now()}`;
      const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-');

      await db.insert(categories).values({
        id,
        name: input.name,
        slug,
        description: input.description,
        icon: input.icon,
        
        parentId: input.parentId || null,
      }).run();

      return { success: true, data: { id, name: input.name, slug } };
    },
  }),

  // Update category
  update: defineAction({
    input: UpdateCategorySchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const updateData: Record<string, unknown> = {
        updatedAt: Math.floor(Date.now() / 1000),
      };
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.icon !== undefined) updateData.icon = input.icon;
      
      if (input.parentId !== undefined) updateData.parentId = input.parentId;

      const updated = await db.update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning()
        .get();

      if (!updated) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Category not found');

      return { success: true, data: updated };
    },
  }),

  // Delete category
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      // Check if category has children
      const children = await db.select()
        .from(categories)
        .where(eq(categories.parentId, input.id))
        .all();

      if (children.length > 0) {
        return createErrorResponse(ErrorCode.VALIDATION_INVALID_INPUT, 'Cannot delete category with children. Remove children first.');
      }

      await db.delete(categories).where(eq(categories.id, input.id)).run();

      return { success: true, message: 'Category deleted' };
    },
  }),
};