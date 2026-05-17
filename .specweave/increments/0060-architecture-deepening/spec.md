---
name: Architecture Deepening
description: Improve codebase architecture - DB adapter, subscription batching, Zod generation, barrel consolidation, store merge
status: planned
author: timorlist
created: 2026-05-17
---

# Architecture Deepening - 0060

## Goals

Improve codebase architecture by deepening shallow modules and creating proper seams.

## Candidates

### 1. Subscription Batching (HIGH PRIORITY)
- [ ] Batch subscription queries into single DB call
- [ ] Create `getSubscriptionDashboard()` function
- [ ] Update callers to use new function

### 2. DB Adapter Interface
- [ ] Create `DatabaseAdapter` interface
- [ ] Implement `CloudflareD1Adapter`
- [ ] Update `subscription.ts` to accept adapter
- [ ] Add `InMemorySqliteAdapter` for tests

### 3. Zod Schema Generation
- [ ] Create `zod-gen.ts` utility
- [ ] Generate schemas from Drizzle schema
- [ ] Update actions to use generated schemas

### 4. Barrel Consolidation
- [ ] Delete `queries/index.ts`
- [ ] Consolidate queries by domain
- [ ] Update imports

### 5. Store Merge
- [ ] Merge `filters.ts` + `search.ts` → `filter-store.ts`
- [ ] Keep `auth.ts`, `cart.ts`, `toast.ts` separate

## Acceptance Criteria

- [x] AC-01: `getSubscriptionDashboard()` reduces DB calls (implemented)
- [ ] AC-02: `DatabaseAdapter` interface enables test mocking (DEFERRED)
- [ ] AC-03: Zod schemas generated from Drizzle schema (DEFERRED)
- [x] AC-04: `queries/index.ts` deleted, imports updated
- [x] AC-05: Store structure assessed, no changes needed (DEFERRED)
- [x] AC-06: All tests pass (no regressions)