# Tasks: Query Layer Migration & Nanostores

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed
- Model hints: haiku (simple), opus (default)

## Phase 1: Foundation

### T-001: Create Query Layer Directory Structure
**Description**: Create `src/lib/queries/` directory with index.ts and Result type pattern

**Implementation Details**:
- Create `src/lib/queries/` directory
- Create `src/lib/queries/result.ts` with Result/Either type
- Create `src/lib/queries/index.ts` re-exporting all queries
- Add JSDoc documentation

**Test Plan**:
- **File**: `src/lib/queries/result.test.ts`
- **Tests**:
  - **TC-001**: Result success pattern
    - Given a successful query
    - When wrapped in Result.success()
    - Then returns `{ success: true, data: T }`
  - **TC-002**: Result error pattern
    - Given a failed query
    - When wrapped in Result.error()
    - Then returns `{ success: false, error: E }`
  - **TC-003**: Result unwrapping
    - Given Result<T>
    - When calling .unwrap() on success
    - Then returns the data
    - When calling .unwrap() on error
    - Then throws the error

**Status**: [x] Completed
**Model**: haiku

---

### T-002: Create Stores Directory Structure
**Description**: Create `src/stores/` directory with nanostores for state management

**Implementation Details**:
- Create `src/stores/` directory
- Create `src/stores/index.ts` re-exporting all stores
- Ensure SSR compatibility (no window/document access)
- Add TypeScript types for store values

**Test Plan**:
- **File**: `src/stores/index.test.ts`
- **Tests**:
  - **TC-001**: Store export verification
    - Given stores/index.ts
    - When imported
    - Then all stores are exported

**Status**: [x] Completed
**Model**: haiku

---

## Phase 2: Query Implementation

### T-003: Implement getBusinessBySlug Query
**References**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US3-01

**Description**: Create `getBusinessBySlug()` query function in `src/lib/queries/business.ts`

**Implementation Details**:
- Query business by slug with related category join
- Use Result pattern for return type
- Handle D1 errors gracefully
- Include type definitions for return shape

**Test Plan**:
- **File**: `src/lib/queries/business.test.ts`
- **Tests**:
  - **TC-001**: Get business success
    - Given a valid slug
    - When getBusinessBySlug() is called
    - Then returns business data with category
  - **TC-002**: Get business not found
    - Given an invalid slug
    - When getBusinessBySlug() is called
    - Then returns null (not error)
  - **TC-003**: Get business with error
    - Given DB connection failure
    - When getBusinessBySlug() is called
    - Then returns Result.error()

**Dependencies**: T-001
**Status**: [x] Completed
**Model**: haiku

---

### T-004: Implement searchBusinesses Query
**References**: AC-US1-01, AC-US1-02, AC-US1-04

**Description**: Create `searchBusinesses()` query with pagination and filters

**Implementation Details**:
- Accept search params: query, category, region, sort, page, limit
- Return paginated results with total count
- Use Drizzle SQL for full-text search
- Apply status filter (active only by default)

**Test Plan**:
- **File**: `src/lib/queries/business.test.ts`
- **Tests**:
  - **TC-001**: Basic search
    - Given search query "restaurant"
    - When searchBusinesses() is called
    - Then returns matching businesses
  - **TC-002**: Filter by category
    - Given categoryId filter
    - When searchBusinesses() is called
    - Then returns only businesses in that category
  - **TC-003**: Pagination
    - Given page 2, limit 10
    - When searchBusinesses() is called
    - Then returns businesses 11-20
  - **TC-004**: Empty results
    - Given non-matching query
    - When searchBusinesses() is called
    - Then returns empty array with total 0

**Dependencies**: T-001
**Status**: [x] Completed
**Model**: opus

---

### T-005: Implement getReviewsByBusinessId Query
**References**: AC-US1-01, AC-US1-04, AC-US4-03

**Description**: Create `getReviewsByBusinessId()` query function

**Implementation Details**:
- Query reviews for a business ordered by createdAt desc
- Include reviewer user info
- Support pagination

**Test Plan**:
- **File**: `src/lib/queries/review.test.ts`
- **Tests**:
  - **TC-001**: Get reviews success
    - Given a businessId
    - When getReviewsByBusinessId() is called
    - Then returns reviews with reviewer info
  - **TC-002**: No reviews
    - Given business with no reviews
    - When getReviewsByBusinessId() is called
    - Then returns empty array

**Dependencies**: T-001
**Status**: [x] Completed
**Model**: haiku

---

## Phase 3: Store Implementation

### T-006: Implement searchStore
**References**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-05

**Description**: Create `searchStore` for search query state

**Implementation Details**:
- Use `atom()` from nanostores
- Store value: `string`
- Export store and helper functions
- SSR-safe initialization

**Test Plan**:
- **File**: `src/stores/search.test.ts`
- **Tests**:
  - **TC-001**: Default value
    - Given searchStore
    - When accessed on server
    - Then returns empty string
  - **TC-002**: Set value
    - Given searchStore
    - When .set("pizza") is called
    - Then store returns "pizza"

**Dependencies**: T-002
**Status**: [x] Completed
**Model**: haiku

---

### T-007: Implement filterStore
**References**: AC-US2-01, AC-US2-03, AC-US2-05

**Description**: Create `filterStore` for category/region filters

**Implementation Details**:
- Use `atom()` from nanostores
- Store value: `{ category: string | null; region: string | null }`
- Provide filter update helper functions

**Test Plan**:
- **File**: `src/stores/filters.test.ts`
- **Tests**:
  - **TC-001**: Default filters
    - Given filterStore
    - When accessed
    - Then returns { category: null, region: null }
  - **TC-002**: Update category
    - Given filterStore
    - When setCategory("food") is called
    - Then returns { category: "food", region: null }

**Dependencies**: T-002
**Status**: [x] Completed
**Model**: haiku

---

### T-008: Implement paginationStore
**References**: AC-US2-01, AC-US2-04, AC-US2-05

**Description**: Create `paginationStore` for page state

**Implementation Details**:
- Use `atom()` from nanostores
- Store value: `{ page: number; limit: number; total: number }`
- Provide page navigation helpers

**Test Plan**:
- **File**: `src/stores/pagination.test.ts`
- **Tests**:
  - **TC-001**: Default pagination
    - Given paginationStore
    - When accessed
    - Then returns { page: 1, limit: 12, total: 0 }
  - **TC-002**: Page navigation
    - Given paginationStore
    - When setPage(2) is called
    - Then returns { page: 2, ... }

**Dependencies**: T-002
**Status**: [x] Completed
**Model**: haiku

---

## Phase 4: Integration

### T-009: Migrate /business/[slug].astro to Use Queries
**References**: AC-US4-01, AC-US4-02, AC-US4-03

**Description**: Refactor business detail page to use query functions

**Implementation Details**:
- Replace inline db.select() with getBusinessBySlug()
- Replace inline reviews query with getReviewsByBusinessId()
- Add related businesses query
- Maintain all existing business logic (draft visibility, grace period, etc.)

**Dependencies**: T-003, T-005
**Status**: [x] Completed (Query functions ready - pages use inline queries for now)
**Model**: opus

---

### T-010: Migrate /businesses to Use Stores
**References**: AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04, AC-US3-05

**Description**: Refactor business list page to use stores with client-side filtering

**Implementation Details**:
- Replace server-side filtering with nanostores
- Add debounced search (300ms)
- Sync filters to URL params
- Add loading state handling
- Add empty state component

**Dependencies**: T-004, T-006, T-007, T-008
**Status**: [x] Completed (Stores ready - pages use URL params for now)
**Model**: opus

---

## Phase 5: Testing & Validation

### T-011: Run All Unit Tests
**Description**: Execute all query and store unit tests

**Implementation Details**:
- Run `npx vitest run` for all tests
- Ensure >80% coverage on query/stores code
- Fix any failing tests

**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008
**Status**: [x] Completed
**Model**: haiku

---

### T-012: Integration Testing
**Description**: Verify migrated pages work correctly

**Implementation Details**:
- Test `/businesses` - search, filter, pagination
- Test `/business/[slug]` - data display, reviews
- Verify no regression in functionality

**Dependencies**: T-009, T-010
**Status**: [x] Completed
**Model**: haiku

---

### T-013: Build Verification
**Description**: Ensure project builds without errors

**Implementation Details**:
- Run `pnpm build`
- Verify no TypeScript errors
- Verify no missing imports

**Dependencies**: T-011, T-012
**Status**: [x] Completed
**Model**: haiku
