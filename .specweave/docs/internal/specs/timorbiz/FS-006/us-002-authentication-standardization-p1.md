---
id: US-002
feature: FS-006
title: "Authentication Standardization (P1)"
status: completed
priority: P1
created: 2026-04-18T00:00:00.000Z
tldr: "**As a** developer."
project: timorbiz
---

# US-002: Authentication Standardization (P1)

**Feature**: [FS-006](./FEATURE.md)

**As a** developer
**I want** unified authentication patterns
**So that** auth is consistent between Astro API routes and Hono routes

---

## Acceptance Criteria

- [x] **AC-US2-01**: Astro API routes use `auth.api.getSession()` consistently
- [x] **AC-US2-02**: Hono routes use `getCurrentUser()` helper consistently
- [x] **AC-US2-03**: better-auth session token property verified (`session.token` vs `session.id`)
- [x] **AC-US2-04**: Remove stub auth in `pages/api/auth/sign-in.ts` (password verification missing)
- [x] **AC-US2-05**: All protected endpoints return 401 for unauthenticated users

---

## Implementation

**Increment**: [0006-api-review](../../../../../increments/0006-api-review/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
