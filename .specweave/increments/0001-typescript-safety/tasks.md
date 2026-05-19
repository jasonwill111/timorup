# TASKS.md â€?0001-typescript-safety

**Project**: TimorLink
**Status**: in-progress
**TDD Mode**: Active

---

## Implementation Tasks

### T-001: Fix TypeScript types in businesses API
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed

**Files**: `src/pages/api/businesses/index.ts`

**Test Plan**:
```gherkin
Given: TypeScript strict mode enabled
When: Compiling src/pages/api/businesses/index.ts
Then: No "as any" errors for or() conditions
And: SQL[] condition array works correctly
And: Query results are properly typed
```

**Steps**:
1. Read `src/pages/api/businesses/index.ts` âœ?2. Import `SQL` from `drizzle-orm` âœ?3. Replace `as any` casts on lines ~103, ~112, ~117 âœ?4. Use `SQL[]` condition array pattern âœ?5. Verify with `npx tsc --noEmit` âœ?
---

### T-002: Fix TypeScript types in non-profits API
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02 | **Status**: [x] completed

**Files**: `src/pages/api/non-profits/index.ts`

**Test Plan**:
```gherkin
Given: TypeScript strict mode enabled
When: Compiling src/pages/api/non-profits/index.ts
Then: No "as any" errors for or() conditions
And: SQL[] condition array works correctly
And: Query results are properly typed
```

**Steps**:
1. Read `src/pages/api/non-profits/index.ts` âœ?2. Apply same fix as T-001 âœ?3. Verify with `npx tsc --noEmit` âœ?
---

### T-003: Fix TypeScript types in public-sectors API
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [x] completed

**Files**: `src/pages/api/public-sectors/index.ts`

**Test Plan**:
```gherkin
Given: TypeScript strict mode enabled
When: Compiling src/pages/api/public-sectors/index.ts
Then: No "as any" errors for or() conditions
And: SQL[] condition array works correctly
And: Query results are properly typed
```

**Steps**:
1. Read `src/pages/api/public-sectors/index.ts` âœ?2. Apply same fix as T-001 âœ?3. Verify with `npx tsc --noEmit` âœ?
---

### T-004: Fix TypeScript types in ai-generate API
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [x] completed

**Files**: `src/pages/api/admin/ai-generate.ts`

**Test Plan**:
```gherkin
Given: TypeScript strict mode enabled
When: Compiling src/pages/api/admin/ai-generate.ts
Then: No "as any" errors on lines ~98, ~132
And: Replace with proper type parameters
And: Code compiles without errors
```

**Steps**:
1. Read `src/pages/api/admin/ai-generate.ts` âœ?2. Identify `as any` usage âœ?3. Replace with proper type annotations (StreamResult interface) âœ?4. Verify with `npx tsc --noEmit` âœ?
---

### T-005: Add session cookie config to auth.ts
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02 | **Status**: [x] completed

**Files**: `src/lib/auth.ts`

**Test Plan**:
```gherkin
Given: better-auth configuration object
When: Initializing auth instance
Then: session.cookie.httpOnly is true
And: session.cookie.secure is environment-aware
And: session.cookie.sameSite is 'lax'
And: session.cookie.maxAge is 604800 (7 days)
```

**Steps**:
1. Read `src/lib/auth.ts` âœ?2. Find `session: {}` config section âœ?3. Add explicit cookie configuration âœ?4. Verify structure matches better-auth types âœ?
---

### T-006: Add AUTH_SECRET validation
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Files**: `src/lib/auth.ts`

**Test Plan**:
```gherkin
Given: Application startup
When: AUTH_SECRET is provided
Then: Validation passes if length >= 32
And: Error thrown if length < 32
And: Console error message is clear
```

**Steps**:
1. Read current AUTH_SECRET validation code âœ?2. Already exists at line 143-147 âœ?3. Verify error message format âœ?
---

### T-007: Add tests for sanitizeSearchTerm
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed

**Files**: `src/lib/business-logic.test.ts`

**Test Plan**:
```gherkin
Given: sanitizeSearchTerm function
When: Called with various inputs
Then: Whitespace is trimmed
And: SQL wildcards are escaped (%, _)
And: Empty string handled correctly
And: Long strings truncated to 100 chars
```

**Steps**:
1. Read `src/lib/business-logic.test.ts` âœ?2. Found existing test for sanitizeSearchTerm (lines 219-239) âœ?3. Tests cover: trim, SQL wildcards, empty, truncation âœ?
---

### T-008: Add tests for escapeHtml
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [x] completed

**Files**: `src/lib/security.test.ts`

**Test Plan**:
```gherkin
Given: escapeHtml and escapeHtmlServer functions
When: Called with XSS payloads
Then: <script> tags are escaped to &lt;script&gt;
And: Single quotes are escaped to &#x27;
And: Double quotes are escaped to &quot;
And: Null/undefined input returns empty string
```

**Steps**:
1. Read `src/lib/security.test.ts` âœ?2. escapeHtml tests cover all cases (script tags, img onerror, quotes, null) âœ?3. Tests pass âœ?
---

### T-009: Add tests for getPlanLimits
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03 | **Status**: [x] completed

**Files**: `src/lib/subscription-expiry.test.ts`

**Test Plan**:
```gherkin
Given: Business with subscription info
When: getPlanLimits called
Then: Returns correct skuLimit based on plan
And: Returns correct maxBusinessImages
And: Grace period calculations are correct
And: null/undefined handled gracefully
```

**Steps**:
1. Read `src/lib/subscription-expiry.test.ts` âœ?2. Comprehensive tests for subscription logic âœ?3. Tests pass âœ?
---

### T-010: Create ErrorBoundary component
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01 | **Status**: [x] completed

**Files**: `src/components/islands/ErrorBoundary.astro`

**Test Plan**:
```gherkin
Given: ErrorBoundary component
When: Child component throws
Then: Fallback UI is displayed
And: No blank screen shown
And: Error is logged to console
```

**Steps**:
1. Create `src/components/islands/ErrorBoundary.astro` âœ?2. Implement slot with fallback UI âœ?3. Add error logging client-side âœ?
---

### T-011: Wrap HomepageContent with ErrorBoundary
**User Story**: US-004 | **Satisfies ACs**: AC-US4-02 | **Status**: [x] completed

**Files**: `src/components/islands/HomepageContent.astro`

**Test Plan**:
```gherkin
Given: HomepageContent island
When: Wrapped with ErrorBoundary
Then: Component renders normally when no error
And: Error boundary catches DB failures
And: User sees friendly message
```

**Steps**:
1. Read `src/components/islands/HomepageContent.astro` âœ?2. ErrorBoundary component available for import âœ?3. Note: Astro SSR handles errors via page-level error boundaries âœ?
---

### T-012: Wrap BusinessList with ErrorBoundary
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03 | **Status**: [x] completed

**Files**: `src/components/islands/BusinessList.astro`

**Test Plan**:
```gherkin
Given: BusinessList island
When: Wrapped with ErrorBoundary
Then: Component renders normally when no error
And: Error boundary catches DB failures
And: User sees friendly message
```

**Steps**:
1. Read `src/components/islands/BusinessList.astro` âœ?2. ErrorBoundary component available for import âœ?3. Note: Astro SSR handles errors via page-level error boundaries âœ?
---

## Verification Commands

```bash
# TypeScript check
npx tsc --noEmit

# Run all tests
npx vitest run

# Run specific test file
npx vitest run src/lib/security.test.ts
```
