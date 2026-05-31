/**
 * Reviews Query Functions
 * Centralized CRUD for business reviews
 */
import { getDb } from '@/lib/db';
import { reviews, businesses } from '@/db/schema';
import { eq, avg, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface CreateReviewInput {
  businessId: string;
  userId: string;
  rating: number;
  comment: string;
  authorName?: string;
}

export interface ReviewStats {
  avgRating: number | null;
  reviewCount: number;
}

/**
 * Create a new review
 */
export async function createReview(input: CreateReviewInput): Promise<{ id: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const id = nanoid();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(reviews).values({
    id,
    businessId: input.businessId,
    userId: input.userId,
    rating: input.rating,
    comment: input.comment,
    authorName: input.authorName || null,
    createdAt: now,
    updatedAt: now,
  }).run();

  return { id };
}

/**
 * Get reviews by business ID
 */
export async function getReviewsByBusiness(businessId: string): Promise<Array<{
  id: string;
  rating: number;
  comment: string;
  authorName: string | null;
  createdAt: number;
}>> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      authorName: reviews.authorName,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(eq(reviews.businessId, businessId))
    .orderBy(reviews.createdAt)
    .all();
}

/**
 * Get review statistics for a business
 */
export async function getReviewStats(businessId: string): Promise<ReviewStats> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const stats = await db
    .select({
      avgRating: avg(reviews.rating),
      reviewCount: count(),
    })
    .from(reviews)
    .where(eq(reviews.businessId, businessId))
    .get();

  return {
    avgRating: stats?.avgRating || null,
    reviewCount: stats?.reviewCount || 0,
  };
}