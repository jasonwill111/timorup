// API endpoint to get featured businesses
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses, businessCategories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  const db = await getDb();
if (!db) throw new Error("Database not available");
  const featuredBusinesses = await db.select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      categoryId: businesses.categoryId,
      status: businesses.status,
      bannerImageId: businesses.bannerImageId,
      profileImageId: businesses.profileImageId,
      contactName: businesses.contactName,
      contactNumber: businesses.contactNumber,
      countryCode: businesses.countryCode,
      email: businesses.email,
      address: businesses.address,
      aboutUs: businesses.aboutUs,
      tags: businesses.tags,
      likes: businesses.likes,
      saves: businesses.saves,
      ratingAverage: businesses.ratingAverage,
      ratingCount: businesses.ratingCount,
      views: businesses.views,
      planType: businesses.planType,
    })
    .from(businesses)
    .where(eq(businesses.status, 'active'))
    .orderBy(sql`(likes * 3 + saves * 1 + views * 0.01) DESC`)
    .limit(8);

  // Get category names
  const categoryMap = new Map<string, typeof businessCategories.$inferSelect>();
  const allCategories = await db.select().from(businessCategories);
  allCategories.forEach((cat) => categoryMap.set(cat.id, cat));

  // Add category name to businesses
  const businessesWithCategory = featuredBusinesses.map((biz) => ({
    ...biz,
    categoryName: categoryMap.get(biz.categoryId)?.name || 'Business',
  }));

  // Cache in production: stale-while-revalidate for 60 seconds (featured changes less often)
  const cacheHeaders = import.meta.env.PROD
    ? { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=600' }
    : { 'Cache-Control': 'no-store' };

  return new Response(JSON.stringify({
    success: true,
    data: businessesWithCategory,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...cacheHeaders,
    },
  });
}
