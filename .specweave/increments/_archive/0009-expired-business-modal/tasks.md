# Tasks: Expired Business Subscription Modal

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

---

## Phase 1: RED - Write Failing Tests

### T-001: [RED] Write test for expired business modal visibility
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03
**Status**: [x] Completed

**Test Plan**:
- **File**: `e2e/business-complete.spec.ts`
- **Tests**:
  - **TC-001**: Expired business shows modal overlay
    - Given: A business page with `isSubscriptionActive: false`
    - When: Page loads
    - Then: Modal overlay is visible with "subscription has expired" message

---

## Phase 2: GREEN - Implement Feature

### T-002: Add expired modal HTML structure
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-04
**Status**: [x] Completed

### T-003: Add CSS for modal styling
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-03
**Status**: [x] Completed

### T-004: Update JS to show modal when expired
**User Story**: US-001, US-002 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-05
**Status**: [x] Completed

### T-005: Update status badge for expired state
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03
**Status**: [x] Completed

---

## Phase 3: REFACTOR

### T-006: [REFACTOR] Verify and cleanup
**Status**: [x] Completed

**Verification**:
- Run `pnpm build` ✅
- Run Playwright tests ✅ (5/5 passed)
