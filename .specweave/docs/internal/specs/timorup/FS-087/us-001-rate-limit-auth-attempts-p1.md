---
id: US-001
feature: FS-087
title: "Rate Limit Auth Attempts (P1)"
status: completed
priority: P1
created: 2026-05-29
tldr: "**As a** system administrator."
project: timorup
---

# US-001: Rate Limit Auth Attempts (P1)

**Feature**: [FS-087](./FEATURE.md)

**As a** system administrator
**I want** rate limiting on sign-in and sign-up endpoints
**So that** brute-force attacks are prevented

---

## Acceptance Criteria

- [x] **AC-US1-01**: Sign-in endpoint returns 429 when rate limit exceeded
- [x] **AC-US1-02**: Sign-up endpoint returns 429 when rate limit exceeded
- [x] **AC-US1-03**: Rate limit headers (X-RateLimit-*) included in responses
- [x] **AC-US1-04**: Error response uses standardized ErrorCode.AUTH_RATE_LIMITED

---

## Implementation

**Increment**: [0087-auth-security-hardening](../../../../../increments/0087-auth-security-hardening/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
