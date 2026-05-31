# 0075: Tasks

### T-001: Fix listing page component
**User Story**: US-001 | **Satisfies ACs**: AC-0075-01, AC-0075-02, AC-0075-03 | **Status**: [x] completed

**Test**: Given `/listing/test-product` exists in database → When user visits page → Then page displays full HTML with product title and description

### T-002: Verify all dynamic pages use consistent DB pattern
**User Story**: US-001 | **Satisfies ACs**: AC-0075-04 | **Status**: [x] completed

**Test**: Given all dynamic pages → When page loads → Then DB access uses `await getDb()` pattern

### T-003: Run Playwright tests
**User Story**: US-001 | **Satisfies ACs**: AC-0075-01, AC-0075-02 | **Status**: [x] completed

**Test**: Given Playwright tests → When `npx playwright test e2e/timorup-complete.spec.ts` runs → Then all tests pass with no 500 errors
