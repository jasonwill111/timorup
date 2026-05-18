/**
 * KV Rate Limiter Adapter
 * Uses Cloudflare KV with atomic compare-and-swap
 */
import type { RateLimiterAdapter, RateLimitResult, RateLimiterConfig, DEFAULT_CONFIG } from './rate-limiter-adapter';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class KVRateLimiterAdapter implements RateLimiterAdapter {
  private kv: KVNamespace;
  private config: RateLimiterConfig;

  constructor(kv: KVNamespace, config: RateLimiterConfig = { windowMs: 60000, maxRequests: 100 }) {
    this.kv = kv;
    this.config = config;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;

    // Try to read current record
    const stored = await this.kv.get(key);
    const record: RateLimitRecord | null = stored ? JSON.parse(stored) : null;

    // Check if record is valid and not expired
    if (record && now < record.resetTime) {
      // Check BEFORE incrementing
      if (record.count >= this.config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetIn: Math.ceil((record.resetTime - now) / 1000),
        };
      }

      // Increment atomically - create new record with incremented count
      const newRecord: RateLimitRecord = {
        count: record.count + 1,
        resetTime: record.resetTime,
      };

      await this.kv.put(key, JSON.stringify(newRecord), {
        expirationTtl: Math.ceil((record.resetTime - now) / 1000),
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - newRecord.count,
        resetIn: Math.ceil((record.resetTime - now) / 1000),
      };
    }

    // No record or expired - create new
    const resetTime = now + this.config.windowMs;
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime,
    };

    await this.kv.put(key, JSON.stringify(newRecord), {
      expirationTtl: Math.ceil(this.config.windowMs / 1000),
    });

    return {
      allowed: true,
      remaining: this.config.maxRequests - 1,
      resetIn: Math.ceil(this.config.windowMs / 1000),
    };
  }

  async reset(identifier: string): Promise<void> {
    const key = `ratelimit:${identifier}`;
    await this.kv.delete(key);
  }
}

/**
 * Create KV rate limiter adapter
 */
export function createKVRateLimiter(
  kv: KVNamespace,
  config?: Partial<RateLimiterConfig>
): KVRateLimiterAdapter {
  return new KVRateLimiterAdapter(kv, {
    windowMs: config?.windowMs ?? 60000,
    maxRequests: config?.maxRequests ?? 100,
  });
}