// Public API - Get active plans
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
    // Get active plans sorted by sortOrder
    const allPlans = await db.select()
      .from(servicePackages)
      .where(eq(plans.isActive, true))
      .orderBy(asc(plans.sortOrder))
      .all();

    // Parse variants JSON for each plan
    const plansWithParsedFeatures = allPlans.map(plan => ({
      ...plan,
      variants: plan.variants ? JSON.parse(plan.variants) : [],
    }));

    const response = new Response(JSON.stringify({
      success: true,
      data: plansWithParsedFeatures,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    await cacheResponse(cacheKey, response);

    return response;
  } catch (error) {
    console.error('Error fetching plans:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch plans' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
