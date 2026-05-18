/**
 * Rate Limiter Adapter Interface
 * Replace stateful singleton with injectable adapter pattern
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimiterAdapter {
  check(identifier: string): Promise<RateLimitResult>;
  reset(identifier: string): Promise<void>;
}

// Default config
export const DEFAULT_CONFIG: RateLimiterConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
};

// Key prefix for KV storage
const KV_KEY_PREFIX = 'ratelimit:';