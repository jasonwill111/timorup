# Tasks: Rate Limiter KV Storage

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Core Implementation

### T-001: Write failing unit tests
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04

**Description**: Write tests that verify KV-backed rate limiting behavior

**Test Plan**:
- **File**: `tests/unit/rate-limit.test.ts`
- **Tests**:
  - **TC-001**: Rate limit data persisted in KV
    - Given KV mock
    - When `checkRateLimit("test-ip")` called twice within window
    - Then KV.put called with updated count
  - **TC-002**: TTL set correctly
    - Given rate limit check
    - When KV.put called
    - Then expirationTtl matches window duration
  - **TC-003**: Survives cold start (mocked)
    - Given new rate limiter instance
    - When previous IP checked
    - Then count continues from KV, not reset to 1
  - **TC-004**: Same API return shape
    - Given valid request
    - When `checkRateLimit()` called
    - Then returns `{ allowed: boolean, remaining: number, resetIn: number }`

**Status**: [x] completed

### T-002: Implement KV-based rate limiter
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02, AC-US2-03

**Description**: Rewrite rate limiter to use KV storage

**Implementation**:
1. Import KV from `cloudflare:workers`
2. Replace `rateLimitStore Map` with KV operations
3. Key: `ratelimit:${identifier}`
4. Value: JSON `{ count, resetTime }`
5. Use `expirationTtl` for auto-expiry
6. Add fallback to in-memory if KV unavailable

**Code Pattern**:
```typescript
const key = `ratelimit:${identifier}`;
const stored = await env.SESSION.get(key);
const record = stored ? JSON.parse(stored) : null;

// Check if valid and not expired
if (record && now < record.resetTime) {
  record.count++;
} else {
  record = { count: 1, resetTime: now + WINDOW_MS };
}

// Write back with TTL
await env.SESSION.put(key, JSON.stringify(record), {
  expirationTtl: Math.ceil(WINDOW_MS / 1000)
});
```

**Dependencies**: T-001

**Status**: [x] completed

## Phase 2: Testing & Verification

### T-003: Run unit tests
**Satisfies ACs**: All

**Description**: Execute rate limiter unit tests

**Implementation**:
1. Run `pnpm vitest run rate-limit.test.ts`
2. Fix any failures
3. Verify 80%+ coverage

**Dependencies**: T-002

**Status**: [x] completed

### T-004: Verify KV persistence
**Satisfies ACs**: AC-US1-03, AC-US1-04

**Description**: Manual verification of KV persistence

**Implementation**:
1. Start local dev server
2. Make requests to trigger rate limiting
3. Check KV via `wrangler kv:key list --namespace-id <id>`
4. Restart dev server (simulate cold start)
5. Verify rate limit continues from where it left

**Dependencies**: T-003

**Status**: [x] completed

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Core | T-001, T-002 | 2 tasks |
| 2. Testing | T-003, T-004 | 2 tasks |
| **Total** | **4 tasks** | |