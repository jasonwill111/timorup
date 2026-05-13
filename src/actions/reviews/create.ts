// Reviews Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { reviews, businesses } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const CreateReviewSchema = z.object({
  businessId: z.string().min(1),
  userId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().optional().default(''),
});

export const createReview = defineAction({
  input: CreateReviewSchema,
  handler: async (input) => {
    const db = await getDb();
    try {
      // Check business exists
      const business = await db.select()
        .from(businesses)
        .where(eq(businesses.id, input.businessId))
        .limit(1);

      if (business.length === 0) {
        return { success: false, error: { message: 'Business not found' } };
      }

      const id = `review-${Date.now()}`;
      const newReview = await db.insert(reviews).values({
        id,
        businessId: input.businessId,
        userId: input.userId,
        rating: input.rating,
        content: input.content || '',
      }).returning();

      // Update business rating average
      const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})`, count: sql`COUNT(*)` })
        .from(reviews)
        .where(eq(reviews.businessId, input.businessId));

      await db.update(businesses)
        .set({
          ratingAverage: Number(avgResult[0]?.avg) || input.rating,
          ratingCount: Number(avgResult[0]?.count) || 1
        })
        .where(eq(businesses.id, input.businessId));

      return { success: true, data: newReview[0] };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});