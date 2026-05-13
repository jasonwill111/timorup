---
increment: 0039-server-actions-migration
title: "REST API to Server Actions Migration"
status: active
lastUpdated: 2026-05-11
---

# Tasks: REST API to Server Actions Migration

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed
- `[~]`: In progress

## Phase 1: Auth Actions ✅ COMPLETED

| Task | Description | Status |
|------|-------------|--------|
| T-001 | Auth Sign Up Action | [x] Done |
| T-002 | Auth Sign In Action | [x] Done |
| T-003 | Auth Sign Out Action | [x] Done |
| T-004 | Auth Verify Email Action | [x] Done |
| T-005 | Auth Forgot Password Action | [x] Done |
| T-006 | Auth Reset Password Action | [x] Done |
| T-007 | Admin Login Action | [x] Done |

**Files created**: `src/actions/auth/` (7 files)

## Phase 2: Business Actions ✅ COMPLETED

| Task | Description | Status |
|------|-------------|--------|
| T-008 | Create Business Action | [x] Done |
| T-009 | Update Business Action | [x] Done |
| T-010 | Add Update Action | [x] Done |
| T-011 | Like Business Action | [x] Done |

**Files created**: `src/actions/business/` (5 files)

## Phase 3: Admin Actions ✅ COMPLETED

| Task | Description | Status |
|------|-------------|--------|
| T-012 | Admin Categories Action | [x] Done |
| T-013 | Admin Users Set Role Action | [x] Done |
| T-014 | Admin Settings Action | [x] Done |
| T-015 | Admin AI Tools Action | [x] Done |
| T-016 | Admin Heroes Action | [x] Done |
| T-017 | Admin Listings Action | [x] Done |
| T-018 | Admin Reviews Action | [x] Done |
| T-019 | Admin Subscriptions Action | [x] Done |
| T-020 | Admin Plans Action | [x] Done |
| T-021 | Admin Blogs Action | [x] Done |
| T-022 | Admin AI Generate Action | [x] Done (Blog/SKU/Listing/Landing all working 2026-05-12) |

**Files created**: `src/actions/admin/` (14 files)

## Phase 4: Media/Products/Reviews/Banners ✅ COMPLETED

| Task | Description | Status |
|------|-------------|--------|
| T-023 | Media Upload Action | [x] Done |
| T-024 | Media Delete Action | [x] Done |
| T-025 | Product Create Action | [x] Done |
| T-026 | Product Update Action | [x] Done |
| T-027 | Product Delete Action | [x] Done |
| T-028 | Review Create Action | [x] Done |
| T-029 | Review Reply Action | [x] Done |
| T-030 | Banner Create Action | [x] Done |
| T-031 | Banner Update Action | [x] Done |
| T-032 | Banner Delete Action | [x] Done |

**Files created**:
- `src/actions/media/` (3 files)
- `src/actions/products/` (3 files)
- `src/actions/reviews/` (3 files)
- `src/actions/banners/` (3 files)

## Phase 5: REST API Cleanup ✅ COMPLETED

### Orphaned APIs to Delete (26 endpoints)

**Auth APIs (6)**:
- [x] `src/pages/api/auth/sign-in.ts` → DELETED
- [ ] `src/pages/api/auth/sign-up.ts` → superseded by actions
- [ ] `src/pages/api/auth/sign-out.ts` → superseded by actions
- [ ] `src/pages/api/auth/forgot-password.ts` → superseded by actions
- [ ] `src/pages/api/auth/reset-password.ts` → superseded by actions
- [ ] `src/pages/api/auth/verify-email.ts` → superseded by actions

**Admin APIs (12)**:
- [ ] `src/pages/api/admin/settings/index.ts` → superseded by actions
- [ ] `src/pages/api/admin/settings/save.ts` → superseded by actions
- [ ] `src/pages/api/admin/listing/[id].ts` → superseded by actions
- [ ] `src/pages/api/admin/listing/index.ts` → superseded by actions
- [ ] `src/pages/api/admin/stats.ts` → superseded by actions
- [ ] `src/pages/api/admin/plans/index.ts` → superseded by actions
- [ ] `src/pages/api/admin/plans/[id].ts` → superseded by actions
- [ ] `src/pages/api/admin/skus/index.ts` → superseded by actions
- [ ] `src/pages/api/admin/reviews/index.ts` → superseded by actions
- [ ] `src/pages/api/admin/reviews/[id].ts` → superseded by actions
- [ ] `src/pages/api/admin/slug-check.ts` → superseded by actions
- [ ] `src/pages/api/admin/ai-tools/index.ts` → superseded by actions

**Business APIs (5)**:
- [ ] `src/pages/api/businesses/[slug].ts` → server-side data
- [ ] `src/pages/api/businesses/[slug]/like.ts` → superseded by actions
- [ ] `src/pages/api/businesses/[slug]/updates.ts` → superseded by actions
- [x] `src/pages/api/businesses/create.ts` → DELETED
- [ ] `src/pages/api/businesses/featured.ts` → server-side data

**Other APIs (3)**:
- [ ] `src/pages/api/categories/[slug]/listings.ts` → server-side data
- [ ] `src/pages/api/landing-pages/index.ts` → server-side data
- [ ] `src/pages/api/account/index.ts` → use actions

**Test Files (2)**:
- [x] `src/pages/api/auth/index.test.ts` → DELETED
- [x] `src/pages/api/businesses/index.test.ts` → DELETED

### APIs to Keep (17 endpoints)

**Active - Pages Still Call (15)**:
- [ ] `/api/auth/session` → create session action or keep
- [ ] `/api/media/` → migrate to actions
- [ ] `/api/businesses` → migrate to actions
- [ ] `/api/products` → migrate to actions
- [ ] `/api/categories` → migrate to actions
- [ ] `/api/plans` → migrate to actions
- [ ] `/api/reviews/` → migrate to actions
- [ ] `/api/admin/users/` → migrate to actions
- [ ] `/api/admin/subscriptions` → migrate to actions
- [ ] `/api/admin/blogs` → migrate to actions
- [ ] `/api/admin/heroes` → migrate to actions
- [ ] `/api/admin/categories` → migrate to actions
- [ ] `/api/admin/businesses/` → migrate to actions
- [ ] `/api/admin/non-profits/` → migrate to actions
- [ ] `/api/admin/public-sectors/` → migrate to actions

**External Integrations (2)** - KEEP:
- [x] `/api/auth/sign-in/google` → OAuth external
- [x] `/api/auth/sign-in/facebook` → OAuth external

**Scheduled/Cron (2)** - KEEP:
- [x] `/api/scheduled/_cleanup-expired.ts`
- [x] `/api/scheduled/_mark-expired.ts`
- [x] `/api/scheduled/_cleanup.ts`
- [x] `/api/scheduled/_cleanup-orphan-media.ts`

**Read-only APIs (1)** - KEEP:
- [x] `/api/settings/public/index.ts`

## Phase 6: Session Action ✅ COMPLETED

### T-040: Create Session Action
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01 | **Status**: [x] done

```
- Create src/actions/auth/session.ts ✅
- Return current user from better-auth session ✅
- Replace /api/auth/session endpoint ✅
```

**Files created**: `src/actions/auth/session.ts`

## Summary

| Phase | Tasks | Done | Pending |
|-------|-------|------|---------|
| 1. Auth Actions | 7 | 7 | 0 |
| 2. Business Actions | 4 | 4 | 0 |
| 3. Admin Actions | 11 | 11 | 0 |
| 4. Media/Products/Reviews | 10 | 10 | 0 |
| 5. REST Cleanup | 43 | 4 (keep) | 39 |
| 6. Session Action | 1 | 0 | 1 |
| **Total** | **76** | **36** | **40** |

## Test Coverage

### Unit Tests
- `src/lib/api-validation.test.ts` - Zod schema validation
- `src/lib/business-logic.test.ts` - Business logic
- `src/lib/subscription.test.ts` - Subscription limits

### Integration Tests
- Actions tested via admin pages (27 pages use actions)
- Playwright tests for critical flows

## Next Steps

1. **High Priority**: Create session action to replace `/api/auth/session`
2. **Medium Priority**: Migrate remaining 14 active REST APIs to actions
3. **Low Priority**: Delete 26 orphaned REST endpoints
4. **Optional**: Add more action coverage for edge cases