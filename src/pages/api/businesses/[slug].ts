// API endpoint to get single business by slug (GET) and update it (PUT)
export const prerender = false;

import { getDb } from '@/lib/db';
import { initAuth } from '@/lib/auth';
import { businesses, businessCategories, products, reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimitKV, getRateLimitHeaders } from '@/lib/rate-limit';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Cache TTL settings (in seconds)
const CACHE_TTL = 60; // 1 minute
const CACHE_TTL_404 = 300; // 5 minutes for not found

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

// Cloudflare Cache API helper
async function getCachedResponse(cacheKey: string): Promise<Response | null> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    return await cache.match(cacheKey) ?? null;
  } catch {
    return null;
  }
}

async function cacheResponse(cacheKey: string, response: Response, ttl: number): Promise<void> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    const clonedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl * 5}`,
      },
    });
    await cache.put(cacheKey, clonedResponse);
  } catch {
    // Cache API not available (e.g., local dev)
  }
}

async function purgeCache(cacheKey: string): Promise<void> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    await cache.delete(cacheKey);
  } catch {
    // Ignore errors
  }
}

export async function GET({ params, request }: { params: { slug: string }; request: Request }) {
  const db = await getDb();
if (!db) throw new Error("Database not available");
  const { slug } = params;
  const cacheKey = `/api/businesses/${slug}`;

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
        'Retry-After': rateLimit.resetIn.toString(),
        ...getRateLimitHeaders(rateLimit),
      },
    });
  }

  // Check Cloudflare Cache first
  const cachedResponse = await getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const business = await db.select()
      .from(businesses)
      .where(eq(businesses.slug, slug))
      .limit(1)
      .get() ?? undefined;

    if (!business) {
      // Cache 404s to prevent bot abuse
      const notFoundResponse = new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await cacheResponse(cacheKey, notFoundResponse, CACHE_TTL_404);
      return notFoundResponse;
    }

    let categoryName = 'Business';
    let categorySlug = 'business';
    if (business.categoryId) {
      const cat = await db.select()
        .from(businessCategories)
        .where(eq(businessCategories.id, business.categoryId))
        .limit(1)
        .get() ?? undefined;
      if (cat) {
        categoryName = cat.name;
        categorySlug = cat.slug;
      }
    }

    // Only fetch products and reviews for businesses, not nonprofits
    // Check by status instead of entityType field
    const isNonprofit = (business as Record<string, unknown>).status === 'nonprofit';
    let businessProducts: Record<string, unknown>[] = [];
    let businessReviews: Record<string, unknown>[] = [];

    if (!isNonprofit) {
      businessProducts = await db.select()
        .from(products)
        .where(eq(products.businessId, business.id))
        .all();

      businessReviews = await db.select()
        .from(reviews)
        .where(eq(reviews.businessId, business.id))
        .orderBy(desc(reviews.createdAt))
        .all();
    }

    const response = new Response(JSON.stringify({
      success: true,
      data: {
        ...business,
        categoryName,
        categorySlug,
        products: businessProducts,
        reviews: businessReviews,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Cache successful response
    await cacheResponse(cacheKey, response, CACHE_TTL);

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

export async function PUT({ params, request }: { params: { slug: string }; request: Request }) {
  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const { slug } = params;

    const cookieHeader = request.headers.get('cookie') || '';
    const authApi = (await initAuth()).api;
    const session = await authApi.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!session?.user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in to update a business' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = session.user.id;

    const existing = await db.select()
      .from(businesses)
      .where(eq(businesses.slug, slug))
      .limit(1)
      .get() ?? undefined;

    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    if (existing.ownerId !== userId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to edit this business' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as {
      title?: string;
      slug?: string;
      categoryId?: string;
      contactName?: string;
      contactNumber?: string;
      countryCode?: string;
      email?: string;
      address?: string;
      aboutUs?: string;
      tags?: string[];
      openingHours?: Record<string, unknown>;
      latitude?: number;
      longitude?: number;
      yearOfEstablishment?: number;
      registrationUrl?: string;
      bannerImageId?: string;
      profileImageId?: string;
      socialLinks?: string;
    };
    const {
      title, slug: newSlug, categoryId, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude, yearOfEstablishment, registrationUrl,
      bannerImageId, profileImageId, socialLinks
    } = body;

    const updateValues: Record<string, unknown> = {};
    if (title !== undefined) updateValues.title = title;
    if (newSlug !== undefined) updateValues.slug = newSlug;
    if (categoryId !== undefined) updateValues.categoryId = categoryId || null;
    if (contactName !== undefined) updateValues.contactName = contactName || null;
    if (contactNumber !== undefined) updateValues.contactNumber = contactNumber || null;
    if (countryCode !== undefined) updateValues.countryCode = countryCode || '+670';
    if (email !== undefined) updateValues.email = email || null;
    if (address !== undefined) updateValues.address = address || null;
    if (aboutUs !== undefined) updateValues.aboutUs = aboutUs || null;
    if (tags !== undefined) updateValues.tags = Array.isArray(tags) ? JSON.stringify(tags) : (tags || null);
    if (openingHours !== undefined) updateValues.openingHours = openingHours ? JSON.stringify(openingHours) : null;
    if (latitude !== undefined) updateValues.locationLat = latitude || null;
    if (longitude !== undefined) updateValues.locationLng = longitude || null;
    if (yearOfEstablishment !== undefined) updateValues.yearOfEstablishment = yearOfEstablishment || null;
    if (registrationUrl !== undefined) updateValues.registrationUrl = registrationUrl || null;
    // Image fields
    if (bannerImageId !== undefined) updateValues.bannerImageId = bannerImageId || null;
    if (profileImageId !== undefined) updateValues.profileImageId = profileImageId || null;
    if (socialLinks !== undefined) updateValues.socialLinks = socialLinks ? JSON.stringify(socialLinks) : null;
    // Note: latestUpdate and photo_gallery now use separate tables (latestUpdate, media)

    if (Object.keys(updateValues).length > 0) {
      updateValues.updatedAt = Math.floor(Date.now() / 1000);
      await db.update(businesses)
        .set(updateValues)
        .where(eq(businesses.slug, slug))
        .run();

      // Purge cache so next GET sees updated data
      await purgeCache(`/api/businesses/${slug}`);
    }

    const updated = await db.select()
      .from(businesses)
      .where(eq(businesses.slug, slug))
      .limit(1)
      .get() ?? undefined;

    return new Response(JSON.stringify({
      success: true,
      data: updated
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
