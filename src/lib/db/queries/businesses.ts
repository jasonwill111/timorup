/**
 * Business Query Functions
 * Centralized queries for business listings
 */
import { getDb } from '@/lib/db';
import { businesses, reviews } from '@/db/schema';
import { eq, sql, count, avg } from 'drizzle-orm';

export interface BusinessByOwner {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  categoryId: string | null;
}

/**
 * Get business by owner ID (one-per-user limit check)
 */
export async function getBusinessByOwner(userId: string): Promise<BusinessByOwner | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      status: businesses.status,
      categoryId: businesses.categoryId,
    })
    .from(businesses)
    .where(eq(businesses.ownerId, userId))
    .limit(1)
    .get() ?? null;

  return result;
}

/**
 * Check if slug already exists
 */
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const conditions = [eq(businesses.slug, slug)];
  if (excludeId) {
    conditions.push(sql`${businesses.id} != ${excludeId}` as never);
  }

  const existing = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.slug, slug))
    .limit(1)
    .get() ?? null;

  return !!existing;
}

/**
 * Create a new business listing
 */
export async function createBusiness(data: {
  title: string;
  slug: string;
  ownerId: string;
  categoryId: string;
  contactName: string;
  contactNumber: string;
  countryCode: string;
  email: string;
  address?: string | null;
  aboutUs?: string | null;
  tags?: string | null;
  openingHours?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  registrationUrl?: string | null;
  yearOfEstablishment?: number | null;
  socialLinks?: string | null;
  status: string;
  subscriptionStatus: string;
}): Promise<{ id: string; title: string; slug: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const id = `biz-${Date.now()}`;

  await db.insert(businesses).values({
    id,
    title: data.title,
    slug: data.slug,
    ownerId: data.ownerId,
    categoryId: data.categoryId,
    contactName: data.contactName,
    contactNumber: data.contactNumber,
    countryCode: data.countryCode,
    email: data.email,
    address: data.address || null,
    aboutUs: data.aboutUs || null,
    tags: data.tags || null,
    openingHours: data.openingHours || null,
    locationLat: data.locationLat || null,
    locationLng: data.locationLng || null,
    registrationUrl: data.registrationUrl || null,
    yearOfEstablishment: data.yearOfEstablishment || null,
    bannerImageId: null,
    profileImageId: null,
    socialLinks: data.socialLinks || null,
    status: data.status,
    subscriptionStatus: data.subscriptionStatus,
  }).run();

  return { id, title: data.title, slug: data.slug };
}

/**
 * Update a business listing
 */
export async function updateBusiness(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    categoryId: string;
    contactName: string;
    contactNumber: string;
    countryCode: string;
    email: string;
    address: string | null;
    aboutUs: string | null;
    tags: string | null;
    openingHours: string | null;
    locationLat: number | null;
    locationLng: number | null;
    registrationUrl: string | null;
    yearOfEstablishment: number;
    socialLinks: string | null;
    bannerImageId: string;
    profileImageId: string;
  }>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const updateData: Record<string, unknown> = { updatedAt: Math.floor(Date.now() / 1000) };

  // Only update provided fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) updateData[key] = value;
  });

  await db.update(businesses).set(updateData).where(eq(businesses.id, id)).run();
}

/**
 * Update business rating based on reviews
 */
export async function updateBusinessRating(businessId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get average rating and count
  const stats = await db
    .select({
      avgRating: avg(reviews.rating),
      reviewCount: count(),
    })
    .from(reviews)
    .where(eq(reviews.businessId, businessId))
    .get();

  await db.update(businesses)
    .set({
      rating: stats?.avgRating || null,
      reviewCount: stats?.reviewCount || 0,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(businesses.id, businessId))
    .run();
}

/**
 * Verify business exists for product/review creation
 */
export async function verifyBusinessExists(businessId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const business = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.id, businessId))
    .limit(1)
    .get() ?? null;

  return !!business;
}