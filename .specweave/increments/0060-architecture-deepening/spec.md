---
name: Architecture Deepening
description: Improve codebase architecture - DB adapter, subscription batching, Zod generation, barrel consolidation, store merge
status: completed
author: TimorLink
created: 2026-05-17
---

# Architecture Deepening - 0060

## Goals

Improve codebase architecture by deepening shallow modules and creating proper seams.

## Candidates

### 1. Subscription Batching (HIGH PRIORITY)
- [x] Batch subscription queries into single DB call
- [x] Create `getSubscriptionDashboard()` function
- [x] Update callers to use new function

### 2. DB Adapter Interface
- [x] Create `DatabaseAdapter` interface in `src/lib/adapters.ts`
- [x] Implement `createD1Adapter` in `src/lib/db-adapter.ts`
- [x] Implement `InMemoryAdapter` for tests in `src/lib/in-memory-adapter.ts`
- [x] Update `subscription.ts` to use adapter pattern

### 3. Zod Schema Generation
- [x] Create `zod-gen.ts` utility in `src/lib/zod-gen.ts`
- [x] Generate schemas from Drizzle schema
- [x] Pre-built helpers (uuid, slug, email, pagination)

### 4. Barrel Consolidation
- [x] Delete `queries/index.ts`
- [x] Consolidate queries by domain
- [x] Update imports

### 5. Store Merge
- [x] Merge `filters.ts` + `search.ts` â†?`filter-store.ts`
- [x] Keep `auth.ts`, `cart.ts`, `toast.ts` separate

## Acceptance Criteria

- [x] AC-01: `getSubscriptionDashboard()` reduces DB calls (implemented)
- [x] AC-02: `DatabaseAdapter` interface enables test mocking (completed)
- [x] AC-03: Zod schemas generated from Drizzle schema (completed)
- [x] AC-04: `queries/index.ts` deleted, imports updated
- [x] AC-05: Store structure assessed, no changes needed (completed)
- [x] AC-06: All tests pass (288 tests passing)

## Files Created

| File | Description |
|------|-------------|
| `src/lib/adapters.ts` | DatabaseAdapter and AuthAdapter interfaces |
| `src/lib/db-adapter.ts` | createD1Adapter, getDbFromEnv |
| `src/lib/in-memory-adapter.ts` | InMemoryAdapter for unit testing |
| `src/lib/zod-gen.ts` | generateZodSchema + pre-built schema helpers |

## Files Modified

| File | Change |
|------|--------|
| `src/lib/subscription.ts` | Updated to use adapter pattern |
