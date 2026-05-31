// Astro Server Actions for Admin Businesses Management (list operations)
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

const listSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['draft', 'live', 'paid', 'expired']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
});

export const adminBusinesses = {
  // List all businesses with optional search and status filter
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      let query = db.select({
        id: businesses.id,
        title: businesses.title,
        slug: businesses.slug,
        email: businesses.email,
        contactNumber: businesses.contactNumber,
        status: businesses.status,
        planSlug: businesses.planSlug,
        createdAt: businesses.createdAt,
        updatedAt: businesses.updatedAt,
      })
        .from(businesses)
        .orderBy(desc(businesses.createdAt));

      const conditions = [];
      if (input?.search) {
        conditions.push(
          or(
            like(businesses.title, `%${input.search}%`),
            like(businesses.slug, `%${input.search}%`)
          )
        );
      }
      if (input?.status) {
        conditions.push(eq(businesses.status, input.status));
      }

      const allBusinesses = conditions.length > 0
        ? await query.where(or(...conditions)).all()
        : await query.all();

      return { success: true, data: allBusinesses };
    },
  }),

  // Create a new business (draft status)
  create: defineAction({
    input: z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      email: z.email().optional().nullable(),
      contactNumber: z.string().optional().nullable(),
      aboutUs: z.string().optional().nullable(),
      latestUpdates: z.string().optional().nullable(),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const now = Math.floor(Date.now() / 1000);

      const newBusiness = {
        id: `biz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: input.title,
        slug: input.slug,
        email: input.email || null,
        contactNumber: input.contactNumber || null,
        aboutUs: input.aboutUs || null,
        latestUpdates: input.latestUpdates || null,
        status: 'draft' as const,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(businesses).values(newBusiness);

      return { success: true, data: { id: newBusiness.id, slug: newBusiness.slug } };
    },
  }),

  // Update business status
  updateStatus: defineAction({
    input: z.object({
      id: z.string(),
      status: z.enum(['draft', 'live', 'paid', 'expired']),
    }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      const existing = await db.select()
        .from(businesses)
        .where(eq(businesses.id, input.id))
        .limit(1)
        .get();

      if (!existing) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Business not found');

      await db.update(businesses)
        .set({ status: input.status, updatedAt: Math.floor(Date.now() / 1000) })
        .where(eq(businesses.id, input.id))
        .run();

      return { success: true, data: { id: input.id, status: input.status } };
    },
  }),
};