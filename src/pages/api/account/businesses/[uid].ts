// API endpoint to get businesses owned by a user
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses, businessCategories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimitKV, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';
import { auth } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

async function requireAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
  try {
    const authApi = (auth as unknown as { api: typeof auth.api }).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    if (!user) {
      return { authorized: false, error: new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
    }
    return { authorized: true, user };
  } catch {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
}

const ParamsSchema = z.object({
  uid: z.string().min(1, { error: 'User ID is required' }),
});

export async function GET({ params, request }: { params: Record<string, string>; request: Request }) {
  const db = await getDb();
  // Auth check
  const authResult = await requireAuth(request);
  if (!authResult.authorized) return authResult.error;

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimitKV(`biz:${clientIP}`);

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Rate limit exceeded. Please try again later.' }
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(rateLimit),
      },
    });
  }

  // Validate params
  const parseResult = ParamsSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Invalid user ID' }
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { uid } = parseResult.data;

  try {
    // Get user's businesses
    const businessList = await db.select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      status: businesses.status,
      categoryId: businesses.categoryId,
      createdAt: businesses.createdAt,
      ratingAverage: businesses.ratingAverage,
      views: businesses.views,
      planType: businesses.planType,
    })
    .from(businesses)
    .where(eq(businesses.ownerId, uid))
    .orderBy(desc(businesses.createdAt))
    .all();

    // Get category names
    const categoryMap = new Map();
    const cats = await db.select().from(businessCategories).all();
    cats.forEach((cat: { id: string; name: string }) => categoryMap.set(cat.id, cat.name));

    // Add category names
    const businessesWithCategory = businessList.map((biz: { categoryId: string | null }) => ({
      ...biz,
      categoryName: biz.categoryId ? (categoryMap.get(biz.categoryId) || 'Uncategorized') : 'Uncategorized',
    }));

    return new Response(JSON.stringify({
      success: true,
      data: businessesWithCategory
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
