// Reviews API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { reviews, businessPages } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

const reviewsApp = new Hono();

reviewsApp.use('/*', cors());

// Get reviews for a business
reviewsApp.get('/', async (c) => {
  const businessPageId = c.req.query('businessPageId');
  
  if (!businessPageId) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'businessPageId is required' } 
    }, 400);
  }
  
  try {
    const allReviews = await db.select({
      id: reviews.id,
      businessPageId: reviews.businessPageId,
      rating: reviews.rating,
      comment: reviews.comment,
      isEdited: reviews.isEdited,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(eq(reviews.businessPageId, businessPageId))
    .orderBy(desc(reviews.createdAt));
    
    return c.json({ success: true, data: allReviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get user's review for a business
reviewsApp.get('/user/:businessPageId', async (c) => {
  const businessPageId = c.req.param('businessPageId');
  const userId = c.req.query('userId');
  
  if (!userId) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'userId is required' } 
    }, 400);
  }
  
  try {
    const review = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isEdited: reviews.isEdited,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(
      and(
        eq(reviews.businessPageId, businessPageId),
        eq(reviews.userId, userId)
      )
    )
    .limit(1);
    
    if (review.length === 0) {
      return c.json({ success: true, data: null });
    }
    
    return c.json({ success: true, data: review[0] });
  } catch (error: any) {
    console.error('Error fetching user review:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Create review
reviewsApp.post('/', async (c) => {
  const body = await c.req.json();
  
  const { userId, businessPageId, rating, comment } = body;
  
  if (!userId || !businessPageId || !rating) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAMS', message: 'userId, businessPageId, and rating are required' } 
    }, 400);
  }
  
  // Validate rating (1-5)
  if (rating < 1 || rating > 5) {
    return c.json({
      success: false,
      error: { code: 'INVALID_RATING', message: 'Rating must be between 1 and 5' }
    }, 400);
  }
  
  try {
    // Check if user already reviewed this business
    const existing = await db.select({ id: reviews.id })
      .from(reviews)
      .where(
        and(
          eq(reviews.businessPageId, businessPageId),
          eq(reviews.userId, userId)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      return c.json({
        success: false,
        error: { code: 'ALREADY_REVIEWED', message: 'You have already reviewed this business' }
      }, 400);
    }
    
    // Create review
    const [newReview] = await db.insert(reviews).values({
      businessPageId,
      userId,
      rating,
      comment: comment || null,
    }).returning();
    
    // Update business page rating average
    const ratingStats = await db.select({
      avg: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.businessPageId, businessPageId));
    
    await db.update(businessPages)
      .set({
        ratingAverage: ratingStats[0].avg || 0,
        ratingCount: ratingStats[0].count || 0,
      })
      .where(eq(businessPages.id, businessPageId));
    
    return c.json({ success: true, data: newReview }, 201);
  } catch (error: any) {
    console.error('Error creating review:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Update review
reviewsApp.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  const { userId, rating, comment } = body;
  
  if (!userId) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'userId is required' } 
    }, 400);
  }
  
  // Validate rating
  if (rating && (rating < 1 || rating > 5)) {
    return c.json({
      success: false,
      error: { code: 'INVALID_RATING', message: 'Rating must be between 1 and 5' }
    }, 400);
  }
  
  try {
    // Check ownership
    const existing = await db.select({ userId: reviews.userId, businessPageId: reviews.businessPageId })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    
    if (existing.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } }, 404);
    }
    
    if (existing[0].userId !== userId) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only edit your own reviews' } }, 403);
    }
    
    const [updated] = await db.update(reviews)
      .set({
        rating: rating || existing[0].rating,
        comment: comment !== undefined ? comment : existing[0].comment,
        isEdited: true,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, id))
      .returning();
    
    // Update business page rating average
    const ratingStats = await db.select({
      avg: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.businessPageId, existing[0].businessPageId));
    
    await db.update(businessPages)
      .set({
        ratingAverage: ratingStats[0].avg || 0,
        ratingCount: ratingStats[0].count || 0,
      })
      .where(eq(businessPages.id, existing[0].businessPageId));
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete review
reviewsApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const userId = c.req.query('userId');
  
  if (!userId) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'userId is required' } 
    }, 400);
  }
  
  try {
    // Check ownership
    const review = await db.select({ userId: reviews.userId, businessPageId: reviews.businessPageId })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    
    if (review.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } }, 404);
    }
    
    if (review[0].userId !== userId) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only delete your own reviews' } }, 403);
    }
    
    await db.delete(reviews).where(eq(reviews.id, id));
    
    // Update business page rating average
    const ratingStats = await db.select({
      avg: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.businessPageId, review[0].businessPageId));
    
    await db.update(businessPages)
      .set({
        ratingAverage: ratingStats[0].avg || 0,
        ratingCount: ratingStats[0].count || 0,
      })
      .where(eq(businessPages.id, review[0].businessPageId));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

export default reviewsApp;
