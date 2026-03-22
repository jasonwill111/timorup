// Reviews API - CRUD operations
export const prerender = false;

import { db } from '@/lib/db';
import { reviews, businessPages } from '@/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

// GET - List reviews
export async function GET({ url }: { url: URL }) {
  try {
    const businessPageId = url.searchParams.get('businessPageId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let conditions = [];
    if (businessPageId) {
      conditions.push(eq(reviews.businessPageId, businessPageId));
    }

    const reviewsResult = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isEdited: reviews.isEdited,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

    // Calculate average rating
    let avgRating = 0;
    if (businessPageId) {
      const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})` })
        .from(reviews)
        .where(eq(reviews.businessPageId, businessPageId));
      avgRating = Number(avgResult[0]?.avg) || 0;
    }

    const countResult = await db.select({ count: sql`count(*)` })
      .from(reviews)
      .where(conditions.length > 0 ? conditions[0] : undefined);

    return new Response(JSON.stringify({
      success: true,
      data: reviewsResult,
      averageRating: avgRating,
      total: Number(countResult[0]?.count) || 0,
      page,
      limit
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Reviews error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch reviews' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Create review
export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { businessPageId, userId, rating, comment } = body;

    if (!businessPageId || !userId || !rating) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessPageId, userId, and rating are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check business exists
    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.id, businessPageId))
      .limit(1);

    if (business.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const id = `review-${Date.now()}`;
    const newReview = await db.insert(reviews).values({
      id,
      businessPageId,
      userId,
      rating,
      comment: comment || '',
    }).returning();

    // Update business rating average
    const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})`, count: sql`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.businessPageId, businessPageId));
    
    await db.update(businessPages)
      .set({ 
        ratingAverage: Number(avgResult[0]?.avg) || rating,
        ratingCount: Number(avgResult[0]?.count) || 1
      })
      .where(eq(businessPages.id, businessPageId));

    return new Response(JSON.stringify({
      success: true,
      data: newReview[0]
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create review error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create review' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
