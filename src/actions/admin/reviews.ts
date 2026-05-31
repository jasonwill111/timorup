// Astro Server Actions for Admin Reviews Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { reviews as reviewsTable, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';

const listSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const adminReviews = {
  // List reviews with pagination
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      let query = db.select().from(reviewsTable);

      // For now, get all (status filtering would need to be added to schema)
      const allReviews = await query.all();

      // Simple pagination
      const paginatedReviews = allReviews.slice(offset, offset + limit);

      return {
        success: true,
        data: paginatedReviews,
        total: allReviews.length,
        page,
        limit,
      };
    },
  }),

  // Delete review
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, 'Database not available');

      // Get the review first
      const review = await db.select()
        .from(reviewsTable)
        .where(eq(reviewsTable.id, input.id))
        .limit(1)
        .get();

      if (!review) return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Review not found');

      const businessId = review.businessId;

      // Delete the review
      await db.delete(reviewsTable)
        .where(eq(reviewsTable.id, input.id))
        .run();

      // Recalculate business rating
      const remainingReviews = await db.select()
        .from(reviewsTable)
        .where(eq(reviewsTable.businessId, businessId));

      let newAvg = 0;
      let newCount = 0;
      if (remainingReviews.length > 0) {
        const sum = remainingReviews.reduce((acc, r) => acc + r.rating, 0);
        newAvg = sum / remainingReviews.length;
        newCount = remainingReviews.length;
      }

      // Update business rating
      await db.update(businesses)
        .set({
          ratingAverage: newAvg,
          ratingCount: newCount,
        })
        .where(eq(businesses.id, businessId))
        .run();

      return {
        success: true,
        message: 'Review deleted',
        updatedRating: {
          average: newAvg,
          count: newCount,
        },
      };
    },
  }),
};