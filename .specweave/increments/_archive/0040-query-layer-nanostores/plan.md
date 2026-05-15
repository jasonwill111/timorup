# Implementation Plan: Query Layer Migration & Nanostores

## Overview

Migrate scattered database queries to a unified Query Layer (`src/lib/queries/`) and add Nanostores for reactive client-side state management (`src/stores/`). This refactoring improves code reuse, testability, and enables fast client-side filtering without page reloads.

## Architecture

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| Query Layer | Centralized DB query functions | `src/lib/queries/` |
| Stores | Reactive client state | `src/stores/` |
| Business Island | Client-side business list | `src/components/islands/` |

### Data Flow

```
[Client]  store.set() → nanostores → API call → Query Layer → Drizzle → D1
   ↑                                              ↑
[Astro]  initial data → Render → Hydration ───────┘
```

## Query Layer

### File Structure

```
src/lib/queries/
├── result.ts         # Result<Either> type pattern
├── business.ts      # getBusinessBySlug, getBusinessById, searchBusinesses
├── category.ts      # getAllCategories, getCategoryBySlug
├── review.ts        # getReviewsByBusinessId, createReview
├── user.ts         # getUserById, getUserBusiness
└── index.ts        # Re-exports all queries
```

### Result Pattern

```typescript
// src/lib/queries/result.ts
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export const Result = {
  ok: <T>(data: T): Result<T> => ({ success: true, data }),
  err: <E>(error: E): Result<never, E> => ({ success: false, error }),
} as const;

export function unwrap<T>(result: Result<T>): T {
  if (!result.success) throw result.error;
  return result.data;
}
```

### Query Signature Example

```typescript
// src/lib/queries/business.ts
export async function getBusinessBySlug(slug: string) {
  const db = await getDb();
  const business = await db.select()
    .from(businessPages)
    .where(eq(businessPages.slug, slug))
    .get();

  if (!business) return null;
  return business;
}
```

## Stores

### File Structure

```
src/stores/
├── search.ts        # searchStore (atom<string>)
├── filters.ts       # filterStore (atom<FilterState>)
├── pagination.ts    # paginationStore (atom<PaginationState>)
└── index.ts        # Re-exports all stores
```

### Store Definition Example

```typescript
// src/stores/search.ts
import { atom } from 'nanostores';

export const searchStore = atom<string>('');

export function setSearch(query: string) {
  searchStore.set(query);
}

export function clearSearch() {
  searchStore.set('');
}
```

### SSR Compatibility

```typescript
// Client-only code wrapped in $effect
import { $effect } from '@nanostores/react';
import { useStore } from '@nanostores/react';

// In Astro component with client:load
$effect(() => {
  const unsubscribe = searchStore.subscribe(value => {
    // Sync to URL or trigger search
  });
  return unsubscribe;
});
```

## API Contracts

### Business Search API

```
GET /api/businesses/search
```

**Request**:
```typescript
{
  q?: string;        // Search query
  category?: string; // Category slug
  region?: string;   // Region
  sort?: 'popular' | 'recent' | 'name';
  page?: number;     // Default: 1
  limit?: number;    // Default: 12
}
```

**Response**:
```typescript
{
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Business Detail API (existing)

```
GET /api/businesses/[slug]
```

Returns single business with full details (unchanged).

## Technology Stack

- **Language**: TypeScript (strict mode)
- **Query Functions**: Drizzle ORM + D1
- **State Management**: Nanostores (nanostores.org)
- **Testing**: Vitest
- **Framework**: Astro 6 with Server Islands

## Architecture Decisions

### ADR-001: Result Pattern for Queries
**Decision**: Use Result pattern instead of throwing exceptions
**Rationale**: 
- Consistent error handling across all queries
- Makes error handling explicit in calling code
- Easier to test (no try/catch needed)

### ADR-002: Nanostores over Zustand/Jotai
**Decision**: Use Nanostores for state management
**Rationale**:
- Framework-agnostic (works with Astro, React, vanilla)
- Smaller bundle size (~1KB vs 7KB+)
- SSR-safe by design
- Native support for Astro Islands

### ADR-003: Query Functions are NOT Cached
**Decision**: No server-side caching in this increment
**Rationale**: Caching is complex and should be a separate concern
**Future**: Redis/KV caching can be added in separate increment

## Implementation Phases

### Phase 1: Foundation (T-001, T-002)
- Create directory structure
- Add Result type pattern
- Set up test scaffolding

### Phase 2: Query Implementation (T-003, T-004, T-005)
- Implement core query functions
- Add unit tests
- Achieve >80% coverage

### Phase 3: Store Implementation (T-006, T-007, T-008)
- Implement nanostores
- Add SSR-safe initialization
- Add store helper functions

### Phase 4: Integration (T-009, T-010)
- Migrate business detail page
- Migrate business list page
- Add debouncing and URL sync

### Phase 5: Validation (T-011, T-012, T-013)
- Run unit tests
- Integration testing
- Build verification

## Testing Strategy

### Unit Tests (Vitest)
```bash
# Run all unit tests
npx vitest run

# Run with coverage
npx vitest run --coverage
```

### Test Files
- `src/lib/queries/*.test.ts` - Query function tests
- `src/stores/*.test.ts` - Store tests

### Coverage Targets
| Module | Target |
|--------|--------|
| queries/result.ts | 100% |
| queries/business.ts | 90% |
| stores/*.ts | 85% |
| Overall | 80% |

## Technical Challenges

### Challenge 1: SSR Hydration Mismatch
**Problem**: Stores initialized differently on server vs client
**Solution**: 
- Initialize stores with same default values
- Use `$effect` for client-side subscriptions
- Validate hydration with `isMounted` check

### Challenge 2: Debouncing Search Input
**Problem**: Too many API calls during typing
**Solution**:
- Use `useDebouncedCallback` from `use-debounce`
- 300ms delay before triggering search
- Cancel pending requests on new input

### Challenge 3: URL State Sync
**Problem**: Filters lost on page refresh
**Solution**:
- Sync filter state to URL params
- Read URL params on initial load
- Use `history.replaceState` to avoid polluting browser history

## Migration Checklist

- [ ] T-001: Query Layer Directory
- [ ] T-002: Stores Directory
- [ ] T-003: getBusinessBySlug Query
- [ ] T-004: searchBusinesses Query
- [ ] T-005: getReviewsByBusinessId Query
- [ ] T-006: searchStore
- [ ] T-007: filterStore
- [ ] T-008: paginationStore
- [ ] T-009: Migrate business/[slug].astro
- [ ] T-010: Migrate businesses/index.astro
