// API endpoint to get all public sectors with filters
export const prerender = false;

import { getDb } from '@/lib/db';
import { publicSectors, publicSectorCategories } from '@/db/schema';
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
if (!db) throw new Error("Database not available");

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimitKV(`public sectors:${clientIP}`);

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
        .from(publicSectorCategories)
        .where(eq(publicSectorCategories.slug, category))
        .limit(1)
        .all();
      if (cat.length > 0 && cat[0]) {
        categoryId = cat[0].id!;
      }
    }

    // Build conditions - include both 'live' and 'published' status
    const conditions: SQL[] = [
      or(
        eq(publicSectors.status, 'live'),
        eq(publicSectors.status, 'published')
      )!

    ];

    if (search) {
      conditions.push(
        or(
          like(publicSectors.title, `%${search}%`),
          like(publicSectors.aboutUs, `%${search}%`),
          like(publicSectors.tags, `%${search}%`)
        )!
      );
    }

    if (categoryId) {
      conditions.push(eq(publicSectors.categoryId, categoryId));
    }

    // Query publicSectors table
    let results = await db.select({
      id: publicSectors.id,
      title: publicSectors.title,
      slug: publicSectors.slug,
      address: publicSectors.address,
      tags: publicSectors.tags,
      likes: publicSectors.likes,
      saves: publicSectors.saves,
      views: publicSectors.views,
      createdAt: publicSectors.createdAt,
      categoryId: publicSectors.categoryId,
    })
    .from(publicSectors)
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
      case 'name':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // recent
        results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    // Apply pagination
    const paginated = results.slice(offset, offset + limit);
    const total = results.length;

    // Get category names
    const categoryMap = new Map<string, string>();
    const allCategories = await db.select().from(publicSectorCategories).all() as { id: string; name: string }[];
    allCategories.forEach((cat) => categoryMap.set(cat.id, cat.name));

    const responseData = paginated.map((ps) => ({
      ...ps,
      tags: ps.tags ? JSON.parse(ps.tags) : [],
      categoryName: categoryMap.get(ps.categoryId || '') || 'Public Sector',
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
