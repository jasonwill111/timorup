// Admin Reviews Delete API
export const prerender = false;

import { getDb } from '@/lib/db';
import { reviews, businessPages } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Helper to check admin
async function isAdmin(request: Request): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user) return false;

  const adminEmails = ['admin@timorlist.com'];
  return adminEmails.includes(session.user.email || '') || session.user.email?.endsWith('@admin.timorlist') === true;
}

// DELETE - Delete review (admin only)
export async function DELETE({ request, params }: { request: Request; params: { id: string } }) {
  const db = await getDb();
  try {
    // Check admin
    const admin = await isAdmin(request);
    if (!admin) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const reviewId = params.id;
    if (!reviewId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Review ID is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Get the review first
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

    const businessPageId = review.businessPageId;

    // Delete the review
    await db.delete(reviews)
      .where(eq(reviews.id, reviewId))
      .run();

    // Recalculate business rating
    const remainingReviews = await db.select()
      .from(reviews)
      .where(eq(reviews.businessPageId, businessPageId));

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

    return new Response(JSON.stringify({
      success: true,
      message: 'Review deleted',
      updatedRating: {
        average: newAvg,
        count: newCount,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin delete review error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete review' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
