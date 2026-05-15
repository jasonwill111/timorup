// Rate limiter for Cloudflare Workers
// Primary: KV-backed (distributed, persists across cold starts)
// Fallback: in-memory Map (per-instance, resets on cold start)

import { env } from 'cloudflare:workers';

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests/min per IP

// In-memory fallback store (per-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check rate limit using KV storage (primary)
 * Falls back to in-memory if KV unavailable
 */
export async function checkRateLimitKV(identifier: string): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  try {
    // Try KV first
    if (env.SESSION) {
      const stored = await env.SESSION.get(key);
      const record = stored ? JSON.parse(stored) as { count: number; resetTime: number } : null;

      if (record && now < record.resetTime) {
        // Check limit BEFORE incrementing
        if (record.count >= MAX_REQUESTS_PER_WINDOW) {
          return {
            allowed: false,
            remaining: 0,
            resetIn: Math.ceil((record.resetTime - now) / 1000),
          };
        }
        // Valid record exists - increment
        record.count++;
        await env.SESSION.put(key, JSON.stringify(record), {
          expirationTtl: Math.ceil(WINDOW_MS / 1000)
        });
        return {
          allowed: true,
          remaining: MAX_REQUESTS_PER_WINDOW - record.count,
          resetIn: Math.ceil((record.resetTime - now) / 1000),
        };
      }

      // No record or expired - create new
      const newRecord = { count: 1, resetTime: now + WINDOW_MS };
      await env.SESSION.put(key, JSON.stringify(newRecord), {
        expirationTtl: Math.ceil(WINDOW_MS / 1000)
      });
      return {
        allowed: true,
        remaining: MAX_REQUESTS_PER_WINDOW - 1,
        resetIn: Math.ceil(WINDOW_MS / 1000),
      };
    }
  } catch (error) {
    console.warn('[RateLimit] KV unavailable, falling back to in-memory:', error);
  }

  // Fallback to in-memory store
  return checkRateLimitInMemory(identifier, now);
}

/**
 * Synchronous in-memory rate limit check (fallback)
 */
export function checkRateLimit(identifier: string): RateLimitResult {
  return checkRateLimitInMemory(identifier, Date.now());
}

function checkRateLimitInMemory(identifier: string, now: number): RateLimitResult {
  const record = rateLimitStore.get(identifier);

  // Window expired or doesn't exist - reset
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetIn: Math.ceil(WINDOW_MS / 1000),
    };
  }

  // Check limit BEFORE incrementing
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Under limit - increment
  record.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetIn.toString(),
  };
}

// Cleanup old entries periodically (call this in your worker)
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}