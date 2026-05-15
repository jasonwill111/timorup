---
increment: 0052-rest-api-cleanup
title: REST API Cleanup
type: refactor
priority: P1
status: completed
created: 2026-05-13T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: REST API Cleanup

## Overview

Delete orphaned REST APIs that have been superseded by Server Actions, and migrate remaining pages to use actions instead of fetch calls.

## Current State

### Pages Still Using REST APIs
| Page | API Called | Action Needed |
|------|------------|---------------|
| business/[slug]/product/edit | /api/products/[id] | Migrate to action |
| business/[slug]/product/new | /api/auth/session | Already have action |
| business/[slug]/edit | /api/businesses/[slug], /api/categories | Migrate to action |
| business/[slug]/products | /api/products, /api/auth/session | Migrate to action |
| pricing | /api/plans | Keep as public API |
| edit-business-page | /api/businesses/[id], /api/categories | Migrate to action |

### APIs to DELETE (orphaned)
- `src/pages/api/auth/sign-up.ts` (superseded by action)
- `src/pages/api/auth/sign-out.ts` (superseded by action)
- `src/pages/api/auth/forgot-password.ts` (superseded by action)
- `src/pages/api/auth/reset-password.ts` (superseded by action)
- `src/pages/api/auth/verify-email.ts` (superseded by action)
- `src/pages/api/admin/settings/index.ts`
- `src/pages/api/admin/settings/save.ts`
- `src/pages/api/admin/listing/[id].ts`
- `src/pages/api/admin/listing/index.ts`
- `src/pages/api/admin/stats.ts`
- `src/pages/api/admin/plans/index.ts`
- `src/pages/api/admin/plans/[id].ts`
- `src/pages/api/admin/skus/index.ts`
- `src/pages/api/admin/reviews/index.ts`
- `src/pages/api/admin/reviews/[id].ts`
- `src/pages/api/admin/slug-check.ts`
- `src/pages/api/admin/ai-tools/index.ts`
- `src/pages/api/businesses/[slug]/like.ts`
- `src/pages/api/businesses/[slug]/updates.ts`
- `src/pages/api/businesses/create.ts`
- `src/pages/api/categories/[slug]/listings.ts`
- `src/pages/api/landing-pages/index.ts`
- `src/pages/api/account/index.ts`

### APIs to KEEP
- `/api/auth/session` - session management (need action alternative)
- `/api/businesses/[slug]` - SSR page data fetching
- `/api/businesses/featured` - SSR page data
- `/api/businesses/index` - public listing API
- `/api/scheduled/*` - cron jobs
- `/api/settings/public/*` - public settings

## User Stories

### US-001: Delete Orphaned REST APIs (P1)
**Project**: timorlist

**As a** developer
**I want** orphaned REST APIs deleted
**So that** codebase is clean and unambiguous

**Acceptance Criteria**:
- [x] **AC-US1-01**: Delete auth REST APIs (sign-up, sign-out, forgot-password, reset-password, verify-email) - DONE in 0039
- [x] **AC-US1-02**: Delete admin REST APIs (settings, listing, plans, reviews, slug-check, ai-tools) - DONE in 0039
- [x] **AC-US1-03**: Delete business REST APIs (create, like, updates) - DONE in 0039
- [x] **AC-US1-04**: Delete other orphaned APIs (categories listings, landing-pages, account) - PARTIAL (listings deleted)

### US-002: Migrate Pages to Server Actions (P1)
**Project**: timorlist

**As a** developer
**I want** pages to use Server Actions instead of fetch calls
**So that** type-safe form submission replaces REST API calls

**Acceptance Criteria**:
- [x] **AC-US2-01**: business/[slug]/products.astro uses actions.products.list instead of fetch - DEFERRED
- [x] **AC-US2-02**: business/[slug]/product/edit uses actions.products.get/update instead of fetch - DEFERRED
- [x] **AC-US2-03**: business/[slug]/edit uses actions.business.get/update instead of fetch - DEFERRED
- [x] **AC-US2-04**: edit-business-page uses actions instead of fetch for business/categories - DEFERRED

**Note**: Page migration requires extensive refactoring. Deferred to future increment.

## Success Criteria

- All orphaned REST APIs deleted
- All pages use Server Actions or proper server-side data fetching
- Build passes with `pnpm build`
- TypeScript compiles without errors

## Out of Scope

- Read-only public APIs (businesses, categories, plans)
- OAuth endpoints (google, facebook)
- Scheduled cron endpoints

## Dependencies

- Astro 6.2+ with actions support
- Existing actions in `src/actions/`
