// Reviews Reply API - CRUD for owner replies
export const prerender = false;

import { db } from '@/lib/db';
import { reviews, businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const replySchema = z.object({
  comment: z.string().min(1, { error: 'Reply comment is required' }),
});

// Helper to get user from session
async function getUserFromSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return session?.user || null;
}

// POST - Create reply (one-time only)
export async function POST({ request, params }: { request: Request; params: { id: string } }) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const reviewId = params.id;
    if (!reviewId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Review ID is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Get the review
    const review = await db.select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1)
      .get();

    if (!review) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Review not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user owns the business
    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.id, review.businessPageId))
      .limit(1)
      .get();

    if (!business || business.ownerId !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only reply to reviews on your own business' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if already replied
    if (review.reply) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'ALREADY_REPLIED', message: 'You have already replied to this review' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Parse body
    const body = await request.json();
    const result = replySchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: result.error.errors[0]?.message || 'Invalid request' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { comment } = result.data;

    // Update review with reply
    await db.update(reviews)
      .set({
        reply: comment,
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

    return new Response(JSON.stringify({
      success: true,
      data: updatedReview
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Reply error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create reply' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// PUT - Edit reply
export async function PUT({ request, params }: { request: Request; params: { id: string } }) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const reviewId = params.id;

    // Get the review
    const review = await db.select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1)
      .get();

    if (!review) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Review not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user is the one who replied
    if (review.repliedBy !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only edit your own reply' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Parse body
    const body = await request.json();
    const result = replySchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: result.error.errors[0]?.message || 'Invalid request' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { comment } = result.data;

    // Update reply
    await db.update(reviews)
      .set({
        reply: comment,
        repliedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId))
      .run();

    // Get updated review
    const updatedReview = await db.select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1)
      .get();

    return new Response(JSON.stringify({
      success: true,
      data: updatedReview
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Edit reply error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to edit reply' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// DELETE - Delete reply
export async function DELETE({ request, params }: { request: Request; params: { id: string } }) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const reviewId = params.id;

    // Get the review
    const review = await db.select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1)
      .get();

    if (!review) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Review not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user is the one who replied
    if (review.repliedBy !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete your own reply' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Clear reply fields
    await db.update(reviews)
      .set({
        reply: null,
        repliedAt: null,
        repliedBy: null,
      })
      .where(eq(reviews.id, reviewId))
      .run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Reply deleted'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Delete reply error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete reply' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
