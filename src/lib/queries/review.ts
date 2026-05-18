/**
 * Review Query Functions
 * Centralized data access for reviews
 */
import { getDb } from '@/lib/db';
import { reviews, users } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { success, error, type Result } from './result';

// Types - match actual database schema
export interface ReviewWithUser {
  id: string;
  businessId: string;
  userId: string;
  rating: number;
  title: string | null;
  content: string | null;
  reply: string | null;
  repliedAt: number | null;
  repliedBy: string | null;
  status: string;
  createdAt: number;
  updatedAt: number;
  userName: string;
  userImage: string | null;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Get reviews by business ID with user info
 */
export async function getReviewsByBusinessId(
  businessId: string,
  options?: {
    page?: number;
    limit?: number;
  }
): Promise<Result<{ reviews: ReviewWithUser[]; total: number }>> {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
    const { page = 1, limit = 10 } = options ?? {};
    const offset = (page - 1) * limit;

    // Get reviews with user info
    const results = await db
      .select({
        id: reviews.id,
        businessId: reviews.businessId,
        userId: reviews.userId,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        reply: reviews.reply,
        repliedAt: reviews.repliedAt,
        repliedBy: reviews.repliedBy,
        status: reviews.status,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: users.name,
        userImage: users.image,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.businessId, businessId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset)
      .all();

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.businessId, businessId))
      .get() ?? undefined;

    return success({
      reviews: results as ReviewWithUser[],
      total: countResult?.count ?? 0,
    });
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get review stats for a business
 */
export async function getReviewStats(
  businessId: string
): Promise<Result<ReviewStats>> {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");

    // Get all reviews for stats
    const allReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.businessId, businessId))
      .all();

    if (allReviews.length === 0) {
      return success({
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    // Calculate distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const review of allReviews) {
      const rating = Math.min(5, Math.max(1, review.rating));
      distribution[rating as 1 | 2 | 3 | 4 | 5]++;
      sum += review.rating;
    }

    return success({
      total: allReviews.length,
      average: sum / allReviews.length,
      distribution,
    });
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get user's review for a business
 */
export async function getUserReviewForBusiness(
  userId: string,
  businessId: string
): Promise<Result<ReviewWithUser | null>> {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
    const result = await db
      .select({
        id: reviews.id,
        businessId: reviews.businessId,
        userId: reviews.userId,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        reply: reviews.reply,
        repliedAt: reviews.repliedAt,
        repliedBy: reviews.repliedBy,
        status: reviews.status,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: users.name,
        userImage: users.image,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.userId, userId), eq(reviews.businessId, businessId)))
      .limit(1)
      .get() ?? undefined;

    return success(result ?? null);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Check if user has reviewed a business
 */
export async function hasUserReviewed(
  userId: string,
  businessId: string
): Promise<Result<boolean>> {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.businessId, businessId)))
      .limit(1)
      .get() ?? undefined;

    return success(!!existing);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}
