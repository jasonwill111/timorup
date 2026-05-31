// Public API - Get active service packages
export const prerender = false;

import { getDb } from '@/lib/db';
import { servicePackages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

const CACHE_TTL = 300; // 5 minutes

async function getCachedResponse(cacheKey: string): Promise<Response | null> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    return await cache.match(cacheKey) ?? null;
  } catch {
    return null;
  }
}

async function cacheResponse(cacheKey: string, response: Response): Promise<void> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    const cloned = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Cache-Control': `public, max-age=${CACHE_TTL}`,
      },
    });
    await cache.put(cacheKey, cloned);
  } catch {
    // Cache not available locally
  }
}

export async function GET({ request }: { request: Request }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const url = new URL(request?.url);
  const cacheKey = url.pathname;

  // Check cache
  const cached = await getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const allPackages = await db.select()
      .from(servicePackages)
      .where(eq(servicePackages.isActive, 1))
      .orderBy(asc(servicePackages.sortOrder))
      .all();

    const packagesWithParsedFeatures = allPackages.map(pkg => ({
      ...pkg,
      variants: pkg.variants ? JSON.parse(pkg.variants) : [],
    }));

    const response = new Response(JSON.stringify({
      success: true,
      data: packagesWithParsedFeatures,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    await cacheResponse(cacheKey, response);

    return response;
  } catch (error) {
    console.error('Error fetching service packages:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch service packages' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
