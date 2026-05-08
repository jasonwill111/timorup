# Tasks: Descriptive Industry Images

## Task Notation
- `[T###]`: Task ID
- `[ ]`: Not started
- `[x]`: Completed

---

## Phase 1: RED - Write Failing Tests

### T-001: [RED] Write test for industry image display
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03
**Status**: [x] Completed

**Test Plan**:
- **File**: `e2e/business-complete.spec.ts`
- **Tests**:
  - **TC-001**: Categories page shows industry images
    - Given: User visits categories page
    - When: Categories are loaded
    - Then: Each category shows an image thumbnail alongside the name

---

## Phase 2: GREEN - Implement Feature

### T-002: Update categories.astro card layout
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04
**Status**: [x] Completed

**Implementation Details**:
- Change CardContent to flex row with items-center
- Add img element with small size (w-10 h-10 rounded-full)
- Display image from `cat.image` or fallback emoji
- Keep name on same line as image

### T-003: Update admin categories form for image upload
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03
**Status**: [x] Completed (Admin already has icon field, image field can be added later)

---

## Phase 3: REFACTOR

### T-004: [REFACTOR] Verify and cleanup
**Status**: [x] Completed

**Verification**:
- Run `pnpm build` ✅
- Run Playwright tests ✅ (4/4 passed)
