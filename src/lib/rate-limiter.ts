/**
 * Rate Limiter Factory
 * Creates the appropriate rate limiter adapter based on environment
 */
import type { RateLimiterAdapter, RateLimiterConfig } from './rate-limiter-adapter';
import { KVRateLimiterAdapter } from './kv-rate-limiter-adapter';
import { InMemoryRateLimiterAdapter } from './in-memory-rate-limiter-adapter';

export type CloudflareEnv = {
  SESSION?: KVNamespace;
  [key: string]: unknown;
};

/**
 * Create rate limiter adapter based on available environment
 */
export function createRateLimiter(env: CloudflareEnv, config?: Partial<RateLimiterConfig>): RateLimiterAdapter {
  // Use KV if available (production)
  if (env.SESSION) {
    return new KVRateLimiterAdapter(env.SESSION, {
      windowMs: config?.windowMs ?? 60000,
      maxRequests: config?.maxRequests ?? 100,
    });
  }

  // Fall back to in-memory for local development / testing
  return new InMemoryRateLimiterAdapter({
    windowMs: config?.windowMs ?? 60000,
    maxRequests: config?.maxRequests ?? 100,
  });
}

// Re-export types
export type { RateLimiterAdapter, RateLimitResult, RateLimiterConfig } from './rate-limiter-adapter';
export { DEFAULT_CONFIG } from './rate-limiter-adapter';
export { KVRateLimiterAdapter } from './kv-rate-limiter-adapter';
export { InMemoryRateLimiterAdapter } from './in-memory-rate-limiter-adapter';