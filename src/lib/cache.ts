/**
 * KV Cache Utility - Cloudflare Workers
 *
 * Provides caching layer for D1 queries to reduce database load.
 * Note: KV TTL minimum is 60 seconds.
 */

interface CacheOptions {
  /** Time to live in seconds (minimum 60) */
  ttl: number;
  /** Custom KV namespace binding */
  namespace?: KVNamespace;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
}

let cacheStats: CacheStats = { hits: 0, misses: 0, hitRate: 0 };

/**
 * Get KV namespace from environment
 */
async function getKVNamespace(): Promise<KVNamespace | null> {
  try {
    const { env } = await import('cloudflare:workers');
    return (env as Record<string, unknown>).SESSION as KVNamespace;
  } catch {
    return null;
  }
}

/**
 * Get cached value from KV
 */
async function getFromKV<T>(key: string, kv: KVNamespace): Promise<T | null> {
  const value = await kv.get(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Set cached value to KV
 */
async function setToKV<T>(key: string, value: T, kv: KVNamespace, ttl: number): Promise<void> {
  // KV TTL minimum is 60 seconds
  const effectiveTtl = Math.max(ttl, 60);
  await kv.put(key, JSON.stringify(value), {
    expirationTtl: effectiveTtl,
  });
}

/**
 * Invalidate cache key
 */
async function invalidateKV(key: string, kv: KVNamespace): Promise<void> {
  await kv.delete(key);
}

/**
 * Get cached data or fetch and cache it
 *
 * @example
 * const categories = await cachedGet(
 *   'categories:business',
 *   () => db.select().from(businessCategories).all(),
 *   { ttl: 300 }
 * );
 */
export async function cachedGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const kv = await getKVNamespace();
  if (!kv) {
    // No KV available, fetch directly
    return fetcher();
  }

  try {
    // Try cache first
    const cached = await getFromKV<T>(key, kv);
    if (cached !== null) {
      cacheStats.hits++;
      cacheStats.hitRate = cacheStats.hits / (cacheStats.hits + cacheStats.misses);
      return cached;
    }
  } catch (e) {
    console.warn(`[Cache] KV read failed for ${key}:`, e);
  }

  // Cache miss
  cacheStats.misses++;
  cacheStats.hitRate = cacheStats.hits / (cacheStats.hits + cacheStats.misses);

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache (fire and forget)
  setToKV(key, data, kv, options.ttl).catch((e) => {
    console.warn(`[Cache] KV write failed for ${key}:`, e);
  });

  return data;
}

/**
 * Get cache stats
 */
export function getCacheStats(): CacheStats {
  return { ...cacheStats };
}

/**
 * Reset cache stats
 */
export function resetCacheStats(): void {
  cacheStats = { hits: 0, misses: 0, hitRate: 0 };
}

/**
 * Invalidate specific cache keys
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  const kv = await getKVNamespace();
  if (!kv) return;

  await Promise.all(keys.map((key) => invalidateKV(key, kv)));
}

/**
 * Invalidate cache keys by pattern (prefix matching)
 * Note: This requires listing all keys which can be slow
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const kv = await getKVNamespace();
  if (!kv) return;

  try {
    const list = await kv.list({ prefix: pattern });
    await Promise.all(list.keys.map((key) => kv.delete(key.name)));
  } catch (e) {
    console.warn(`[Cache] Pattern invalidation failed for ${pattern}:`, e);
  }
}

// Cache key builders for consistent naming
export const cacheKeys = {
  categories: (type: string) => `categories:${type}`,
  business: (slug: string) => `business:${slug}`,
  listing: (slug: string) => `listing:${slug}`,
  nonProfit: (slug: string) => `non-profit:${slug}`,
  publicSector: (slug: string) => `public-sector:${slug}`,
  popularItems: (type: string) => `popular:${type}`,
  siteStats: () => 'stats:site',
} as const;
