# Tasks: Subscription Workflow (0030)

## Task Notation
- `[T-###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Schema & Helpers

### T-001: Add subscription fields to business_pages schema
**References**: AC-US3-01, AC-US5-01, AC-US5-02
**Test**: `src/db/schema/subscription.test.ts`

**Implementation Details**:
- Add `subscriptionStatus: text('subscription_status').default('none')` (none/active/expired/cancelled)
- Add `gracePeriodEndDate: integer('grace_period_end_date')` (timestamp)
- Add migration file

**Test Plan**:
- TC-001: Given new business listing → subscriptionStatus = 'none', gracePeriodEndDate = null
- TC-002: Given non-profit listing → subscriptionStatus = 'none' (no expiry tracking needed)

**Dependencies**: None
**Status**: [x] Completed

### T-002: Create subscription helper library
**References**: AC-US4-02, AC-US4-03, AC-US6-01, AC-US6-02, AC-US6-03
**Test**: `src/lib/subscription.test.ts`

**Implementation Details**:
- Create `src/lib/subscription.ts`
- `PLAN_SKU_LIMITS` constant: Basic=10, Pro=30, Max=60
- `getSubscriptionStatus(businessId)` → returns status, skuLimit, skuCount, gracePeriodEnd
- `canCreateSku(businessId)` → boolean (checks status + limit)
- `canEditBusiness(businessId)` → boolean (checks not in grace)
- `isInGracePeriod(businessId)` → boolean

**Test Plan**:
- TC-001: Given active subscription + under limit → canCreateSku = true
- TC-002: Given expired + in grace → canCreateSku = false
- TC-003: Given expired + past grace → "DELETE" (for cleanup job)
- TC-004: Given non-profit → no SKU checks needed

**Dependencies**: T-001
**Status**: [x] Completed

## Phase 2: Business Listing Flow

### T-003: Update listing creation to enforce one-per-user
**References**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04
**Test**: `src/pages/api/businesses/index.test.ts`

**Implementation Details**:
- In `POST /api/businesses`:
  - Check `hasUserBusiness(userId)` first
  - If exists → return 400 with message
  - Set `entityType` based on selection

**Test Plan**:
- TC-001: Given user without listing → creates successfully
- TC-002: Given user with non-profit → cannot create business
- TC-003: Given user with business → cannot create non-profit
- TC-004: Given API called directly → still blocked (idempotent check)

**Dependencies**: T-002
**Status**: [x] Completed

### T-004: Set correct initial status for business/non-profit
**References**: AC-US2-01, AC-US2-02, AC-US3-01
**Test**: `src/lib/subscription.test.ts`

**Implementation Details**:
- non-profit: `status: 'published'`, `subscriptionStatus: 'none'`
- business: `status: 'pending_payment'`, `subscriptionStatus: 'none'`

**Test Plan**:
- TC-001: Given non-profit creation → status = 'published'
- TC-002: Given business creation → status = 'pending_payment'

**Dependencies**: T-003
**Status**: [x] Completed

## Phase 3: SKU Enforcement

### T-005: Add subscription check to SKU create API
**References**: AC-US4-01, AC-US4-02, AC-US4-03, AC-US6-02
**Test**: `src/pages/api/products/index.test.ts`

**Implementation Details**:
- In `POST /api/products`:
  - Call `canCreateSku(businessId)`
  - If false → return 400 with error message
  - Check SKU count < plan limit
  - If at limit → return 400 with message

**Test Plan**:
- TC-001: Given business not yet paid → returns 400
- TC-002: Given expired subscription → returns 400
- TC-003: Given at SKU limit → returns 400 with limit message
- TC-004: Given valid + under limit → creates SKU

**Dependencies**: T-002
**Status**: [x] Completed

### T-006: Block Business Page editing during grace period
**References**: AC-US5-04
**Test**: `src/pages/business/[slug]/edit/index.test.ts`

**Implementation Details**:
- In edit page init():
  - Call `isInGracePeriod(businessId)`
  - If true → show modal, hide form, disable all inputs

**Test Plan**:
- TC-001: Given in grace period → form hidden, modal shown
- TC-002: Given active subscription → normal edit flow

**Dependencies**: T-002
**Status**: [x] Completed

## Phase 4: Admin Confirmation

### T-007: Update admin subscriptions page with confirm/reject
**References**: AC-US3-04
**Test**: `src/pages/admin/subscriptions.astro.test.ts`

**Implementation Details**:
- Add "Confirm Payment" button per pending subscription
- Add "Reject Payment" button per pending subscription
- On confirm: update order status='paid', listing status='published', subscriptionStatus='active'
- On reject: update order status='rejected'

**Test Plan**:
- TC-001: Given admin confirms → listing published, subscription active
- TC-002: Given admin rejects → listing stays pending

**Dependencies**: T-004
**Status**: [x] Completed

### T-008: Set expiry_date on subscription activation
**References**: AC-US3-04, AC-US5-01, AC-US5-02

**Implementation Details**:
- On admin confirm:
  - Calculate expiry_date based on plan (monthly/yearly)
  - Set subscriptionStatus = 'active'

**Dependencies**: T-007
**Status**: [x] Completed

## Phase 5: Grace Period & Cleanup

### T-009: Create grace period modal component
**References**: AC-US5-03, AC-US5-04, AC-US5-05
**Test**: `src/components/islands/GracePeriodModal.test.ts`

**Implementation Details**:
- Create `src/components/islands/GracePeriodModal.astro`
- Props: `daysRemaining`, `businessSlug`
- Content: "请及时为Business Page续费,否则60天之后会删除。谢谢配合!"
- Button: "Renew Now" → `/subscribe?business=${slug}`
- Show days remaining

**Dependencies**: T-002
**Status**: [x] Completed

### T-010: Add grace period check to Business Page
**References**: AC-US5-03, AC-US5-04

**Implementation Details**:
- In `src/pages/business/[slug].astro`:
  - Check `isInGracePeriod(businessId)`
  - If true → render modal overlay on page
  - Modal blocks all interaction with page content

**Dependencies**: T-009
**Status**: [x] Completed

### T-011: Create scheduled cleanup job
**References**: AC-US7-01, AC-US7-02, AC-US7-03, AC-US7-04, AC-US7-05
**Test**: `src/pages/api/scheduled/_cleanup-expired.test.ts`

**Implementation Details**:
- Create `src/pages/api/scheduled/_cleanup-expired.ts`
- Query: listings where `gracePeriodEndDate < NOW()`
- For each:
  - Delete all SKUs for that business
  - Delete the listing
  - Log deletion (console + DB if audit table exists)
- Do NOT delete user account

**Test Plan**:
- TC-001: Given listing past grace period → deleted with SKUs
- TC-002: Given active listing → not deleted
- TC-003: Given in grace period → not deleted
- TC-004: User account exists after listing deleted

**Dependencies**: T-001, T-009
**Status**: [x] Completed

## Verification

### Build & Test
- [ ] Run `pnpm build` - must pass
- [ ] Run `pnpm test` - all tests pass
- [ ] Manual E2E test scenarios:
  1. Create non-profit → immediately published, no SKU option
  2. Create business → pending_payment, redirected to payment
  3. After admin confirm → published, can create SKUs
  4. Create SKUs up to limit → error at limit
  5. Subscription expires → grace period modal appears
  6. During grace → cannot edit/create SKUs
  7. After grace → listing deleted, user remains
