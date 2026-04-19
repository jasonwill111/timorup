---
increment: 0006-api-review
title: API Endpoint Review & Best Practice Optimization
type: feature
priority: P1
status: completed
created: 2026-04-18T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: API Endpoint Review & Best Practice Optimization

## Overview

Review all frontend/backend API endpoints across `src/pages/api/` and `src/server/routes/`, apply latest version best practices (Astro 6, Hono 4.12, better-auth 1.5.3, Drizzle 0.45, Zod 4.3, TipTap 3.20), optimize patterns, and fix issues found.

---

## User Stories

### US-001: API Consistency Audit (P1)
**Project**: timorbiz

**As a** developer
**I want** consistent API patterns across all endpoints
**So that** the codebase is maintainable and predictable

**Acceptance Criteria**:
- [x] **AC-US1-01**: All endpoints use unified error response format `{ error: { code: "ERROR_CODE", message: "..." } }`
- [x] **AC-US1-02**: All endpoints use consistent success response format `{ success: true, data: ... }` with optional `meta` for pagination
- [x] **AC-US1-03**: Zod v4 error format used (`{ error: "..." }` instead of `{ message: "..." }`)
- [x] **AC-US1-04**: All endpoints set correct `Content-Type: application/json` headers
- [x] **AC-US1-05**: HTTP status codes follow REST conventions (200/201/400/401/403/404/500)

### US-002: Authentication Standardization (P1)
**Project**: timorbiz

**As a** developer
**I want** unified authentication patterns
**So that** auth is consistent between Astro API routes and Hono routes

**Acceptance Criteria**:
- [x] **AC-US2-01**: Astro API routes use `auth.api.getSession()` consistently
- [x] **AC-US2-02**: Hono routes use `getCurrentUser()` helper consistently
- [x] **AC-US2-03**: better-auth session token property verified (`session.token` vs `session.id`)
- [x] **AC-US2-04**: Remove stub auth in `pages/api/auth/sign-in.ts` (password verification missing)
- [x] **AC-US2-05**: All protected endpoints return 401 for unauthenticated users

### US-003: Input Validation (P1)
**Project**: timorbiz

**As a** developer
**I want** Zod validation on all API endpoints
**So that** invalid data is rejected early with clear error messages

**Acceptance Criteria**:
- [x] **AC-US3-01**: All POST/PUT/PATCH endpoints validate request body with Zod schemas
- [x] **AC-US3-02**: Validation errors return 400 status with field-level details
- [x] **AC-US3-03**: All required fields checked before database operations
- [x] **AC-US3-04**: Slug uniqueness validated with proper error codes

### US-004: API Endpoint Deduplication (P1)
**Project**: timorbiz

**As a** developer
**I want** clear separation between Astro API routes and Hono routes
**So that** there's no confusion about which endpoint to use

**Acceptance Criteria**:
- [x] **AC-US4-01**: Document which endpoints live in Astro vs Hono
- [x] **AC-US4-02**: Remove duplicate business endpoints if any
- [x] **AC-US4-03**: Remove duplicate product endpoints if any
- [x] **AC-US4-04**: Cache headers applied consistently to list endpoints

### US-005: Performance Optimization (P2)
**Project**: timorbiz

**As a** developer
**I want** optimized database queries
**So that** API responses are fast

**Acceptance Criteria**:
- [x] **AC-US5-01**: N+1 query issues identified and fixed
- [x] **AC-US5-02**: Proper indexes documented for frequently queried columns
- [x] **AC-US5-03**: Pagination applied to all list endpoints
- [x] **AC-US5-04**: Query optimization for business listing (category join)

---

## Implementation Summary

### Files to Review

**Astro API Routes** (`src/pages/api/`):
- `auth/sign-in.ts` - AUTH STUB - needs fix
- `auth/sign-up.ts`, `auth/sign-out.ts`, `auth/session.ts`
- `auth/forgot-password.ts`, `auth/reset-password.ts`, `auth/verify-email.ts`
- `businesses/index.ts`, `businesses/[slug].ts`, `businesses/create.ts`, `businesses/featured.ts`
- `businesses/[slug]/like.ts`
- `categories/index.ts`
- `products/index.ts`, `products/[id].ts`
- `reviews/index.ts`
- `admin/*` - stats, users, orders, categories, businesses, auth/login, settings

**Hono Routes** (`src/server/routes/`):
- `auth.ts` - Complete auth with rate limiting
- `businesses.ts` - CRUD + subscription status
- `products.ts`, `reviews.ts`, `orders.ts`, `banners.ts`
- `categories.ts`, `account.ts`, `media.ts`, `blogs.ts`
- `admin.ts`, `sitemap.ts`, `cron.ts`

### Known Issues

1. **Auth stub** (`pages/api/auth/sign-in.ts`): Doesn't verify passwords, accepts any credentials
2. **Inconsistent error format**: Mix of `{ message: "..." }` and `{ code: "ERROR", message: "..." }`
3. **Duplicate endpoints**: Both Astro and Hono have business/product endpoints
4. **Missing Zod validation**: Most endpoints lack input validation
5. **Category join issue** (`businesses.ts:151-154`): Uses `b.category_id` but should use `b.categories` from leftJoin

---

## Success Criteria

- [x] All 117 unit tests pass
- [x] `pnpm build` succeeds
- [x] API consistency verified via integration tests
- [x] No security vulnerabilities in auth endpoints
- [x] E2E tests pass (requires running server)

---

## Out of Scope

- Adding new endpoints (only review and fix)
- Database schema changes
- Frontend UI changes
- Cloudflare-specific optimizations (deploy target)

---

## Dependencies

- Astro 6.0.8
- Hono 4.12.5
- better-auth 1.5.3
- Drizzle 0.45.1
- Zod 4.3.6
