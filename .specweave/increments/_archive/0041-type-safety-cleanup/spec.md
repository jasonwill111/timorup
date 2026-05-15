---
increment: 0041-type-safety-cleanup
title: TypeScript Type Safety & Console Cleanup
type: improvement
priority: P1
status: completed
created: 2026-05-10T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: TypeScript Type Safety & Console Cleanup

## Overview

Replace `any` types with proper TypeScript types and remove development console.log statements from production code paths. This improves type safety and reduces noise in production logs.

## User Stories

### US-001: Replace Category Data `any[]` with Typed Interfaces
**Project**: timorlist

**As a** developer
**I want** the admin categories page to use properly typed interfaces
**So that** I can catch type errors at compile time and have better IDE support

**Acceptance Criteria**:
- [x] **AC-US1-01**: `categories` and `parentCategories` variables use `Category[]` type instead of `any[]`
- [x] **AC-US1-02**: All callback parameter types `(c: any) => ...` replaced with `(c: Category) => ...`
- [x] **AC-US1-03**: `categoryData` object uses a typed interface instead of `any`

---

### US-002: Replace AI Generator Response `any` with Typed Interfaces
**Project**: timorlist

**As a** developer
**I want** the AI tools page to use properly typed interfaces for generated content
**So that** I can safely access nested AI response properties with type checking

**Acceptance Criteria**:
- [x] **AC-US2-01**: `generatedListing`, `generatedSku`, `generatedBlog`, `generatedLanding` use typed interfaces
- [x] **AC-US2-02**: Error catch blocks use `Error` type instead of `err: any`
- [x] **AC-US2-03**: Price field maps use typed interfaces `(p: PriceField) => ...`

---

### US-003: Replace Admin Dashboard Chart Data `any`
**Project**: timorlist

**As a** developer
**I want** the admin dashboard chart rendering to use typed interfaces
**So that** chart data transformations are type-safe

**Acceptance Criteria**:
- [x] **AC-US3-01**: Chart data arrays use typed interfaces `(m: MonthlyData) => ...` instead of `(m: any) => ...`
- [x] **AC-US3-02**: Subscription map uses `Subscription` type instead of `sub: any`

---

### US-004: Replace Slug Check Dynamic Table References
**Project**: timorlist

**As a** developer
**I want** the slug-check API to use proper Drizzle table types
**So that** database operations are type-safe

**Acceptance Criteria**:
- [x] **AC-US4-01**: `table` variable uses `typeof businessPages | typeof blogPosts | typeof landingPages` type
- [x] **AC-US4-02**: `slugField` variable uses proper field reference types

---

### US-005: Remove Debug Console Logs from Auth Module
**Project**: timorlist

**As a** developer
**I want** the auth module to not log debug information in production
**So that** logs remain clean and actionable

**Acceptance Criteria**:
- [x] **AC-US5-01**: `lib/auth.ts` has no `console.log` statements (debug logs removed)
- [x] **AC-US5-02**: Auth functionality unchanged - logs were only for debugging initAuth

---

### US-006: Remove Debug Console Logs from DB Module
**Project**: timorlist

**As a** developer
**I want** the database module to not log debug information in production
**So that** DB connection logs do not clutter production output

**Acceptance Criteria**:
- [x] **AC-US6-01**: `lib/db.ts` has no `console.log` statements
- [x] **AC-US6-02**: getDb() functionality unchanged

---

### US-007: Remove Debug Console Logs from Scheduled Jobs
**Project**: timorlist

**As a** system administrator
**I want** scheduled cleanup jobs to log only meaningful events
**So that** I can quickly identify issues in logs

**Acceptance Criteria**:
- [x] **AC-US7-01**: `pages/api/scheduled/_cleanup.ts` removes routine progress logs, keeps error/warning logs
- [x] **AC-US7-02**: `pages/api/scheduled/_mark-expired.ts` removes routine progress logs, keeps error/warning logs
- [x] **AC-US7-03**: `pages/api/scheduled/_cleanup-orphan-media.ts` removes routine progress logs, keeps error/warning logs
- [x] **AC-US7-04**: `pages/api/scheduled/_cleanup-expired.ts` removes routine progress logs, keeps error/warning logs

---

### US-008: Remove Debug Console Logs from Auth APIs
**Project**: timorlist

**As a** developer
**I want** the sign-in API to not log user-specific debug data
**So that** sensitive information is not leaked to logs

**Acceptance Criteria**:
- [x] **AC-US8-01**: `pages/api/auth/sign-in.ts` removes `console.log` statements that log user data
- [x] **AC-US8-02**: Keep error logging for failed operations

---

### US-009: Remove Debug Console Logs from Other Pages
**Project**: timorlist

**As a** developer
**I want** various pages to not log debug information
**So that** production logs remain clean

**Acceptance Criteria**:
- [x] **AC-US9-01**: `pages/subscribe.astro` removes debug auth check log
- [x] **AC-US9-02**: `pages/business/[slug]/edit/index.astro` removes "Unsupported file type" log (or convert to proper error handling)

---

### US-010: Add TypeScript Interfaces for Shared Types
**Project**: timorlist

**As a** developer
**I want** shared TypeScript interfaces to be available in a types file
**So that** I can reuse types across multiple files

**Acceptance Criteria**:
- [x] **AC-US10-01**: `src/types/index.ts` or inline interfaces provide: `GeneratedListing`, `GeneratedSku`, `GeneratedBlog`, `GeneratedLanding`, `MonthlyData`
- [x] **AC-US10-02**: These interfaces are imported where needed

## Functional Requirements

### FR-001: Type Safety
- All `any` types in `.astro` and `.ts` files replaced with proper typed interfaces
- Schema types from `src/db/schema/index.ts` used where applicable (Category, etc.)
- New interfaces created for AI-generated content types

### FR-002: Console Log Policy
- Development-only logs removed from production code paths
- Error/warning logs retained for actual error conditions
- Scheduled jobs log only: start time, errors, summary statistics

### FR-003: Preserve Functionality
- All existing functionality must continue to work after changes
- Type changes should not require behavioral changes
- Logs removed should not affect user experience

## Success Criteria

| Metric | Target |
|--------|--------|
| `any` types remaining in affected files | 0 |
| `console.log` statements in lib/*.ts | 0 |
| `console.log` statements in api/scheduled/*.ts | < 5 |
| Build passes | Yes |
| Tests pass | Yes |

## Out of Scope

- Refactoring business logic
- Changing API endpoints
- Modifying UI components
- Test file `as any` casts (necessary for mocking)
- Third-party library type declarations

## Dependencies

- `src/db/schema/index.ts` - existing schema types
- No new dependencies required

## Technical Notes

### Affected Files
```
Type Safety:
- src/pages/admin/categories.astro
- src/pages/admin/ai-tools.astro
- src/pages/admin/index.astro
- src/pages/api/admin/slug-check.ts
- src/pages/business/[slug]/edit/index.astro

Console Cleanup:
- src/lib/auth.ts
- src/lib/db.ts
- src/pages/api/scheduled/*.ts
- src/pages/api/auth/sign-in.ts
- src/pages/subscribe.astro
```
