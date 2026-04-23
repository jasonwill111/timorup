---
increment: 0001-one-business-per-user
title: "一人一店限制 (BS-013)"
type: feature
priority: P1
status: planned
created: 2026-03-22
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: 一人一店限制 (BS-013)

## Overview

Enforce that each authenticated user can create at most one business page. The backend already has a partial check in the Hono route (`src/server/routes/businesses.ts`), but the Astro API route (`src/pages/api/businesses/create.ts`) lacks it entirely, and the frontend (`src/pages/business/create.astro`) does not pre-validate or provide a friendly UX for users who already have a business.

**Feature ID**: BS-013
**Project**: timorlist
**Tech stack**: Astro 6 (SSR) + Hono 4.x API + Drizzle ORM + better-auth

---

## User Stories

### US-001: Prevent duplicate business creation via API
**Project**: timorlist

**As a** authenticated user **I want** the system to reject my second business creation attempt **So that** the one-business-per-user rule is enforced at the API layer

**Acceptance Criteria**:
- [ ] **AC-US1-01**: The Hono API route `POST /api/businesses` already returns `{ code: 'LIMIT_REACHED', message: 'You can only create one business page' }` with HTTP 400 when a logged-in user tries to create a second business (existing behavior, confirmed at `src/server/routes/businesses.ts` lines 268-279).
- [ ] **AC-US1-02**: The Astro API route `POST /api/businesses/create` adds the same `LIMIT_REACHED` check before inserting, mirroring the Hono route logic.
- [ ] **AC-US1-03**: Both API routes use the indexed `ownerId` column (`business_owner_idx`) for the existence check, ensuring O(1) lookup without N+1.
- [ ] **AC-US1-04**: The Astro API route authenticates the request via better-auth session before checking ownership.

---

### US-002: Proactive frontend guard on create page
**Project**: timorlist

**As a** user who already owns a business **I want** the create page to tell me immediately that I cannot create another **So that** I am not misled into filling out a form only to be rejected at submit

**Acceptance Criteria**:
- [ ] **AC-US2-01**: When a logged-in user visits `/business/create`, the page fetches `/api/businesses/my-business` (or a dedicated status endpoint) to check if they already own a business.
- [ ] **AC-US2-02**: If the user already has a business, the page replaces the form with a clear message: "You already have a business page: [BusinessName]. Visit your dashboard or edit your existing business."
- [ ] **AC-US2-03**: The guard runs after session validation (i.e., unauthenticated users are still redirected to login, not shown the "already has business" message).
- [ ] **AC-US2-04**: The frontend form submission handler shows the server's `LIMIT_REACHED` error as a user-friendly alert if the server-side check is hit.

---

### US-003: Expose a user-business status API endpoint
**Project**: timorlist

**As a** frontend **I want** a dedicated endpoint to check if the current user owns a business **So that** the create page can guard itself efficiently

**Acceptance Criteria**:
- [ ] **AC-US3-01**: `GET /api/businesses/my-business` (Hono route) returns the user's business if one exists, or 404 if none.
- [ ] **AC-US3-02**: The endpoint uses the authenticated session to identify the user (no explicit userId required in request).
- [ ] **AC-US3-03**: The response includes `{ id, title, slug, status }` of the user's business (minimal payload, no unnecessary fields).

---

### US-004: Unit tests for one-business-per-user logic
**Project**: timorlist

**Acceptance Criteria**:
- [ ] **AC-US4-01**: Unit test: `POST /api/businesses` returns 400 `LIMIT_REACHED` when user already owns a business.
- [ ] **AC-US4-02**: Unit test: `POST /api/businesses` succeeds (201) when user has no existing business.
- [ ] **AC-US4-03**: Unit test: `GET /api/businesses/my-business` returns 404 for a user with no business.
- [ ] **AC-US4-04**: Unit test: `GET /api/businesses/my-business` returns 200 with business data for a user who owns one.

---

## Functional Requirements

### FR-001: API-layer ownership enforcement
Both the Hono route and the Astro API route must check `businessPages.ownerId = :userId` before allowing insertion. The Hono route already implements this. The Astro route must be updated to match.

### FR-002: Database index exists
The `business_owner_idx` index on `business_pages.owner_id` already exists in the schema (`src/db/schema/index.ts` line 90). No migration needed.

### FR-003: Frontend pre-validation
The create page must check business ownership before rendering the form. Uses a dedicated `GET /api/businesses/my-business` endpoint.

### FR-004: Error message consistency
Both API routes return the same error shape:
```json
{
  "success": false,
  "error": { "code": "LIMIT_REACHED", "message": "You can only create one business page" }
}
```

### FR-005: Unauthenticated requests
Both API routes return 401 `UNAUTHORIZED` when no valid session exists. The frontend redirects to `/login`.

---

## Non-Functional Requirements

### NFR-001: Performance
The ownership check uses an indexed `ownerId` column (B-tree index). Query is O(log n) on table size, constant for the typical case (0 or 1 business per user).

### NFR-002: Security
- No business data is exposed to unauthenticated users via the `my-business` endpoint.
- The Astro API route must verify the session server-side (not trust `ownerId` from the request body, which the current implementation incorrectly does).

---

## Out of Scope

- Multi-tenant or sub-business features (this is a 1:1 user-to-business constraint only).
- Admin override to allow a user multiple businesses.
- Deleting a business and immediately recreating a new one (race condition on fast consecutive requests — acceptable for MVP).
- Migration of existing data where a user accidentally has multiple businesses.

---

## Dependencies

- better-auth session management (`src/lib/auth.ts`)
- `business_owner_idx` database index (already exists)
- Hono route `/api/businesses` (already implemented)

---

## Acceptance Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| AT-01 | Authenticated user with no business | POST `/api/businesses` with valid data | HTTP 201, business created |
| AT-02 | Authenticated user who already has a business | POST `/api/businesses` | HTTP 400, `{ code: 'LIMIT_REACHED' }` |
| AT-03 | Unauthenticated user | POST `/api/businesses` | HTTP 401, `{ code: 'UNAUTHORIZED' }` |
| AT-04 | User with no business | GET `/api/businesses/my-business` | HTTP 404 |
| AT-05 | User with one business | GET `/api/businesses/my-business` | HTTP 200, `{ id, title, slug, status }` |
| AT-06 | User with business visits create page | GET `/business/create` | Form replaced with "already have business" message |
| AT-07 | User without business visits create page | GET `/business/create` | Normal form is displayed |

---

## Technical Notes

### API route analysis

**Hono route** (`src/server/routes/businesses.ts`):
- Already has the limit check (lines 268-279)
- Already uses `getCurrentUser(c)` via session cookie
- Returns correct error shape with `LIMIT_REACHED`
- Status: No changes needed

**Astro API route** (`src/pages/api/businesses/create.ts`):
- Missing authentication (does not check session)
- Missing `ownerId` uniqueness check
- Status: Must add both

### Form submission target

The create page (`src/pages/business/create.astro`) POSTs to `/api/businesses` (Hono), not to `/api/businesses/create` (Astro). The Astro route appears to be unused or is a duplicate entry point. Both should be consistent.

### Database schema reference

```
business_pages table (src/db/schema/index.ts):
  ownerId: text('owner_id').notNull()      -- indexed: business_owner_idx
  ownerIdx: index on business_pages.owner_id  -- line 90
```
