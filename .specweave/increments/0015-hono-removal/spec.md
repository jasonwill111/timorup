---
increment: 0015-hono-removal
title: "Remove Hono - Pure Astro API"
type: refactor
priority: P1
status: completed
completed: 2026-04-30
created: 2026-04-23
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Remove Hono - Pure Astro API Architecture

## Overview

Remove all Hono server code and migrate all API routes to Astro API endpoints. This simplifies the architecture by using only Astro 6's built-in API capabilities.

## User Stories

### US-001: Remove Hono Server
**Project**: timorlist

**As a** developer **I want** to remove Hono server code **So that** the codebase uses only Astro API routes

**Acceptance Criteria**:
- [x] **AC-US1-01**: Delete `src/server/` directory completely
- [x] **AC-US1-02**: Remove Hono imports from `astro.config.mjs`
- [x] **AC-US1-03**: No `src/server/` references in any file

---

### US-002: Migrate Auth API Routes
**Project**: timorlist

**As a** developer **I want** auth endpoints in Astro API **So that** authentication works via Astro

**Acceptance Criteria**:
- [x] **AC-US2-01**: `/api/auth/*` routes work via Astro API
- [x] **AC-US2-02**: Session management via better-auth
- [x] **AC-US2-03**: All auth flows (login, register, logout) functional

---

### US-003: Migrate Business API Routes
**Project**: timorlist

**As a** developer **I want** business endpoints in Astro API **So that** CRUD operations work

**Acceptance Criteria**:
- [x] **AC-US3-01**: GET/POST/PUT/DELETE `/api/businesses` work
- [x] **AC-US3-02**: Business search and filtering functional
- [x] **AC-US3-03**: Business categories and products work

---

### US-004: Migrate Admin API Routes
**Project**: timorlist

**As a** admin **I want** admin endpoints in Astro API **So that** dashboard works

**Acceptance Criteria**:
- [x] **AC-US4-01**: Admin stats endpoint functional
- [x] **AC-US4-02**: Admin CRUD for businesses, users, categories work
- [x] **AC-US4-03**: Admin settings endpoint functional

---

### US-005: Migrate Remaining API Routes
**Project**: timorlist

**As a** developer **I want** all remaining endpoints in Astro API **So that** full functionality works

**Acceptance Criteria**:
- [x] **AC-US5-01**: Products API (`/api/products`) functional
- [x] **AC-US5-02**: Reviews API (`/api/reviews`) functional
- [x] **AC-US5-03**: Media upload endpoint functional
- [x] **AC-US5-04**: Orders API functional
- [x] **AC-US5-05**: Sitemap endpoint functional

---

## Technical Approach

### Migration Strategy

1. **Identify all Hono routes** in `src/server/routes/`
2. **Create equivalent Astro API routes** in `src/pages/api/`
3. **Test each endpoint** before deleting Hono route
4. **Delete `src/server/` directory** when all migrated

### API Route Mapping

| Hono Route | Astro API Route |
|------------|----------------|
| `/api/auth/*` | `/api/auth/*` |
| `/api/businesses/*` | `/api/businesses/*` |
| `/api/admin/*` | `/api/admin/*` |
| `/api/products/*` | `/api/products/*` |
| `/api/reviews/*` | `/api/reviews/*` |
| `/api/media/*` | `/api/media/*` |
| `/api/categories/*` | `/api/categories/*` |
| `/api/orders/*` | `/api/orders/*` |
| `/api/blogs/*` | `/api/blogs/*` |
| `/api/banners/*` | `/api/banners/*` |
| `/cron/*` | `/api/cron/*` |

## Out of Scope

- Changing database schema
- Modifying business logic
- UI component changes

## Edge Cases

| Case | Handling |
|------|----------|
| **Session expired mid-request** | Return 401, client redirects to login |
| **Duplicate slug** | Return 400 with `SLUG_EXISTS` error code |
| **Database unavailable** | Return 500 with generic error (no details leaked) |
| **Invalid JSON body** | Return 400 with parse error details |
| **Missing required fields** | Return 400 listing missing fields |
| **Malicious input (XSS)** | HTML-escape all user content before storage |
| **Rate limiting** | Not implemented (future enhancement) |

## Acceptance Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| AT-01 | Authenticated request | `GET /api/auth/session` | Returns session data with user info |
| AT-02 | Authenticated request | `POST /api/auth/sign-in` | Returns 201 with session cookie |
| AT-03 | Authenticated request | `POST /api/businesses` with valid data | Returns 201 with business data |
| AT-04 | Authenticated request | `GET /api/businesses` | Returns paginated business list |
| AT-05 | Admin request | `GET /api/admin/stats` | Returns dashboard statistics |
| AT-06 | Unauthenticated request | Any auth-required endpoint | Returns 401 `UNAUTHORIZED` |
| AT-07 | Invalid slug | `POST /api/businesses` with existing slug | Returns 400 `SLUG_EXISTS` |
| AT-08 | Second business attempt | `POST /api/businesses` when user already has one | Returns 400 `LIMIT_REACHED` |

## Dependencies

- Astro 6 API routes (already available)
- better-auth (already configured)
- Drizzle ORM (already configured)
