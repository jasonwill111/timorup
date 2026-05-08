# Technical Plan: 一人一店限制 (BS-013)

## Overview

Add a proactive frontend guard and fix a missing API-layer check so that the one-business-per-user rule is enforced at every entry point. The Hono route already has the backend check. The work is in the Astro API route (add auth + limit check), a new `GET /my-business` endpoint, and the frontend create page UX.

## Architecture

### Components

- **Astro API route** (`src/pages/api/businesses/create.ts`): Add session auth + `LIMIT_REACHED` check.
- **Hono API route** (`src/server/routes/businesses.ts`): Add `GET /my-business` endpoint.
- **Frontend page** (`src/pages/business/create.astro`): Add pre-check + friendly error UX.
- **Shared utility** (`src/lib/business-logic.ts`): Extract reusable check for `hasUserBusiness(userId)`.
- **Unit tests** (`src/lib/business-logic.test.ts`): Add TDD tests for all 4 AT scenarios.

### Data Model

No schema changes. The `business_owner_idx` index already exists on `business_pages.owner_id`.

### API Contracts

#### New endpoint: `GET /api/businesses/my-business` (Hono)

Request: `GET /api/businesses/my-business`
Auth: Cookie session (better-auth)

Response 200:
```json
{
  "success": true,
  "data": { "id": "biz-1", "title": "My Cafe", "slug": "my-cafe", "status": "live" }
}
```

Response 404:
```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "No business found" }
}
```

Response 401:
```json
{
  "success": false,
  "error": { "code": "UNAUTHORIZED", "message": "Not authenticated" }
}
```

#### Existing endpoint: `POST /api/businesses` (Hono)

No changes needed (already correct).

#### Updated endpoint: `POST /api/businesses/create` (Astro)

Must add:
1. Session authentication via `better-auth`
2. `LIMIT_REACHED` check before insert (same logic as Hono route)
3. Consistent error response shape

---

## Technology Stack

- **Framework**: Astro 6 SSR + Hono 4.x
- **ORM**: Drizzle ORM + SQLite (D1)
- **Auth**: better-auth (cookie-based session)
- **Testing**: Vitest (unit), Playwright (e2e)

---

## Architecture Decisions

### AD-001: Extract `hasUserBusiness` into shared utility
**Decision**: Create `src/lib/business-logic.ts` with a reusable `hasUserBusiness(db, userId)` function.
**Why**: Both the Astro API route and the Hono route need the same check. DRY principle.
**Alternatives considered**: Inline the query in each route (violates DRY, harder to test).

### AD-002: Dedicated `GET /my-business` endpoint vs checking on page load
**Decision**: Add a dedicated Hono endpoint rather than reusing the existing `GET /businesses/:id`.
**Why**: The existing endpoint requires knowing the business ID. `GET /my-business` uses the session to look up by `ownerId` directly, which is simpler and more secure (no ID enumeration).
**Alternatives considered**: Reuse `GET /businesses/:id` — requires the frontend to first know the business ID, adding complexity.

### AD-003: Frontend guard in `create.astro` vs redirecting from middleware
**Decision**: Add pre-check in the Astro page itself, replacing the form with a message.
**Why**: Simpler than adding Astro middleware for this single-page case. Allows a user-friendly message without a full redirect.
**Alternatives considered**: Astro middleware — overkill for one page.

---

## Implementation Phases

### Phase 1: Shared utility + `GET /my-business` endpoint
1. Create `src/lib/business-logic.ts` with `hasUserBusiness(db, userId)` function.
2. Add `GET /my-business` route to `src/server/routes/businesses.ts`.
3. Write unit tests for `hasUserBusiness`.

### Phase 2: Fix Astro API route
1. Add better-auth session check to `src/pages/api/businesses/create.ts`.
2. Add `LIMIT_REACHED` check using `hasUserBusiness`.
3. Remove `ownerId` from request body (must come from session, not client).
4. Write unit tests.

### Phase 3: Frontend guard
1. Add `GET /api/businesses/my-business` call in `create.astro` after session fetch.
2. If business exists, replace form with "already have business" message.
3. Add `LIMIT_REACHED` error handling in the form submit handler.

### Phase 4: E2E test coverage
1. Update e2e test `BS-013: should show error when user already has business` in `e2e/business-complete.spec.ts` to match the new UX.
2. Add new e2e scenario for the "already have business" form guard.

---

## Testing Strategy

### Unit Tests (Vitest)
- `hasUserBusiness()`: returns true when user has business, false otherwise.
- `POST /api/businesses/create`: 400 `LIMIT_REACHED` when user has business.
- `POST /api/businesses/create`: 201 when user has no business.
- `POST /api/businesses/create`: 401 when unauthenticated.
- `GET /api/businesses/my-business`: 200 with data, 404 without.

### E2E Tests (Playwright)
- AT-06: User with business sees "already have business" message.
- AT-07: User without business sees normal form.
- Existing BS-013 e2e test already in `e2e/business-complete.spec.ts`.

---

## Technical Challenges

### Challenge 1: Astro API route auth vs Hono route auth
**Description**: The Astro API route uses a different auth pattern (direct better-auth call) vs the Hono route (via `getCurrentUser` helper).
**Solution**: The Astro route should use the same `better-auth.api.getSession()` pattern, reading the session token from the cookie.
**Risk**: Low — the pattern is already established in `getCurrentUser()`.

### Challenge 2: Removing `ownerId` from request body
**Description**: The current Astro route trusts `ownerId` from the request body, which is a security issue.
**Solution**: Ignore `ownerId` from body; always derive from the authenticated session.
**Risk**: Low — the Hono route already does this correctly.
