// Reviews API - CRUD operations
export const prerender = false;

import { getDb } from '@/lib/db';
import { reviews, businesses } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

// GET - List reviews
export async function GET({ url }: { url: URL }) {
  try {
    const db = await getDb();
    const businessId = url.searchParams.get('businessId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let conditions = [];
    if (businessId) {
      conditions.push(eq(reviews.businessId, businessId));
    }

    const reviewsResult = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      content: reviews.content,
      isEdited: reviews.isEdited,
      createdAt: reviews.createdAt,
      reply: reviews.reply,
      repliedAt: reviews.repliedAt,
      repliedBy: reviews.repliedBy,
    })
    .from(reviews)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

    // Calculate average rating
    let avgRating = 0;
    if (businessId) {
      const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})` })
        .from(reviews)
        .where(eq(reviews.businessId, businessId));
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
      error: { message: error instanceof Error ? error.message : 'Failed to fetch reviews' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Create review
export async function POST({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { businessId, userId, rating, content } = body;

    if (!businessId || !userId || !rating) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessId, userId, and rating are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check business exists
    const business = await db.select()
      .from(businesses)
      .where(eq(businesses.id, businessId))
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
      businessId,
      userId,
      rating,
      content: content || '',
    }).returning();

    // Update business rating average
    const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})`, count: sql`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.businessId, businessId));

    await db.update(businesses)
      .set({
        ratingAverage: Number(avgResult[0]?.avg) || rating,
        ratingCount: Number(avgResult[0]?.count) || 1
      })
      .where(eq(businesses.id, businessId));

    return new Response(JSON.stringify({
      success: true,
      data: newReview[0]
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create review error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Failed to create review' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
