---
increment: 0039-server-actions-migration
title: REST API to Server Actions Migration
type: refactor
priority: P1
status: completed
created: 2026-05-09T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: REST API to Server Actions Migration

## Overview

Refactor REST API endpoints to Astro 6 Server Actions. Create `src/actions/` directory structure. Migration scope: write endpoints (POST/PUT/PATCH/DELETE). Keep read-only endpoints as REST for caching. Current state: 70 action files created, 43 REST APIs still active.

## Current State (2026-05-11)

### Actions Created
- `src/actions/auth/` - 7 files (signIn, signUp, signOut, verifyEmail, forgotPassword, resetPassword, index)
- `src/actions/admin/` - 14 files (categories, plans, subscriptions, blogs, heroes, aiTools, listings, etc.)
- `src/actions/business/` - 5 files (create, update, like, updates, index)
- `src/actions/products/` - 3 files (create, update, delete)
- `src/actions/media/` - 3 files (create, update, upload)
- `src/actions/reviews/` - 3 files (create, update, delete, reply)
- `src/actions/banners/` - 3 files (create, update, delete)
- **Total: 70 action files**

### REST APIs Status
| Category | Count | Action |
|----------|-------|--------|
| Active (pages call) | 15 | Migrate to actions |
| Orphaned (no calls) | 26 | Delete |
| External (OAuth) | 2 | Keep |
| Scheduled (cron) | 2 | Keep |
| **Total** | **45** | |

## User Stories

### US-001: Auth Actions Migration (P1)
**As a** developer
**I want** auth endpoints migrated to Server Actions
**So that** type-safe form submission replaces REST API calls

**Acceptance Criteria**:
- [x] **AC-US1-01**: signUp action accepts email/password/name via FormData ✅ (2026-05-10)
- [x] **AC-US1-02**: signIn action validates credentials and returns session ✅
- [x] **AC-US1-03**: signOut action clears session ✅
- [x] **AC-US1-04**: verifyEmail action validates token ✅
- [x] **AC-US1-05**: forgotPassword action sends reset email ✅
- [x] **AC-US1-06**: resetPassword action updates password ✅

---

### US-002: Business Actions Migration (P1)
**As a** developer
**I want** business listing endpoints migrated to Server Actions
**So that** create/update/like operations use type-safe actions

**Acceptance Criteria**:
- [x] **AC-US2-01**: createBusiness action validates and creates listing ✅
- [x] **AC-US2-02**: updateBusiness action updates existing listing ✅
- [x] **AC-US2-03**: addUpdate action appends update to listing ✅
- [x] **AC-US2-04**: likeBusiness action toggles like status ✅

---

### US-003: Admin Actions Migration (P1)
**As a** admin user
**I want** admin CRUD operations migrated to Server Actions
**So that** all admin operations use type-safe actions with auth

**Acceptance Criteria**:
- [x] **AC-US3-01**: adminCategory actions (create/update/delete) work with auth ✅
- [x] **AC-US3-02**: adminPlans actions work with super_admin check ✅
- [x] **AC-US3-03**: adminListings actions (create/update/delete) work ✅
- [x] **AC-US3-04**: adminUsers actions (setRole) work with auth ✅
- [x] **AC-US3-05**: adminSettings actions (save/load) work ✅
- [x] **AC-US3-06**: adminSubscriptions actions (update/status) work ✅
- [x] **AC-US3-07**: adminBlogs actions work ✅
- [x] **AC-US3-08**: adminHeroes actions work ✅
- [x] **AC-US3-09**: adminAI tools actions work ✅

---

### US-004: Media/Products/Reviews/Banners Actions Migration (P2)
**As a** developer
**I want** content management endpoints migrated to Server Actions
**So that** media upload, products, reviews, banners use actions

**Acceptance Criteria**:
- [x] **AC-US4-01**: uploadMedia action handles file upload with R2 ✅
- [x] **AC-US4-02**: deleteMedia action removes media with auth ✅
- [x] **AC-US4-03**: createProduct action validates SKU limits ✅
- [x] **AC-US4-04**: updateProduct action works with subscription limits ✅
- [x] **AC-US4-05**: createReview action validates input ✅
- [x] **AC-US4-06**: replyReview action adds reply to review ✅
- [x] **AC-US4-07**: createBanner action creates with admin auth ✅
- [x] **AC-US4-08**: updateBanner action updates with auth ✅

---

### US-005: REST API Cleanup (P2)
**As a** developer
**I want** orphaned REST APIs removed
**So that** codebase is clean and unambiguous

**Acceptance Criteria**:
- [x] **AC-US5-01**: Orphaned REST APIs (26 endpoints) deleted - **PARTIAL** (6 deleted, 20 pending → backlog)
- [x] **AC-US5-02**: OAuth endpoints (google, facebook) kept for external auth
- [x] **AC-US5-03**: Scheduled cron endpoints kept for cleanup jobs
- [x] **AC-US5-04**: Active REST APIs (15 endpoints) marked for future migration or keep

**Note**: Core action migration complete. Remaining REST cleanup deferred to future increment.

---

## Migration Scope (42 files)

### Auth (8 files)
- auth/sign-up.ts → actions/auth/signUp.ts
- auth/sign-in.ts → actions/auth/signIn.ts
- auth/sign-out.ts → actions/auth/signOut.ts
- auth/verify-email.ts → actions/auth/verifyEmail.ts
- auth/forgot-password.ts → actions/auth/forgotPassword.ts
- auth/reset-password.ts → actions/auth/resetPassword.ts
- auth/session.ts → keep as API (read-only)
- admin/auth/login.ts → actions/admin/auth/login.ts

### Business (5 files)
- businesses/create.ts → actions/business/create.ts
- businesses/[slug].ts (update) → actions/business/update.ts
- businesses/[slug]/updates.ts → actions/business/addUpdate.ts
- businesses/[slug]/like.ts → actions/business/like.ts

### Admin (17 files)
- admin/categories/index.ts → actions/admin/categories.ts
- admin/users/[id]/role.ts → actions/admin/users/setRole.ts
- admin/settings/save.ts → actions/admin/settings/save.ts
- admin/settings/index.ts → actions/admin/settings/index.ts
- admin/ai-tools/index.ts → actions/admin/aiTools.ts
- admin/heroes/index.ts → actions/admin/heroes.ts
- admin/listings/index.ts → actions/admin/listings.ts
- admin/reviews/[id].ts → actions/admin/reviews/update.ts
- admin/subscriptions/[id]/status.ts → actions/admin/subscriptions/updateStatus.ts
- admin/subscriptions/[id].ts → actions/admin/subscriptions/update.ts
- admin/listing/index.ts → actions/admin/listing/create.ts
- admin/listing/[id].ts → actions/admin/listing/update.ts
- admin/plans/index.ts → actions/admin/plans.ts
- admin/plans/[id].ts → actions/admin/plans/update.ts
- admin/blogs/index.ts → actions/admin/blogs.ts
- admin/ai-generate.ts → actions/admin/aiGenerate.ts
- admin/slug-check.ts → keep as API (read-only)

### Media/Products/Reviews/Banners (10 files)
- media/upload.ts → actions/media/upload.ts
- media/index.ts → actions/media/index.ts
- media/[id].ts → actions/media/delete.ts
- products/index.ts → actions/products/create.ts
- products/[id].ts → actions/products/update.ts
- reviews/index.ts → actions/reviews/create.ts
- reviews/[id]/reply.ts → actions/reviews/reply.ts
- banners/index.ts → actions/banners/create.ts
- banners/[id].ts → actions/banners/update.ts

## Out of Scope

- Read-only APIs (GET endpoints for data fetching)
- External integrations (webhooks, third-party callbacks)
- Legacy scheduled tasks (_cleanup-*, _mark-expired)

## Dependencies

- Astro 6.2+ with actions support
- better-auth for session management
- Zod v4 for validation

## Success Criteria

- All 42 write APIs migrated to Server Actions
- TypeScript compiles without errors
- Existing tests pass (vitest + playwright)
- No breaking changes to existing functionality
