/**
 * Business Query Functions
 * Centralized data access for business pages
 */
import { getDb } from '@/lib/db';
import { businessPages, categories, media, reviews, products } from '@/db/schema';
import { eq, desc, and, like, or, sql, count } from 'drizzle-orm';
import { success, error, type Result } from './result';

// Types
export interface BusinessWithCategory {
  id: string;
  title: string;
  slug: string;
  ownerId: string;
  categoryId: string | null;
  entityType: 'business' | 'nonprofit' | null;
  status: string | null;
  bannerImageId: string | null;
  profileImageId: string | null;
  contactName: string | null;
  contactNumber: string | null;
  email: string | null;
  address: string | null;
  openingHours: string | null;
  aboutUs: string | null;
  tags: string | null;
  industry: string | null;
  likes: number | null;
  ratingAverage: number | null;
  ratingCount: number | null;
  views: number | null;
  publishDate: Date | null;
  expiryDate: Date | null;
  categoryName?: string;
  categorySlug?: string;
  profileImageUrl?: string | null;
  bannerImageUrl?: string | null;
}

export interface SearchBusinessesOptions {
  query?: string;
  categoryId?: string | null;
  entityType?: 'business' | 'nonprofit' | 'all';
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: 'likes' | 'rating' | 'newest' | 'title';
}

export interface SearchBusinessesResult {
  businesses: BusinessWithCategory[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Get business page by slug with category info
 */
export async function getBusinessBySlug(
  slug: string
): Promise<Result<BusinessWithCategory | null>> {
  try {
    const db = await getDb();
    const result = await db
      .select({
        id: businessPages.id,
        title: businessPages.title,
        slug: businessPages.slug,
        ownerId: businessPages.ownerId,
        categoryId: businessPages.categoryId,
        entityType: businessPages.entityType,
        status: businessPages.status,
        bannerImageId: businessPages.bannerImageId,
        profileImageId: businessPages.profileImageId,
        contactName: businessPages.contactName,
        contactNumber: businessPages.contactNumber,
        email: businessPages.email,
        address: businessPages.address,
        openingHours: businessPages.openingHours,
        aboutUs: businessPages.aboutUs,
        tags: businessPages.tags,
        industry: businessPages.industry,
        likes: businessPages.likes,
        ratingAverage: businessPages.ratingAverage,
        ratingCount: businessPages.ratingCount,
        views: businessPages.views,
        publishDate: businessPages.publishDate,
        expiryDate: businessPages.expiryDate,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(businessPages)
      .leftJoin(categories, eq(businessPages.categoryId, categories.id))
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

    if (!result) {
      return success(null);
    }

    // Get media URLs for profile and banner
    let profileImageUrl: string | null = null;
    let bannerImageUrl: string | null = null;

    if (result.profileImageId) {
      const profile = await db
        .select({ url: media.url })
        .from(media)
        .where(eq(media.id, result.profileImageId))
        .limit(1)
        .get();
      profileImageUrl = profile?.url ?? null;
    }

    if (result.bannerImageId) {
      const banner = await db
        .select({ url: media.url })
        .from(media)
        .where(eq(media.id, result.bannerImageId))
        .limit(1)
        .get();
      bannerImageUrl = banner?.url ?? null;
    }

    return success({
      ...result,
      profileImageUrl,
      bannerImageUrl,
    });
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get business page by ID
 */
export async function getBusinessById(
  id: string
): Promise<Result<BusinessWithCategory | null>> {
  try {
    const db = await getDb();
    const result = await db
      .select({
        id: businessPages.id,
        title: businessPages.title,
        slug: businessPages.slug,
        ownerId: businessPages.ownerId,
        categoryId: businessPages.categoryId,
        entityType: businessPages.entityType,
        status: businessPages.status,
        bannerImageId: businessPages.bannerImageId,
        profileImageId: businessPages.profileImageId,
        contactName: businessPages.contactName,
        contactNumber: businessPages.contactNumber,
        email: businessPages.email,
        address: businessPages.address,
        openingHours: businessPages.openingHours,
        aboutUs: businessPages.aboutUs,
        tags: businessPages.tags,
        industry: businessPages.industry,
        likes: businessPages.likes,
        ratingAverage: businessPages.ratingAverage,
        ratingCount: businessPages.ratingCount,
        views: businessPages.views,
        publishDate: businessPages.publishDate,
        expiryDate: businessPages.expiryDate,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(businessPages)
      .leftJoin(categories, eq(businessPages.categoryId, categories.id))
      .where(eq(businessPages.id, id))
      .limit(1)
      .get();

    return success(result ?? null);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Search businesses with pagination and filters
 */
export async function searchBusinesses(
  options: SearchBusinessesOptions = {}
): Promise<Result<SearchBusinessesResult>> {
  try {
    const db = await getDb();
    const {
      query,
      categoryId,
      entityType = 'all',
      status = 'live',
      page = 1,
      limit = 12,
      sortBy = 'likes',
    } = options;

    // Bounds validation - prevent resource exhaustion
    const validPage = Math.max(1, Math.min(page || 1, 1000));
    const validLimit = Math.max(1, Math.min(limit || 12, 100));

    // Build conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(businessPages.status, status));
    }

    if (entityType !== 'all') {
      conditions.push(eq(businessPages.entityType, entityType as 'business' | 'nonprofit'));
    }

    if (categoryId) {
      conditions.push(eq(businessPages.categoryId, categoryId));
    }

    // Text search
    if (query && query.trim()) {
      const searchPattern = `%${query.trim()}%`;
      conditions.push(
        or(
          like(businessPages.title, searchPattern),
          like(businessPages.tags, searchPattern),
          like(businessPages.aboutUs, searchPattern)
        )!
      );
    }

    // Count total
    const countResult = await db
      .select({ count: count() })
      .from(businessPages)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .get();
    const total = countResult?.count ?? 0;

    // Sort order
    let orderBy;
    switch (sortBy) {
      case 'rating':
        orderBy = desc(businessPages.ratingAverage);
        break;
      case 'newest':
        orderBy = desc(businessPages.createdAt);
        break;
      case 'title':
        orderBy = sql`${businessPages.title} ASC`;
        break;
      default:
        orderBy = desc(businessPages.likes);
    }

    // Get paginated results
    const offset = (validPage - 1) * validLimit;
    const businesses = await db
      .select({
        id: businessPages.id,
        title: businessPages.title,
        slug: businessPages.slug,
        ownerId: businessPages.ownerId,
        categoryId: businessPages.categoryId,
        entityType: businessPages.entityType,
        status: businessPages.status,
        bannerImageId: businessPages.bannerImageId,
        profileImageId: businessPages.profileImageId,
        contactName: businessPages.contactName,
        contactNumber: businessPages.contactNumber,
        email: businessPages.email,
        address: businessPages.address,
        openingHours: businessPages.openingHours,
        aboutUs: businessPages.aboutUs,
        tags: businessPages.tags,
        industry: businessPages.industry,
        likes: businessPages.likes,
        ratingAverage: businessPages.ratingAverage,
        ratingCount: businessPages.ratingCount,
        views: businessPages.views,
        publishDate: businessPages.publishDate,
        expiryDate: businessPages.expiryDate,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(businessPages)
      .leftJoin(categories, eq(businessPages.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all();

    return success({
      businesses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get related businesses (same category, different slug)
 */
export async function getRelatedBusinesses(
  slug: string,
  categoryId: string | null,
  limit = 4
): Promise<Result<BusinessWithCategory[]>> {
  try {
    const db = await getDb();
    const conditions = [
      eq(businessPages.status, 'live'),
      sql`${businessPages.slug} != ${slug}`,
    ];

    if (categoryId) {
      conditions.push(eq(businessPages.categoryId, categoryId));
    }

    const results = await db
      .select({
        id: businessPages.id,
        title: businessPages.title,
        slug: businessPages.slug,
        ownerId: businessPages.ownerId,
        categoryId: businessPages.categoryId,
        entityType: businessPages.entityType,
        status: businessPages.status,
        bannerImageId: businessPages.bannerImageId,
        profileImageId: businessPages.profileImageId,
        contactName: businessPages.contactName,
        contactNumber: businessPages.contactNumber,
        email: businessPages.email,
        address: businessPages.address,
        openingHours: businessPages.openingHours,
        aboutUs: businessPages.aboutUs,
        tags: businessPages.tags,
        industry: businessPages.industry,
        likes: businessPages.likes,
        ratingAverage: businessPages.ratingAverage,
        ratingCount: businessPages.ratingCount,
        views: businessPages.views,
        publishDate: businessPages.publishDate,
        expiryDate: businessPages.expiryDate,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(businessPages)
      .leftJoin(categories, eq(businessPages.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(businessPages.likes))
      .limit(limit)
      .all();

    return success(results);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Get businesses by owner ID
 */
export async function getBusinessesByOwnerId(
  ownerId: string
): Promise<Result<BusinessWithCategory[]>> {
  try {
    const db = await getDb();
    const results = await db
      .select({
        id: businessPages.id,
        title: businessPages.title,
        slug: businessPages.slug,
        ownerId: businessPages.ownerId,
        categoryId: businessPages.categoryId,
        entityType: businessPages.entityType,
        status: businessPages.status,
        bannerImageId: businessPages.bannerImageId,
        profileImageId: businessPages.profileImageId,
        contactName: businessPages.contactName,
        contactNumber: businessPages.contactNumber,
        email: businessPages.email,
        address: businessPages.address,
        openingHours: businessPages.openingHours,
        aboutUs: businessPages.aboutUs,
        tags: businessPages.tags,
        industry: businessPages.industry,
        likes: businessPages.likes,
        ratingAverage: businessPages.ratingAverage,
        ratingCount: businessPages.ratingCount,
        views: businessPages.views,
        publishDate: businessPages.publishDate,
        expiryDate: businessPages.expiryDate,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(businessPages)
      .leftJoin(categories, eq(businessPages.categoryId, categories.id))
      .where(eq(businessPages.ownerId, ownerId))
      .orderBy(desc(businessPages.createdAt))
      .all();

    return success(results);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Check if slug is unique
 */
export async function isBusinessSlugUnique(
  slug: string,
  excludeId?: string
): Promise<Result<boolean>> {
  try {
    const db = await getDb();
    const conditions = [eq(businessPages.slug, slug)];
    if (excludeId) {
      conditions.push(sql`${businessPages.id} != ${excludeId}`);
    }

    const existing = await db
      .select({ id: businessPages.id })
      .from(businessPages)
      .where(and(...conditions))
      .limit(1)
      .get();

    return success(!existing);
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}