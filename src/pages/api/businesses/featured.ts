// API endpoint to get featured businesses
export const prerender = false;

import { db } from '@/lib/db';
import { businessPages, categories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  const featuredBusinesses = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      categoryId: businessPages.categoryId,
      status: businessPages.status,
      bannerImageId: businessPages.bannerImageId,
      profileImageId: businessPages.profileImageId,
      contactName: businessPages.contactName,
      contactNumber: businessPages.contactNumber,
      countryCode: businessPages.countryCode,
      email: businessPages.email,
      address: businessPages.address,
      aboutUs: businessPages.aboutUs,
      tags: businessPages.tags,
      likes: businessPages.likes,
      saves: businessPages.saves,
      ratingAverage: businessPages.ratingAverage,
      ratingCount: businessPages.ratingCount,
      views: businessPages.views,
      planType: businessPages.planType,
    })
    .from(businessPages)
    .where(eq(businessPages.status, 'live'))
    .orderBy(sql`(likes * 3 + saves * 1 + views * 0.01) DESC`)
    .limit(8);

  // Get category names
  const categoryMap = new Map();
  const allCategories = await db.select().from(categories);
  allCategories.forEach((cat: any) => categoryMap.set(cat.id, cat));

  // Add category name to businesses
  const businessesWithCategory = featuredBusinesses.map((biz: any) => ({
    ...biz,
    categoryName: categoryMap.get(biz.categoryId)?.name || 'Business',
  }));

  // Cache in production: stale-while-revalidate for 60 seconds (featured changes less often)
  const cacheHeaders = process.env.NODE_ENV === 'production'
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
