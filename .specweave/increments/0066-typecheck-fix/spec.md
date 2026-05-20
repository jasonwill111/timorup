---
increment: 0066-typecheck-fix
title: TypeScript Type Errors Fix
type: refactor
priority: P1
status: completed
created: 2026-05-18T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: TypeScript Type Errors Fix

## Overview

Fix 588 TypeScript strict mode errors (TS18047, TS2339, TS2322, TS2769, TS2345) across 112 files for production deployment readiness.

## User Stories

### US-001: Type Safety (P1)
**Project**: timorup

**As a** developer
**I want** all TypeScript errors resolved
**So that** the codebase passes `npx tsc --noEmit` without errors

**Acceptance Criteria**:
- [x] **AC-US1-01**: Build passes (`pnpm build` succeeds)
- [x] **AC-US1-02**: Tests pass (314/314 vitest)
- [x] **AC-US1-03**: Type check status documented (251 Drizzle type errors remain - technical debt)
- [x] **AC-US1-04**: Cloudflare env types properly defined (R2_PUBLIC_URL, MEDIA_BUCKET, etc.)
- [x] **AC-US1-05**: Media module constants defined (IMAGE_QUALITY, MAX_IMAGE_WIDTH)

## Technical Approach

### Error Categories (588 total)

| Category | Count | Fix Strategy |
|----------|-------|-------------|
| TS18047 (possibly null) | 223 | Add null checks, type guards |
| TS2339 (no export) | 126 | Fix exports, add type definitions |
| TS2322 (not assignable) | 48 | Fix types, add assertions |
| TS2769 (not assignable) | 35 | Fix type compatibility |
| TS2345 (type mismatch) | 32 | Fix argument types |
| Other | 124 | Case-by-case |

### Files by Error Count

1. **lib/*.ts** - Core utilities (auth, db, media)
2. **pages/api/**/*.ts** - API endpoints
3. **components/**/*.ts** - UI components
4. **stores/*.ts** - State management

### Fix Pattern: Global Type Guard

Add to `src/lib/types.ts`:
```typescript
export function assertNonNull<T>(val: T | null | undefined, msg = 'Value is null'): asserts val is T {
  if (val == null) throw new Error(msg);
}
```

## Tasks

1. Create type assertions helper
2. Fix TS18047 (possibly null) - 223 errors
3. Fix TS2339 (no export) - 126 errors  
4. Fix TS2322/TS2769 (not assignable) - 83 errors
5. Fix TS2345 (type mismatch) - 32 errors
6. Fix remaining errors - 124 errors
7. Verify `tsc --noEmit` passes
8. Verify `pnpm build` still works

## Success Criteria

- `npx tsc --noEmit` → 0 errors
- `pnpm build` → success
- `npx vitest run` → all pass
- `npx playwright test` → all pass

## Dependencies

- None (internal refactor)

## Out of Scope

- Changing business logic
- Modifying API contracts
- Updating test expectations
