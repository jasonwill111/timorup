---
id: US-002
feature: FS-049
title: "Centralized Auth Middleware (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** server."
project: TimorLink
---

# US-002: Centralized Auth Middleware (P1)

**Feature**: [FS-049](./FEATURE.md)

**As a** server
**I want** auth validation in one place
**So that** 52 admin pages don't duplicate auth logic

---

## Acceptance Criteria

- [x] **AC-US2-01**: `src/middleware/index.ts` validates admin session
- [x] **AC-US2-02**: Middleware injects user into `Astro.locals`
- [x] **AC-US2-03**: Unauthenticated requests to `/admin/*` redirect to `/admin/login`
- [x] **AC-US2-04**: Auth check runs BEFORE page renders

---

## Implementation

**Increment**: [0049-0040-admin-auth-cookie-middleware](../../../../../increments/0049-0040-admin-auth-cookie-middleware/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

