// Astro Server Actions for Admin Reviews Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { reviews as reviewsTable, businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

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
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
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
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();

      // Get the review first
      const review = await db.select()
        .from(reviewsTable)
        .where(eq(reviewsTable.id, input.id))
        .limit(1)
        .get();

      if (!review) throw new Error('Review not found');

      const businessPageId = review.businessPageId;

      // Delete the review
      await db.delete(reviewsTable)
        .where(eq(reviewsTable.id, input.id))
        .run();

      // Recalculate business rating
      const remainingReviews = await db.select()
        .from(reviewsTable)
        .where(eq(reviewsTable.businessPageId, businessPageId));

      let newAvg = 0;
      let newCount = 0;
      if (remainingReviews.length > 0) {
        const sum = remainingReviews.reduce((acc, r) => acc + r.rating, 0);
        newAvg = sum / remainingReviews.length;
        newCount = remainingReviews.length;
      }

      // Update business rating
      await db.update(businessPages)
        .set({
          ratingAverage: newAvg,
          ratingCount: newCount,
        })
        .where(eq(businessPages.id, businessPageId))
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