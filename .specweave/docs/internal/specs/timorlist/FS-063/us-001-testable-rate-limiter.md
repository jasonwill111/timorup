---
id: US-001
feature: FS-063
title: "Testable Rate Limiter"
status: completed
priority: P1
created: 2026-05-18
tldr: "**As a** developer."
project: timorlist
---

# US-001: Testable Rate Limiter

**Feature**: [FS-063](./FEATURE.md)

**As a** developer
**I want** to inject rate limiter implementations
**So that** I can test without Cloudflare Workers dependency

---

## Acceptance Criteria

- [x] **AC-US1-01**: `RateLimiterAdapter` interface defines `check(identifier): Promise<RateLimitResult>`
- [x] **AC-US1-02**: `KVRateLimiterAdapter` implements KV-backed rate limiting
- [x] **AC-US1-03**: `InMemoryRateLimiterAdapter` available for unit tests
- [x] **AC-US1-04**: Factory function `createRateLimiter(env)` returns correct adapter

---

## Implementation

**Increment**: [0063-rate-limiter-injectable-adapter](../../../../../increments/0063-rate-limiter-injectable-adapter/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
