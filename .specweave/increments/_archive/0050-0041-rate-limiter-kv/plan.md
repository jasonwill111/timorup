---
increment: 0050-0041-rate-limiter-kv
---

# Architecture Plan: Rate Limiter KV Storage

## Design

### Current State
- In-memory `Map` in `src/lib/rate-limit.ts`
- Resets on Worker cold start
- Per-instance only (no distributed state)

### Target State
- KV-backed storage using SESSION namespace
- Persists across cold starts
- Shared across all Worker instances
- Same `checkRateLimit()` API

### Data Flow
```
Request IP: 192.168.1.1
        │
        ├─ KV.get("ratelimit:192.168.1.1")
        │   │
        │   ├─ Key exists + not expired → increment count
        │   │
        │   └─ Key missing/expired → create with count=1
        │
        ├─ KV.put(key, JSON, { expirationTtl: 60 })
        │
        └─ Return { allowed, remaining, resetIn }
```

## Components

### RateLimiterKV Class
```typescript
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Methods
async get(identifier: string): Promise<RateLimitRecord | null>
async set(identifier: string, record: RateLimitRecord, ttl: number): Promise<void>
```

### Fallback Strategy
- If KV unavailable → fall back to in-memory Map
- Log warning when fallback activated
- Ensures rate limiting still works (even if per-instance)

## Key Format
```
ratelimit:{identifier}
Example: ratelimit:192.168.1.1
```

## TTL Strategy
- Window: 60 seconds (1 minute)
- TTL: 60 seconds
- KV auto-expires keys after window closes

## Rationale

### Why KV over D1?
- KV is faster (<1ms read vs ~10ms D1)
- Built for this exact use case (simple key-value with TTL)
- SESSION KV already configured

### Why keep same API?
- Zero calling code changes
- Internal implementation detail
- Easier to test (mock interface same)

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/rate-limit.ts` | Replace Map with KV operations |

## Risks

| Risk | Mitigation |
|------|------------|
| KV cold read latency | Acceptable (~1ms), already faster than D1 |
| Race conditions | Use atomic operations where possible |
| KV unavailable in local dev | Graceful fallback to in-memory |