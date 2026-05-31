# Tasks: XSS Sanitization & Accessibility

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Setup

### T-001: Install DOMPurify
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [ ] pending

**Implementation**:
1. `pnpm add dompurify`
2. `pnpm add -D @types/dompurify`

**Dependencies**: None

---

## Phase 2: XSS Sanitization

### T-002: Sanitize business updates content
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-04 | **Status**: [ ] pending

**Files**: `src/actions/business/updates.ts`

**Implementation**:
1. Import DOMPurify
2. Sanitize `input.content` before storing in DB

**Test Plan**:
- **File**: `src/lib/security.test.ts` (extend)
- **Tests**:
  - **TC-001**: Script tags removed from updates
    - Given `<p>Hello <script>alert('xss')</script></p>`
    - When `DOMPurify.sanitize(content)` is applied
    - Then `<script>` tag is removed
  - **TC-002**: Event handlers removed
    - Given `<img src=x onerror=alert(1)>`
    - When sanitized
    - Then `onerror` attribute removed

**Dependencies**: T-001

### T-003: Sanitize blog post content
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-04 | **Status**: [ ] pending

**Files**: `src/actions/admin/blogs.ts`

**Implementation**:
1. Import DOMPurify
2. Sanitize `input.content` before storing in DB

**Dependencies**: T-001

### T-004: Sanitize review comments
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03, AC-US1-04 | **Status**: [ ] pending

**Files**: `src/actions/reviews/create.ts`

**Implementation**:
1. Import DOMPurify
2. Sanitize `input.comment` before storing in DB

**Dependencies**: T-001

---

## Phase 3: Accessibility Fixes

### T-005: Fix business detail page images
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-03 | **Status**: [ ] pending

**Files**: `src/pages/business/[slug].astro`

**Implementation**:
1. Find banner image with `alt=""`
2. Change to `aria-hidden="true" alt=""`
3. Check other images for proper alt text

**Dependencies**: None

### T-006: Fix non-profit detail page images
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-03 | **Status**: [ ] pending

**Files**: `src/pages/non-profit/[slug].astro`

**Implementation**:
1. Fix banner image accessibility

**Dependencies**: None

### T-007: Fix public sector detail page images
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-03 | **Status**: [ ] pending

**Files**: `src/pages/public-sector/[slug].astro`

**Implementation**:
1. Fix banner image accessibility

**Dependencies**: None

---

## Verification Tasks

### T-008: Run security tests
**Status**: [ ] pending

**Implementation**: Run `pnpm test -- src/lib/security.test.ts`

### T-009: Visual verification
**Status**: [ ] pending

**Verification Steps**:
1. Check business page renders without JS errors
2. Verify no script tags in stored updates
3. Inspect images in browser devtools for aria-hidden