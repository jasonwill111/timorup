// Reviews Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { reviews, businessPages } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const CreateReviewSchema = z.object({
  businessPageId: z.string().min(1),
  userId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().default(''),
});

export const createReview = defineAction({
  input: CreateReviewSchema,
  handler: async (input) => {
    const db = await getDb();
    try {
      // Check business exists
      const business = await db.select()
        .from(businessPages)
        .where(eq(businessPages.id, input.businessPageId))
        .limit(1);

      if (business.length === 0) {
        return { success: false, error: { message: 'Business not found' } };
      }

      const id = `review-${Date.now()}`;
      const newReview = await db.insert(reviews).values({
        id,
        businessPageId: input.businessPageId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment || '',
      }).returning();

      // Update business rating average
      const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})`, count: sql`COUNT(*)` })
        .from(reviews)
        .where(eq(reviews.businessPageId, input.businessPageId));

      await db.update(businessPages)
        .set({
          ratingAverage: Number(avgResult[0]?.avg) || input.rating,
          ratingCount: Number(avgResult[0]?.count) || 1
        })
        .where(eq(businessPages.id, input.businessPageId));

      return { success: true, data: newReview[0] };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});