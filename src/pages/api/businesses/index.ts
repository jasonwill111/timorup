// API endpoint to get all businesses with filters
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses, businessCategories } from '@/db/schema';
import { eq, like, and, or, type SQL } from 'drizzle-orm';
import { checkRateLimitKV, getRateLimitHeaders } from '@/lib/rate-limit';
import { PaginationSchema } from '@/lib/validation';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

const CACHE_TTL = 30;

async function getCachedResponse(cacheKey: string): Promise<Response | null> {
  try {
    return await caches.default.match(cacheKey);
  } catch {
    return null;
  }
}

async function cacheResponse(cacheKey: string, response: Response, ttl: number): Promise<void> {
  try {
    const clonedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Cache-Control': `public, max-age=${ttl}`,
      },
    });
    await caches.default.put(cacheKey, clonedResponse);
  } catch {
    // Cache API not available locally
  }
}

export async function GET({ url, request }: { url: URL; request: Request }) {
  const db = await getDb();

  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimitKV(`businesses:${clientIP}`);

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

  const cacheKey = `/api/businesses${url.search}`;
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
    const { page, limit } = PaginationSchema.parse({
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '12',
    });
    const offset = (page - 1) * limit;

    let categoryId = '';
    if (category) {
      const cat = await db.select()
        .from(businessCategories)
        .where(eq(businessCategories.slug, category))
        .limit(1)
        .all();
      if (cat.length > 0) {
        categoryId = cat[0].id;
      }
    }

    // Build conditions - include both 'live' and 'published' status
    const conditions: SQL[] = [
      or(
        eq(businesses.status, 'live'),
        eq(businesses.status, 'published')
      )!

    ];

    if (search) {
      conditions.push(
        or(
          like(businesses.title, `%${search}%`),
          like(businesses.aboutUs, `%${search}%`),
          like(businesses.tags, `%${search}%`)
        )!
      );
    }

    if (categoryId) {
      conditions.push(eq(businesses.categoryId, categoryId));
    }

    let results = await db.select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      profileImageId: businesses.profileImageId,
      address: businesses.address,
      tags: businesses.tags,
      likes: businesses.likes,
      saves: businesses.saves,
      views: businesses.views,
      ratingAverage: businesses.ratingAverage,
      ratingCount: businesses.ratingCount,
      createdAt: businesses.createdAt,
    })
    .from(businesses)
    .where(and(...conditions))
    .all();

    switch (sort) {
      case 'popular':
        results.sort((a, b) => {
          const scoreA = (a.likes || 0) * 3 + (a.saves || 0) * 1 + (a.views || 0) * 0.01;
          const scoreB = (b.likes || 0) * 3 + (b.saves || 0) * 1 + (b.views || 0) * 0.01;
          return scoreB - scoreA;
        });
        break;
      case 'rating':
        results.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
        break;
      case 'name':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const paginated = results.slice(offset, offset + limit);
    const total = results.length;

    const categoryMap = new Map<string, string>();
    const allCategories = await db.select().from(businessCategories).all();
    allCategories.forEach((cat) => categoryMap.set(cat.id, cat.name));

    const responseData = paginated.map((biz) => ({
      ...biz,
      tags: biz.tags ? JSON.parse(biz.tags) : [],
      categoryName: categoryMap.get(biz.categoryId) || 'Business',
    }));

    const response = new Response(JSON.stringify({
      success: true,
      data: responseData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!hasSearch) {
      await cacheResponse(cacheKey, response, CACHE_TTL);
    }

    return response;
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
