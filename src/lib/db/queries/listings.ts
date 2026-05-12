/**
 * Listing Query Functions
 * 统一 business listings 数据访问
 */
import { getDb } from '@/lib/db';
import { businessPages, categories, products, media } from '@/db/schema';
import { eq, desc, asc, like, and, or, sql, count } from 'drizzle-orm';

export interface ListingWithCategory {
  id: string;
  title: string;
  slug: string;
  entityType: string;
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
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      entityType: businessPages.entityType,
      categoryId: businessPages.categoryId,
      profileImageId: businessPages.profileImageId,
      bannerImageId: businessPages.bannerImageId,
      address: businessPages.address,
      tags: businessPages.tags,
      status: businessPages.status,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(businessPages)
    .leftJoin(categories, eq(businessPages.categoryId, categories.id))
    .where(eq(businessPages.slug, slug))
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
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      entityType: businessPages.entityType,
      categoryId: businessPages.categoryId,
      profileImageId: businessPages.profileImageId,
      bannerImageId: businessPages.bannerImageId,
      address: businessPages.address,
      tags: businessPages.tags,
      status: businessPages.status,
    })
    .from(businessPages)
    .where(eq(businessPages.ownerId, userId))
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

  const conditions = [eq(businessPages.entityType, entityType)];
  if (status) {
    conditions.push(eq(businessPages.status, status));
  }

  return db
    .select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      entityType: businessPages.entityType,
      categoryId: businessPages.categoryId,
      profileImageId: businessPages.profileImageId,
      bannerImageId: businessPages.bannerImageId,
      address: businessPages.address,
      tags: businessPages.tags,
      status: businessPages.status,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(businessPages)
    .leftJoin(categories, eq(businessPages.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(businessPages.likes))
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
    like(businessPages.title, searchPattern),
    like(businessPages.tags, searchPattern),
    like(businessPages.aboutUs, searchPattern)
  );

  const typeCondition = entityType !== 'all' ? eq(businessPages.entityType, entityType) : undefined;
  const whereClause = typeCondition ? and(conditions!, typeCondition) : conditions;

  return db
    .select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      entityType: businessPages.entityType,
      categoryId: businessPages.categoryId,
      profileImageId: businessPages.profileImageId,
      bannerImageId: businessPages.bannerImageId,
      address: businessPages.address,
      tags: businessPages.tags,
      status: businessPages.status,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(businessPages)
    .leftJoin(categories, eq(businessPages.categoryId, categories.id))
    .where(and(whereClause!, eq(businessPages.status, 'live')))
    .orderBy(desc(businessPages.likes))
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
    .where(eq(products.businessPageId, businessId))
    .get();

  return result?.count || 0;
}

/**
 * 检查 slug 是否唯一
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
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

  return !existing;
}
