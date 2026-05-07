// API endpoint to get all businesses with filters
export const prerender = false;

import { getDb } from '@/lib/db';
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

// Cache TTL (shorter for list endpoints - 30 seconds)
const CACHE_TTL_LIST = 30;

async function getCachedResponse(cacheKey: string): Promise<Response | null> {
  try {
    const cache = caches.default;
    return await cache.match(cacheKey);
  } catch {
    return null;
  }
}

async function cacheResponse(cacheKey: string, response: Response, ttl: number): Promise<void> {
  try {
    const cache = caches.default;
    const clonedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Cache-Control': `public, max-age=${ttl}`,
      },
    });
    await cache.put(cacheKey, clonedResponse);
  } catch {
    // Cache API not available locally
  }
}

export async function GET({ url, request }: { url: URL; request: Request }) {
  const db = await getDb();

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

  // Build cache key from query params
  const cacheKey = `/api/businesses${url.search}`;

  // Check cache (only for non-search queries to keep results fresh)
  const hasSearch = url.searchParams.get('search');
  if (!hasSearch) {
    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'recent';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    const type = url.searchParams.get('type') || ''; // 'business' | 'non-profit'
    const organizationType = url.searchParams.get('organizationType') || ''; // 'government' | 'ngo'

    // Build query conditions
    const conditions = [eq(businessPages.status, 'live')];

    // Filter by entity type (accept both 'nonprofit' and 'non-profit')
    if (type === 'nonprofit' || type === 'non-profit') {
      conditions.push(eq(businessPages.entityType, 'nonprofit'));
    } else if (type === 'business') {
      conditions.push(eq(businessPages.entityType, 'business'));
    } else if (type === 'organization') {
      // Legacy type - return empty (old data needs migration)
      conditions.push(eq(businessPages.entityType, '__nonexistent__'));
    }
    // Otherwise return all types

    // Filter by organization type (only if type=organization or no type filter)
    if (organizationType) {
      conditions.push(eq(businessPages.organizationType, organizationType));
    }

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
    const categoryMap = new Map<string, typeof categories.$inferSelect>();
    const allCategories = await db.select().from(categories).all();
    allCategories.forEach((cat) => categoryMap.set(cat.id, cat));

    // Add category name to businesses
    const businessesWithCategory = allBusinesses.map((biz) => ({
      ...biz,
      categoryName: categoryMap.get(biz.categoryId)?.name || 'Business',
    }));

    const response = new Response(JSON.stringify({
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
      },
    });

    // Cache non-search responses for 30 seconds
    if (!hasSearch) {
      await cacheResponse(cacheKey, response, CACHE_TTL_LIST);
    }

    return response;
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
