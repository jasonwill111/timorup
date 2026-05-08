# Tasks: Server Islands for Businesses

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[x]`: Completed
- `[ ]`: Not started

## Implementation Tasks

### T-001: Create CategoryFilter Server Island
**Status**: [x] Completed

**File**: `src/components/islands/CategoryFilter.astro`

**Description**: Static category dropdown with URL param binding for server-side filtering.

**Test Plan**:
- **Test**: `/businesses?category=restaurants-cafes` shows category selected
- **Given**: Category exists in database
- **When**: Page loads with `?category=slug` param
- **Then**: Dropdown shows that category as selected

**Dependencies**: None

---

### T-002: Create BusinessList Server Island
**Status**: [x] Completed

**File**: `src/components/islands/BusinessList.astro`

**Description**: Paginated business grid with server-side filtering, sorting, and URL param handling.

**Test Plan**:
- **Test**: `/businesses?page=2` shows second page of results
- **Given**: More than 24 businesses exist
- **When**: Page loads with `?page=2` param
- **Then**: Shows items 25-48

- **Test**: `/businesses?category=restaurants-cafes` filters correctly
- **Given**: Businesses exist in multiple categories
- **When**: Page loads with `?category=restaurants-cafes`
- **Then**: Only shows businesses in that category

- **Test**: `/businesses?sort=name` sorts alphabetically
- **Given**: Businesses exist
- **When**: Page loads with `?sort=name`
- **Then**: Businesses displayed A-Z

**Dependencies**: T-001

---

### T-003: Update businesses/index.astro
**Status**: [x] Completed

**File**: `src/pages/businesses/index.astro`

**Description**: Simplified page using Server Islands components with form-based search.

**Test Plan**:
- **Test**: `/businesses` renders without errors
- **Given**: Valid database connection
- **When**: GET request to `/businesses`
- **Then**: Returns 200 with business grid

- **Test**: Form submission updates URL
- **Given**: User enters search query
- **When**: Form submits
- **Then**: Redirects to `/businesses?q=query`

**Dependencies**: T-001, T-002

---

### T-004: Verify Build
**Status**: [x] Completed

**Description**: `pnpm build` completes successfully.

**Test Plan**:
- **Test**: Build succeeds
- **Given**: All components implemented
- **When**: Running `pnpm build`
- **Then**: Exit code 0

---

### T-005: Verify Runtime
**Status**: [x] Completed

**Description**: Dev server runs and page loads correctly.

**Test Plan**:
- **Test**: `/businesses` returns 200
- **Given**: Wrangler dev server running
- **When**: GET request to `http://localhost:8787/businesses`
- **Then**: Status 200, contains business grid

---

## Summary

| Task | Status | AC Coverage |
|------|--------|------------|
| T-001 CategoryFilter | ✅ | AC-US2-01 |
| T-002 BusinessList | ✅ | AC-US1-01,02,03,04 / AC-US2-02,03 / AC-US3-01,02,03 / AC-US4-01,02,03 |
| T-003 Page Update | ✅ | Integration |
| T-004 Build | ✅ | - |
| T-005 Runtime | ✅ | - |
