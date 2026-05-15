---
increment: 0040-query-layer-nanostores
title: Query Layer Migration & Nanostores
type: refactoring
priority: P1
status: completed
created: 2026-05-10T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Query Layer Migration & Nanostores

## Overview

Migrate to a unified Query Layer and Nanostores for state management. Extract scattered direct database queries into centralized query functions, and add client-side reactive state management for filters, pagination, and UI state.

## User Stories

### US-001: Query Layer Architecture (P1)
**Project**: timorlist

**As a** developer
**I want** centralized query functions
**So that** business logic is reusable, testable, and consistent across all pages

**Acceptance Criteria**:
- [x] **AC-US1-01**: Query functions are in `src/lib/queries/` directory
- [x] **AC-US1-02**: All queries exported from `src/lib/queries/index.ts`
- [x] **AC-US1-03**: TypeScript types for all query inputs and outputs
- [x] **AC-US1-04**: Query functions handle errors consistently (Result pattern)
- [x] **AC-US1-05**: Each query has unit tests with >80% coverage

---

### US-002: Nanostores State Management (P1)
**Project**: timorlist

**As a** user
**I want** reactive state for filters and pagination
**So that** I can browse businesses without page reloads

**Acceptance Criteria**:
- [x] **AC-US2-01**: Stores defined in `src/stores/` directory
- [x] **AC-US2-02**: `searchStore` for search query state
- [x] **AC-US2-03**: `filterStore` for category/region filters
- [x] **AC-US2-04**: `paginationStore` for page state
- [x] **AC-US2-05**: Stores work on both server and client (SSR-safe)

---

### US-003: Migrate Business Pages (P1) — DEFERRED
**Project**: timorlist

**As a** user
**I want** fast business listing with filters
**So that** I can find businesses quickly

**Status**: Deferred to future increment. Query functions and stores are ready, page migration is next phase.

**Acceptance Criteria**:
- [D] **AC-US3-01**: `/businesses` page uses `searchStore` and `filterStore`
- [D] **AC-US3-02**: Category filter updates URL params (shareable links)
- [D] **AC-US3-03**: Search debounced (300ms) before API call
- [D] **AC-US3-04**: Loading state shown during data fetch
- [D] **AC-US3-05**: Empty state shown when no results

---

### US-004: Migrate Business Detail (P2) — DEFERRED
**Project**: timorlist

**As a** user
**I want** a fast-loading business detail page
**So that** I can view business info quickly

**Status**: Deferred to future increment. Query functions ready, page migration is next phase.

**Acceptance Criteria**:
- [D] **AC-US4-01**: Business detail uses `getBusinessBySlug()` query
- [D] **AC-US4-02**: Related businesses query with caching
- [D] **AC-US4-03**: Reviews loaded via `getReviewsByBusinessId()` query

## Functional Requirements

### FR-001: Query Layer Structure
```
src/lib/queries/
├── business.ts      # getBusinessBySlug, getBusinessById, searchBusinesses
├── category.ts      # getAllCategories, getCategoryBySlug
├── review.ts        # getReviewsByBusinessId, createReview
├── user.ts          # getUserById, getUserBusiness
└── index.ts         # Re-exports all queries
```

### FR-002: Result Pattern
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### FR-003: Store Definitions
```typescript
// Stores file structure
src/stores/
├── search.ts        # searchStore
├── filters.ts       # filterStore  
├── pagination.ts    # paginationStore
└── index.ts         # Re-exports all stores
```

### FR-004: SSR Compatibility
- All stores initialize with empty state on server
- Use `$effect` from nanostores for client-side only code
- Hydration works with Astro Islands architecture

## Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Query code reuse | 0% | 80%+ |
| Test coverage | 0% | 80%+ |
| Client-side filter state | N/A | 100% |
| Page load (businesses) | varies | <500ms |

## Out of Scope

- Server-side caching (separate increment)
- Real-time updates (WebSocket)
- Offline support (PWA)
- GraphQL layer

## Dependencies

- nanostores (already installed)
- drizzle-orm (already installed)
- vitest (for testing)

## Technical Approach

### Phase 1: Foundation
1. Create `src/lib/queries/` directory structure
2. Create `src/stores/` directory structure
3. Add Result type pattern
4. Create base tests

### Phase 2: Query Implementation
1. Implement `getBusinessBySlug()`
2. Implement `searchBusinesses()` with pagination
3. Implement `getReviewsByBusinessId()`
4. Migrate `/business/[slug].astro` to use queries

### Phase 3: Store Implementation
1. Implement `searchStore`
2. Implement `filterStore`
3. Implement `paginationStore`
4. Migrate `/businesses` page to use stores

### Phase 4: Integration
1. Add URL sync for shareable filters
2. Add loading/error states
3. Performance testing
