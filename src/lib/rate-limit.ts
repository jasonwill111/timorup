// Rate limiter for Cloudflare Workers (in-memory, per-instance)
// For production at scale, use Cloudflare KV or Redis
//
// KV Support Limitation:
// Currently uses in-memory Map which resets on each Worker instance cold start.
// For production at scale, implement KV-based storage:
//   - Use env.SESSION (KV namespace) for distributed rate limiting
//   - Store rate limit data with TTL in KV
//   - Example: await env.SESSION.put(`ratelimit:${identifier}`, JSON.stringify(data), { expirationTtl: 60 })

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests/min per IP (generous for real users)

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
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

  // Under limit
  if (record.count < MAX_REQUESTS_PER_WINDOW) {
    record.count++;
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - record.count,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Over limit
  return {
    allowed: false,
    remaining: 0,
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
