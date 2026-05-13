/**
 * Listing Query Functions
 * 统一 business listings 数据访问
 */
import { getDb } from '@/lib/db';
import { businesses, listingCategories, products, media } from '@/db/schema';
import { eq, desc, asc, like, and, or, sql, count } from 'drizzle-orm';

export interface ListingWithCategory {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  profileImageId: string | null;
  bannerImageId: string | null;
  address: string | null;
  tags: string | null;
  status: string | null;
  categoryName?: string;
  categorySlug?: string;
}

/**
 * 获取 listing by slug
 */
export async function getListingBySlug(slug: string): Promise<ListingWithCategory | null> {
  const db = await getDb();

  const result = await db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      categoryId: businesses.categoryId,
      profileImageId: businesses.profileImageId,
      bannerImageId: businesses.bannerImageId,
      address: businesses.address,
      tags: businesses.tags,
      status: businesses.status,
      categoryName: listingCategories.name,
      categorySlug: listingCategories.slug,
    })
    .from(businesses)
    .leftJoin(listingCategories, eq(businesses.categoryId, listingCategories.id))
    .where(eq(businesses.slug, slug))
    .limit(1)
    .get();

  return result || null;
}

/**
 * 获取用户的 listing
 */
export async function getUserListing(userId: string): Promise<ListingWithCategory | null> {
  const db = await getDb();

  const result = await db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      categoryId: businesses.categoryId,
      profileImageId: businesses.profileImageId,
      bannerImageId: businesses.bannerImageId,
      address: businesses.address,
      tags: businesses.tags,
      status: businesses.status,
    })
    .from(businesses)
    .where(eq(businesses.ownerId, userId))
    .limit(1)
    .get();

  return result || null;
}

/**
 * 获取 listings by entity type
 */
export async function getListingsByType(
  entityType: 'business' | 'nonprofit',
  options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }
): Promise<ListingWithCategory[]> {
  const db = await getDb();
  const { limit = 20, offset = 0, status = 'live' } = options || {};

  const conditions = [eq(businesses.entityType, entityType)];
  if (status) {
    conditions.push(eq(businesses.status, status));
  }

  return db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      categoryId: businesses.categoryId,
      profileImageId: businesses.profileImageId,
      bannerImageId: businesses.bannerImageId,
      address: businesses.address,
      tags: businesses.tags,
      status: businesses.status,
      categoryName: listingCategories.name,
      categorySlug: listingCategories.slug,
    })
    .from(businesses)
    .leftJoin(listingCategories, eq(businesses.categoryId, listingCategories.id))
    .where(and(...conditions))
    .orderBy(desc(businesses.likes))
    .limit(limit)
    .offset(offset)
    .all();
}

/**
 * 搜索 listings
 */
export async function searchListings(
  query: string,
  options?: {
    limit?: number;
    entityType?: 'business' | 'nonprofit' | 'all';
  }
): Promise<ListingWithCategory[]> {
  const db = await getDb();
  const { limit = 20, entityType = 'all' } = options || {};

  const searchPattern = `%${query}%`;
  const conditions = or(
    like(businesses.title, searchPattern),
    like(businesses.tags, searchPattern),
    like(businesses.aboutUs, searchPattern)
  );

  const typeCondition = entityType !== 'all' ? eq(businesses.entityType, entityType) : undefined;
  const whereClause = typeCondition ? and(conditions!, typeCondition) : conditions;

  return db
    .select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      categoryId: businesses.categoryId,
      profileImageId: businesses.profileImageId,
      bannerImageId: businesses.bannerImageId,
      address: businesses.address,
      tags: businesses.tags,
      status: businesses.status,
      categoryName: listingCategories.name,
      categorySlug: listingCategories.slug,
    })
    .from(businesses)
    .leftJoin(listingCategories, eq(businesses.categoryId, listingCategories.id))
    .where(and(whereClause!, eq(businesses.status, 'live')))
    .orderBy(desc(businesses.likes))
    .limit(limit)
    .all();
}

/**
 * 获取 listing 的产品数量
 */
export async function getListingProductCount(businessId: string): Promise<number> {
  const db = await getDb();

  const result = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.businessId, businessId))
    .get();

  return result?.count || 0;
}

/**
 * 检查 slug 是否唯一
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const db = await getDb();

  const conditions = [eq(businesses.slug, slug)];
  if (excludeId) {
    conditions.push(sql`${businesses.id} != ${excludeId}`);
  }

  const existing = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(and(...conditions))
    .limit(1)
    .get();

  return !existing;
}
