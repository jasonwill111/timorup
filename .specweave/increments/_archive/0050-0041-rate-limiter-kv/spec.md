---
increment: 0050-0041-rate-limiter-kv
title: Rate Limiter KV Storage
type: feature
priority: P1
status: completed
created: 2026-05-13T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Rate Limiter KV Storage

## Overview

Move rate limiter from in-memory Map to Cloudflare KV for distributed rate limiting across Workers instances.

## User Stories

### US-001: Distributed Rate Limiting (P1)
**Project**: timorlist

**As a** server
**I want** rate limits stored in KV
**So that** limits persist across Worker cold starts and scale across instances

**Acceptance Criteria**:
- [x] **AC-US1-01**: Rate limit data stored in SESSION KV namespace
- [x] **AC-US1-02**: KV operations use TTL for automatic expiration
- [x] **AC-US1-03**: Rate limit survives Worker restart
- [x] **AC-US1-04**: Multiple instances share same rate limit state

### US-002: Backward Compatible API (P1)
**Project**: timorlist

**As a** developer
**I want** `checkRateLimit()` API unchanged
**So that** no changes needed in calling code

**Acceptance Criteria**:
- [x] **AC-US2-01**: `checkRateLimit(identifier)` signature unchanged
- [x] **AC-US2-02**: Returns same `{ allowed, remaining, resetIn }` shape
- [x] **AC-US2-03**: Falls back to in-memory if KV unavailable

## Functional Requirements

### FR-001: KV Storage
- Use existing SESSION KV binding (configured in wrangler.jsonc)
- Key format: `ratelimit:{identifier}`
- Value: JSON `{ count: number, resetTime: number }`
- TTL: matches window duration

### FR-002: Atomic Operations
- Use KV get + put with conditional check
- Handle race conditions (concurrent requests)
- Consider using `list()` with prefix for cleanup

## Out of Scope

- Rate limit dashboard/UI
- Per-user vs per-IP configuration
- Sliding window rate limiting
- Different rate limits for different endpoints

## Dependencies

- SESSION KV namespace (existing in wrangler.jsonc)
- Rate limiter tests (existing)

## Implementation Notes

```typescript
// KV key format
const key = `ratelimit:${identifier}`;

// Store with TTL
await env.SESSION.put(key, JSON.stringify(data), {
  expirationTtl: Math.ceil(WINDOW_MS / 1000)
});
```
