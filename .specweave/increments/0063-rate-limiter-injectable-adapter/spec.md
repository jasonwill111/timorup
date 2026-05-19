---
increment: 0063-rate-limiter-injectable-adapter
title: "Rate Limiter Injectable Adapter"
type: refactor
priority: P1
status: active
created: 2026-05-18
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Rate Limiter Injectable Adapter

## Overview

Replace stateful singleton rate limiter with injectable adapter pattern. Eliminates race conditions in concurrent requests and enables testability.

## User Stories

### US-001: Testable Rate Limiter
**Project**: TimorLink

**As a** developer
**I want** to inject rate limiter implementations
**So that** I can test without Cloudflare Workers dependency

**Acceptance Criteria**:
- [x] **AC-US1-01**: `RateLimiterAdapter` interface defines `check(identifier): Promise<RateLimitResult>`
- [x] **AC-US1-02**: `KVRateLimiterAdapter` implements KV-backed rate limiting
- [x] **AC-US1-03**: `InMemoryRateLimiterAdapter` available for unit tests
- [x] **AC-US1-04**: Factory function `createRateLimiter(env)` returns correct adapter

---

### US-002: Race Condition Fix
**Project**: TimorLink

**As a** developer
**I want** atomic rate limit checks
**So that** concurrent requests don't bypass limits

**Acceptance Criteria**:
- [x] **AC-US2-01**: KV adapter uses atomic operations (get + put is not atomic)
- [x] **AC-US2-02**: In-memory adapter uses proper locking for concurrent access
- [x] **AC-US2-03**: Configurable window and limit via constructor options

## Functional Requirements

### FR-001: RateLimiterAdapter Interface
```typescript
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
```

### FR-002: Implementations
- `KVRateLimiterAdapter`: Uses KV with atomic compare-and-swap
- `InMemoryRateLimiterAdapter`: Uses Map with mutex for testing

### FR-003: Factory Function
```typescript
export function createRateLimiter(
  env: CloudflareEnv
): RateLimiterAdapter | InMemoryRateLimiterAdapter
```

## Success Criteria

1. Unit tests can run without `cloudflare:workers` import
2. All existing rate limit functionality preserved
3. No race conditions under concurrent load
4. 100% backward compatible API

## Out of Scope

- Changing rate limit thresholds (config only)
- Distributed rate limiting across data centers
- Integration with third-party rate limiters
