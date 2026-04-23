---
id: US-001
feature: FS-001
title: "Prevent duplicate business creation via API"
status: not_started
priority: P1
created: 2026-03-22
tldr: "**As a** authenticated user **I want** the system to reject my second business creation attempt **So that** the one-business-per-user rule is enforced at the API layer."
project: timorlist
---

# US-001: Prevent duplicate business creation via API

**Feature**: [FS-001](./FEATURE.md)

**As a** authenticated user **I want** the system to reject my second business creation attempt **So that** the one-business-per-user rule is enforced at the API layer

---

## Acceptance Criteria

- [ ] **AC-US1-01**: The Hono API route `POST /api/businesses` already returns `{ code: 'LIMIT_REACHED', message: 'You can only create one business page' }` with HTTP 400 when a logged-in user tries to create a second business (existing behavior, confirmed at `src/server/routes/businesses.ts` lines 268-279).
- [ ] **AC-US1-02**: The Astro API route `POST /api/businesses/create` adds the same `LIMIT_REACHED` check before inserting, mirroring the Hono route logic.
- [ ] **AC-US1-03**: Both API routes use the indexed `ownerId` column (`business_owner_idx`) for the existence check, ensuring O(1) lookup without N+1.
- [ ] **AC-US1-04**: The Astro API route authenticates the request via better-auth session before checking ownership.

---

## Implementation

**Increment**: [0001-one-business-per-user](../../../../../increments/0001-one-business-per-user/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
