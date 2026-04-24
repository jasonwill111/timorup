// API endpoint to get all businesses with filters
export const prerender = false;

import { db } from '@/lib/db';
import { businessPages, categories } from '@/db/schema';
import { eq, like, desc, sql, or, and, asc } from 'drizzle-orm';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

export async function GET({ url, request }: { url: URL; request: Request }) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`list:${clientIP}`);

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Rate limit exceeded. Please try again later.' }
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': rateLimit.resetIn.toString(),
        ...getRateLimitHeaders(rateLimit),
      },
    });
  }

  try {
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'recent';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [eq(businessPages.status, 'live')];
    
    if (search) {
      conditions.push(or(
        like(businessPages.title, `%${search}%`),
        like(businessPages.aboutUs, `%${search}%`),
        like(businessPages.tags, `%${search}%`)
      ));
    }

    // Get category by slug
    if (category) {
      const cat = await db.select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1)
        .all();

      if (cat.length > 0) {
        conditions.push(eq(businessPages.categoryId, cat[0].id));
      }
    }

    // Build order by
    let orderBy;
    switch (sort) {
      case 'popular':
        orderBy = desc(sql`(likes * 3 + saves * 1 + views * 0.01)`);
        break;
      case 'rating':
        orderBy = desc(businessPages.ratingAverage);
        break;
      case 'name':
        orderBy = asc(businessPages.title);
        break;
      default: // recent
        orderBy = desc(businessPages.createdAt);
    }

    // Get businesses
    const allBusinesses = await db.select()
      .from(businessPages)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .all();

    // Get total count
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(businessPages)
      .where(and(...conditions))
      .get();
    const total = Number(totalResult?.count) || 0;

    // Get category names
    const categoryMap = new Map();
    const allCategories = await db.select().from(categories).all();
    allCategories.forEach((cat: any) => categoryMap.set(cat.id, cat));

    // Add category name to businesses
    const businessesWithCategory = allBusinesses.map((biz: any) => ({
      ...biz,
      categoryName: categoryMap.get(biz.categoryId)?.name || 'Business',
    }));

    // Cache in production: shorter cache for filtered queries
    const cacheHeaders = process.env.NODE_ENV === 'production'
      ? { 'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=300' }
      : { 'Cache-Control': 'no-store' };

    return new Response(JSON.stringify({
      success: true,
      data: businessesWithCategory,
      pagination: {
        page,
        limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...cacheHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
