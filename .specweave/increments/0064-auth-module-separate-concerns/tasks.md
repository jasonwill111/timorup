# Tasks: Auth Module Separate Concerns

## Task Notation

- `[T###]`: Task ID
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Auth Factory Pattern

### T-001: Refactor auth.ts with factory pattern

**Description**: Refactor `src/lib/auth.ts` to use explicit factory pattern.

**References**: AC-US1-01, AC-US1-02, AC-US2-01

**Implementation Details**:
1. Export `createAuthFactory()` returning `{ createAuth(config): BetterAuthInstance }`
2. Export `createDrizzleAuthAdapter(db)` for reusability
3. Export `getAuthInstance(env?)` for singleton access
4. Remove global `auth` stub constant
5. Type-safe Proxy wrapper

**Status**: [x] Completed

---

### T-002: Verify backward compatibility

**Description**: Ensure all existing imports still work.

**Implementation Details**:
1. Grep for initAuth/getAuth usage across codebase
2. All 32 files using auth still compile
3. No breaking changes to API

**Status**: [x] Completed

---

### T-003: Run tests

**Description**: Verify all tests pass.

**Implementation Details**:
1. Run `npx vitest run`
2. All 300 tests pass

**Status**: [x] Completed

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 1 | T-001 to T-003 | All completed |

**Total**: 3 tasks - 3 completed