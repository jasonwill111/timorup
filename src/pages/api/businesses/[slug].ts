// API endpoint to get single business by slug (GET) and update it (PUT)
export const prerender = false;

import { getDb } from '@/lib/db';
import { initAuth } from '@/lib/auth';
import { businessPages, categories, products, reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

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
    const cache = caches.default;
    await cache.delete(cacheKey);
  } catch {
    // Ignore errors
  }
}

export async function GET({ params, request }: { params: { slug: string }; request: Request }) {
  const db = await getDb();
  const { slug } = params;
  const cacheKey = `/api/businesses/${slug}`;

  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`biz:${clientIP}`);

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
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

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
        .from(categories)
        .where(eq(categories.id, business.categoryId))
        .limit(1)
        .get();
      if (cat) {
        categoryName = cat.name;
        categorySlug = cat.slug;
      }
    }

    // Only fetch products and reviews for businesses, not nonprofits
    let businessProducts: typeof products.$inferSelect[] = [];
    let businessReviews: typeof reviews.$inferSelect[] = [];

    if (business.entityType !== 'nonprofit') {
      businessProducts = await db.select()
        .from(products)
        .where(eq(products.businessPageId, business.id))
        .all();

      businessReviews = await db.select()
        .from(reviews)
        .where(eq(reviews.businessPageId, business.id))
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
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

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

    const body = await request.json();
    const {
      title, slug: newSlug, categoryId, industry, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude, yearOfEstablishment, latestUpdates,
      registrationUrl, bannerImageId, profileImageId, socialLinks,
      photoGallery
    } = body;

    const updateValues: Record<string, unknown> = {};
    if (title !== undefined) updateValues.title = title;
    if (newSlug !== undefined) updateValues.slug = newSlug;
    if (categoryId !== undefined) updateValues.categoryId = categoryId || null;
    if (industry !== undefined) updateValues.industry = industry || null;
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
    if (latestUpdates !== undefined) updateValues.latestUpdates = latestUpdates || null;
    if (registrationUrl !== undefined) updateValues.registrationUrl = registrationUrl || null;
    // Image fields
    if (bannerImageId !== undefined) updateValues.bannerImageId = bannerImageId || null;
    if (profileImageId !== undefined) updateValues.profileImageId = profileImageId || null;
    if (socialLinks !== undefined) updateValues.socialLinks = socialLinks ? JSON.stringify(socialLinks) : null;
    if (photoGallery !== undefined) updateValues.photoGallery = photoGallery ? JSON.stringify(photoGallery) : null;

    if (Object.keys(updateValues).length > 0) {
      updateValues.updatedAt = Math.floor(Date.now() / 1000);
      await db.update(businessPages)
        .set(updateValues)
        .where(eq(businessPages.slug, slug))
        .run();

      // Purge cache so next GET sees updated data
      await purgeCache(`/api/businesses/${slug}`);
    }

    const updated = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

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
