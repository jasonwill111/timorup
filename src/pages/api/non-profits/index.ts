// API endpoint to get all non-profits with filters
export const prerender = false;

import { getDb } from '@/lib/db';
import { nonProfits, nonProfitCategories as categories } from '@/db/schema';
import { eq, desc, like, and, or, type SQL } from 'drizzle-orm';
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

export async function GET({ url, request }: { url: URL; request: Request }) {
  const db = await getDb();

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimitKV(`nonprofits:${clientIP}`);

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
    const { page, limit } = PaginationSchema.parse({
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '12',
    });
    const offset = (page - 1) * limit;

    // Get category ID if filtering
    let categoryId = '';
    if (category) {
      const cat = await db.select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1)
        .all();
      if (cat.length > 0) {
        categoryId = cat[0].id;
      }
    }

    // Build conditions - include both 'live' and 'published' status
    const conditions: SQL[] = [
      or(
        eq(nonProfits.status, 'live'),
        eq(nonProfits.status, 'published')
      )!

    ];

    if (search) {
      conditions.push(
        or(
          like(nonProfits.title, `%${search}%`),
          like(nonProfits.aboutUs, `%${search}%`),
          like(nonProfits.tags, `%${search}%`)
        )!
      );
    }

    if (categoryId) {
      conditions.push(eq(nonProfits.categoryId, categoryId));
    }

    // Query nonProfits table
    let results = await db.select({
      id: nonProfits.id,
      title: nonProfits.title,
      slug: nonProfits.slug,
      entityType: nonProfits.entityType,
      profileImageId: nonProfits.profileImageId,
      address: nonProfits.address,
      tags: nonProfits.tags,
      likes: nonProfits.likes,
      saves: nonProfits.saves,
      views: nonProfits.views,
      ratingAverage: nonProfits.ratingAverage,
      ratingCount: nonProfits.ratingCount,
      createdAt: nonProfits.createdAt,
    })
    .from(nonProfits)
    .where(and(...conditions))
    .all();

    // Apply sorting
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
      default: // recent
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Apply pagination
    const paginated = results.slice(offset, offset + limit);
    const total = results.length;

    // Get category names
    const categoryMap = new Map<string, string>();
    const allCategories = await db.select().from(categories).all();
    allCategories.forEach((cat) => categoryMap.set(cat.id, cat.name));

    const responseData = paginated.map((np) => ({
      ...np,
      tags: np.tags ? JSON.parse(np.tags) : [],
      categoryName: categoryMap.get(np.categoryId) || 'Non-Profit',
    }));

    return new Response(JSON.stringify({
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
