globalThis.process ??= {};
globalThis.process.env ??= {};
const rateLimitStore = /* @__PURE__ */ new Map();
const WINDOW_MS = 60 * 1e3;
const MAX_REQUESTS_PER_WINDOW = 100;
function checkRateLimit(identifier) {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetIn: Math.ceil(WINDOW_MS / 1e3)
    };
  }
  if (record.count < MAX_REQUESTS_PER_WINDOW) {
    record.count++;
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - record.count,
      resetIn: Math.ceil((record.resetTime - now) / 1e3)
    };
  }
  return {
    allowed: false,
    remaining: 0,
    resetIn: Math.ceil((record.resetTime - now) / 1e3)
  };
}
function getRateLimitHeaders(result) {
  return {
    "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetIn.toString()
  };
}
export {
  checkRateLimit as c,
  getRateLimitHeaders as g
};
