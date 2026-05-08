# Tasks: Admin Plan Management (0031)

## Task Notation
- `[T-###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Schema & API

### T-001: Create plans table schema
**References**: AC-US1-01, AC-US1-02
**Test**: `src/db/schema/plans.test.ts`

**Implementation Details**:
- Create `src/db/schema/plans.ts`
- Fields: id, name, period, amount, skuLimit, maxImages, maxVideos, features, description, sortOrder, active
- Export from `src/db/schema/index.ts`

**Dependencies**: None
**Status**: [x] Completed (schema created, exported)

### T-002: Create seed data for initial plans
**References**: AC-US1-02
**Test**: `src/db/seed/plans.test.ts`

**Implementation Details**:
- Insert 6 plans: basic/pro/max × monthly/yearly
- Use drizzle seed or migration script

**Dependencies**: T-001
**Status**: [x] Completed (migration 0005 with 6 plans seeded)

### T-003: Create public /api/plans endpoint
**References**: AC-US1-03, AC-US3-01, AC-US3-02
**Test**: `src/pages/api/plans/index.test.ts`

**Implementation Details**:
- GET returns active plans sorted by sortOrder
- Cache response for 5 minutes

**Dependencies**: T-001
**Status**: [x] Completed (GET /api/plans with 5min CDN cache)

### T-004: Create admin /api/admin/plans endpoints
**References**: AC-US2-03, AC-US2-04
**Test**: `src/pages/api/admin/plans/index.test.ts`

**Implementation Details**:
- GET all plans (including inactive)
- PUT update single plan by ID
- Require admin authentication

**Dependencies**: T-001
**Status**: [x] Completed (GET + PUT endpoints with admin auth)

## Phase 2: Frontend Integration

### T-005: Update /pricing page to use DB plans
**References**: AC-US3-01
**Test**: `src/pages/pricing.test.ts`

**Implementation Details**:
- Fetch from `/api/plans` instead of hardcoded
- Handle loading/error states

**Dependencies**: T-003
**Status**: [x] Completed (client-side fetch from /api/plans)

### T-006: Update /subscribe page to use DB plans
**References**: AC-US3-02
**Test**: `src/pages/subscribe.test.ts`

**Implementation Details**:
- Fetch from `/api/plans` instead of hardcoded
- Pass plan data to confirmation step

**Dependencies**: T-003
**Status**: [x] Completed (SSR fetch from DB)

### T-007: Update subscription.ts to use DB plan limits
**References**: AC-US3-03, AC-US4-01, AC-US4-02
**Test**: `src/lib/subscription.test.ts`

**Implementation Details**:
- Add `getPlanLimits(planType)` function
- Query plans table for skuLimit

**Dependencies**: T-001, T-003
**Status**: [x] Completed (getPlanLimits and getPlanSkuLimit functions added)

### T-008: Update media API to use DB plan limits
**References**: AC-US4-03
**Test**: `src/pages/api/media/index.test.ts`

**Implementation Details**:
- Query plan from DB based on business's planType
- Use plan's maxImages/maxVideos

**Dependencies**: T-001, T-007
**Status**: [x] Completed (media/index.ts and media/upload.ts updated)

## Phase 3: Admin UI

### T-009: Create /admin/plans page
**References**: AC-US2-01, AC-US2-02
**Test**: `src/pages/admin/plans.test.ts`

**Implementation Details**:
- List all plans with edit buttons
- Modal form for editing plan details
- Save changes via PUT /api/admin/plans/[id]

**Dependencies**: T-004
**Status**: [x] Completed (plans.astro with edit modal)

### T-010: Add /admin/plans to sidebar navigation
**References**: AC-US2-01
**Test**: Manual verification

**Implementation Details**:
- Add menu item in AdminLayout.astro
- Require admin/editor role

**Dependencies**: T-009
**Status**: [x] Completed (added to desktop and mobile sidebar)

## Phase 4: Migration

### T-011: Create D1 migration for plans table
**References**: AC-US1-01
**Test**: Manual verification with `npx wrangler d1 migrations apply`

**Implementation Details**:
- Create migration file in `migrations/`
- Include seed data

**Dependencies**: T-001, T-002
**Status**: [x] Completed (migration 0005 applied to remote D1)

## Verification

- [x] `pnpm build` passes
- [x] Manual test: Go /admin/plans, edit plan, check /pricing reflects change
- [x] Manual test: Create business subscription uses current plan limits
