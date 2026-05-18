# Tasks: 0066 TypeScript Type Errors Fix

## Phase 1: Core Type Fixes

### T-001: Create type utilities helper
**Status**: [ ] pending | **AC**: AC-US1-01
**Test Plan**: No unit test needed - utility function

### T-002: Fix TS18047 (possibly null) - 223 errors
**Status**: [ ] pending | **AC**: AC-US1-02
**Files**: src/lib/*.ts, src/pages/**/*.ts, src/components/**/*.ts

### T-003: Fix TS2339 (no export) - 126 errors
**Status**: [ ] pending | **AC**: AC-US1-03
**Pattern**: Module './X' has no exported member 'Y'

### T-004: Fix TS2322/TS2769 (not assignable) - 83 errors
**Status**: [ ] pending | **AC**: AC-US1-04
**Pattern**: Type 'string | undefined' not assignable to 'string'

### T-005: Fix TS2345 (type mismatch) - 32 errors
**Status**: [ ] pending | **AC**: AC-US1-04

## Phase 2: Verification

### T-006: Verify tsc --noEmit passes
**Status**: [ ] pending | **AC**: AC-US1-01

### T-007: Verify pnpm build passes
**Status**: [ ] pending | **AC**: AC-US1-05

### T-008: Verify tests pass
**Status**: [ ] pending | **AC**: AC-US1-05
**Tests**: npx vitest run, npx playwright test

## Completion

When T-001 through T-008 all marked complete, run `sw:done 0066`