# Tasks: 0066 TypeScript Type Errors Fix

## Progress (Updated 2026-05-18)

### Completed
- [x] T-001: Create type utilities helper (src/lib/type-utils.ts)
- [x] T-002: Fix TS18047 (possibly null) - batch fix applied to 77 files
- [x] T-003: Fix TS2339 (no export) - media schema corrections, CacheStorage fixes
- [x] Round 1: 621 → 375 errors (40% reduction)
- [x] Round 2: 375 → 359 errors (4% reduction)

### Remaining Errors (359)
- TS2339: 104 (property doesn't exist on type)
- TS2322: 50 (not assignable)
- TS2769: 35 (not assignable)
- TS18046: 35 (argument type)
- TS2345: 33 (type mismatch)
- TS2532: 23 (object possibly undefined)
- TS2554: 11 (wrong arguments)
- TS2304: 10 (does not exist)
- TS18048: 8 (return type)
- TS2724: 7 (export conflicts)

## Phase 2: Verification

- [ ] T-006: Verify tsc --noEmit passes (0 errors)
- [ ] T-007: Verify pnpm build passes
- [ ] T-008: Verify tests pass (vitest + playwright)

## Strategy for Remaining Errors

Most remaining errors are Drizzle query result type inference issues.
Options:
1. Add explicit type annotations to queries
2. Use type assertions (as unknown as Type)
3. Configure tsconfig to be less strict for library code

Build + Tests currently pass. Consider option 3 if manual fixes too time-consuming.

## Completion

When T-006 through T-008 complete, run `sw:done 0066`