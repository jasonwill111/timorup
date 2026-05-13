---
increment: 0052-rest-api-cleanup
title: "REST API Cleanup"
status: active
lastUpdated: 2026-05-13
---

# Tasks: REST API Cleanup

## Phase 1: Delete Orphaned REST APIs

### T-001: Delete orphaned auth APIs
**Status**: [x] completed
**Files**:
- src/pages/api/auth/sign-up.ts (already deleted in 0039)
- src/pages/api/auth/sign-out.ts (already deleted in 0039)
- src/pages/api/auth/forgot-password.ts (already deleted in 0039)
- src/pages/api/auth/reset-password.ts (already deleted in 0039)
- src/pages/api/auth/verify-email.ts (already deleted in 0039)

### T-002: Delete orphaned admin APIs
**Status**: [x] completed (most were already deleted in 0039)
**Files**:
- src/pages/api/admin/settings/index.ts (already deleted)
- src/pages/api/admin/settings/save.ts (already deleted)
- src/pages/api/admin/listing/[id].ts (already deleted)
- src/pages/api/admin/listing/index.ts (already deleted)
- src/pages/api/admin/stats.ts (not found)
- src/pages/api/admin/plans/index.ts (already deleted)
- src/pages/api/admin/plans/[id].ts (already deleted)
- src/pages/api/admin/skus/index.ts (already deleted)
- src/pages/api/admin/reviews/index.ts (already deleted)
- src/pages/api/admin/reviews/[id].ts (already deleted)
- src/pages/api/admin/slug-check.ts (already deleted)
- src/pages/api/admin/ai-tools/index.ts (already deleted)

### T-003: Delete orphaned business/other APIs
**Status**: [x] completed
**Files**:
- src/pages/api/businesses/[slug]/like.ts (already deleted)
- src/pages/api/businesses/[slug]/updates.ts (already deleted)
- src/pages/api/businesses/create.ts (already deleted)
- src/pages/api/categories/[slug]/listings.ts (DELETED this session)
- src/pages/api/landing-pages/index.ts (not found)
- src/pages/api/account/index.ts (not found)

## Phase 2: Migrate Pages to Server Actions

### T-004: Migrate business/[slug]/products.astro
**Status**: [~] deferred to future increment
**Files**: src/pages/business/[slug]/products.astro
**Reason**: Requires extensive refactoring of fetch patterns
**Note**: Keep using REST APIs for now, migrate in future increment

### T-005: Migrate business/[slug]/product/[id]/edit/index.astro
**Status**: [~] deferred to future increment
**Files**: src/pages/business/[slug]/product/[id]/edit/index.astro
**Reason**: Requires extensive refactoring of fetch patterns

### T-006: Migrate business/[slug]/product/new/index.astro
**Status**: [~] deferred to future increment
**Files**: src/pages/business/[slug]/product/new/index.astro
**Reason**: Requires extensive refactoring of fetch patterns

### T-007: Migrate business/[slug]/edit/index.astro
**Status**: [~] deferred to future increment
**Files**: src/pages/business/[slug]/edit/index.astro
**Reason**: Requires extensive refactoring of fetch patterns

### T-008: Migrate edit-business-page/[id].astro
**Status**: [~] deferred to future increment
**Files**: src/pages/edit-business-page/[id].astro
**Reason**: Requires extensive refactoring of fetch patterns

## Verification

### T-009: Build verification
**Status**: [x] completed
**Command**: `pnpm build`
**Expected**: Success ✅ (verified 2026-05-13)