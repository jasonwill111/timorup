// Reviews Reply Server Action - Create, Update, Delete owner replies
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { reviews, businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const ReplySchema = z.object({
  comment: z.string().min(1),
});

export const createReply = defineAction({
  input: ReplySchema,
  handler: async (input, { request }) => {
    const db = await getDb();
    const session = await auth.api.getSession({ headers: request.headers });
    const user = session?.user;

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in' } };
    }

    try {
      const reviewId = new URL(request.url).searchParams.get('reviewId');
      if (!reviewId) {
        return { success: false, error: { code: 'BAD_REQUEST', message: 'Review ID is required' } };
      }

      // Get the review
      const review = await db.select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1)
        .get();

      if (!review) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } };
      }

      // Check if user owns the business
      const business = await db.select()
        .from(businesses)
        .where(eq(businesses.id, review.businessPageId))
        .limit(1)
        .get();

      if (!business || business.ownerId !== user.id) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'You can only reply to reviews on your own business' } };
      }

      // Check if already replied
      if (review.reply) {
        return { success: false, error: { code: 'ALREADY_REPLIED', message: 'You have already replied to this review' } };
      }

      // Update review with reply
      await db.update(reviews)
        .set({
          reply: input.comment,
          repliedAt: new Date(),
          repliedBy: user.id,
        })
        .where(eq(reviews.id, reviewId))
        .run();

      // Get updated review
      const updatedReview = await db.select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1)
        .get();

      return { success: true, data: updatedReview };
    } catch (error) {
      console.error('Reply error:', error);
      return { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create reply' } };
    }
  },
});

export const updateReply = defineAction({
  input: ReplySchema,
  handler: async (input, { request }) => {
    const db = await getDb();
    const session = await auth.api.getSession({ headers: request.headers });
    const user = session?.user;

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in' } };
    }

    try {
      const reviewId = new URL(request.url).searchParams.get('reviewId');
      if (!reviewId) {
        return { success: false, error: { code: 'BAD_REQUEST', message: 'Review ID is required' } };
      }

      const review = await db.select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1)
        .get();

      if (!review) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } };
      }

      // Check if user is the one who replied
      if (review.repliedBy !== user.id) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'You can only edit your own reply' } };
      }

      await db.update(reviews)
        .set({
          reply: input.comment,
          repliedAt: new Date(),
        })
        .where(eq(reviews.id, reviewId))
        .run();

      const updatedReview = await db.select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1)
        .get();

      return { success: true, data: updatedReview };
    } catch (error) {
      console.error('Edit reply error:', error);
      return { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to edit reply' } };
    }
  },
});

export const deleteReply = defineAction({
  input: z.object({}),
  handler: async (_, { request }) => {
    const db = await getDb();
    const session = await auth.api.getSession({ headers: request.headers });
    const user = session?.user;

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in' } };
    }

    try {
      const reviewId = new URL(request.url).searchParams.get('reviewId');
      if (!reviewId) {
        return { success: false, error: { code: 'BAD_REQUEST', message: 'Review ID is required' } };
      }

      const review = await db.select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1)
        .get();

      if (!review) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } };
      }

      // Check if user is the one who replied
      if (review.repliedBy !== user.id) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'You can only delete your own reply' } };
      }

      await db.update(reviews)
        .set({
          reply: null,
          repliedAt: null,
          repliedBy: null,
        })
        .where(eq(reviews.id, reviewId))
        .run();

      return { success: true, message: 'Reply deleted' };
    } catch (error) {
      console.error('Delete reply error:', error);
      return { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete reply' } };
    }
  },
});