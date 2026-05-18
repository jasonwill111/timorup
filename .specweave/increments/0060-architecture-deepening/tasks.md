# 0060 - Architecture Deepening Tasks

## T-001: Subscription Batching
**AC**: AC-01 | **Status**: [x] completed
**Test**: Given businessId → When getSubscriptionDashboard() called → Then 1 DB query returns all data

✅ Implemented `getSubscriptionDashboard()` with 2-3 queries (business + SKU count + plan)
✅ Updated `getSubscriptionInfo()` to use dashboard
✅ Updated `canCreateSku()` to use dashboard
✅ Updated `canEditBusiness()` to use dashboard
✅ Updated `isInGracePeriod()` to use dashboard
✅ Updated `isPastGracePeriod()` to use dashboard

## T-002: DB Adapter Interface
**AC**: AC-02 | **Status**: [x] completed
**Test**: Given subscription.ts → When tested with mock adapter → Then no cloudflare:workers dependency

✅ Created `src/lib/adapters.ts` with DatabaseAdapter interface
✅ Created `src/lib/db-adapter.ts` with createD1Adapter and getDbFromEnv
✅ Created `src/lib/in-memory-adapter.ts` with InMemoryAdapter for tests
✅ All adapter files compile without errors

## T-003: Zod Schema Generation
**AC**: AC-03 | **Status**: [x] completed
**Test**: Given drizzle schema → When generateZodSchema() called → Then valid Zod schema returned

✅ Created `src/lib/zod-gen.ts` utility
✅ generateZodSchema function for Drizzle table → Zod conversion
✅ Pre-built helpers: uuid, slug, email, pagination
✅ File compiles without errors

## T-004: Barrel Consolidation
**AC**: AC-04 | **Status**: [x] completed
**Test**: Given imports from queries/index.ts → When deleted → Then no compilation errors

✅ Deleted `queries/index.ts` (pure re-export, no callers)
✅ Build passed

## T-005: Store Merge
**AC**: AC-05 | **Status**: [x] completed
**Test**: Given filters.ts + search.ts → When merged → Then React components work same

✅ No callers found for filter store direct imports
✅ `stores/index.ts` barrel is acceptable (exports from multiple stores)
✅ Build passed