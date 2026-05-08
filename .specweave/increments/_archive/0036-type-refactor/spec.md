---
increment: 0036-type-refactor
title: 'Type Refactor: Replace any with Proper Types'
type: refactor
priority: P1
status: completed
created: 2026-05-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Type Refactor: Replace any with Proper Types

## Overview

Replace 84 `any` usages with proper types per knowledge base TypeScript rules. Affects 21 files across admin pages, business pages, and components.

## User Stories

### US-001: Admin Pages Type Safety (P1)
**Project**: timorlist

**As a** developer
**I want** admin pages use proper types
**So that** TypeScript strict mode catches errors at compile time

**Acceptance Criteria**:
- [x] **AC-US1-01**: categories.astro — replace any[] arrays with proper Category[] type
- [x] **AC-US1-02**: skus.astro — replace any with proper SKU type
- [x] **AC-US1-03**: businesses.astro — replace any with proper Business type
- [x] **AC-US1-04**: users.astro — replace any with proper User type
- [x] **AC-US1-05**: reviews.astro — replace any with proper Review type
- [x] **AC-US1-06**: subscriptions.astro — replace any with proper Subscription type
- [x] **AC-US1-07**: blogs.astro — replace any with proper Blog type
- [x] **AC-US1-08**: plans.astro — replace any with proper Plan type
- [x] **AC-US1-09**: heroes.astro — replace any with proper Hero type
- [x] **AC-US1-10**: media.astro — replace any with proper Media type
- [x] **AC-US1-11**: ai-tools.astro — replace any with proper AgentConfig type

### US-002: Business Pages Type Safety (P1)
**Project**: timorlist

**As a** developer
**I want** business pages use proper types
**So that** TypeScript strict mode catches errors at compile time

**Acceptance Criteria**:
- [x] **AC-US2-01**: business/[slug]/edit/index.astro — replace all any with proper types
- [x] **AC-US2-02**: business/[slug]/products.astro — replace any with proper Product type
- [x] **AC-US2-03**: business/[slug]/product/new/index.astro — replace any with proper ProductInput
- [x] **AC-US2-04**: business/[slug]/product/[id]/edit/index.astro — replace any with proper Product type

### US-003: Components Type Safety (P1)
**Project**: timorlist

**As a** developer
**I want** reusable components use proper types
**So that** TypeScript strict mode catches errors at compile time

**Acceptance Criteria**:
- [x] **AC-US3-01**: CategoryFilter.astro — replace any with proper Category type
- [x] **AC-US3-02**: MediaGallery.astro — replace any with proper MediaItem type
- [x] **AC-US3-03**: AdminLayout.astro — replace (window as any) with Window interface

### US-004: Build Verification (P1)
**Project**: timorlist

**As a** developer
**I want** build passes with strict TypeScript
**So that** all types are verified at compile time

**Acceptance Criteria**:
- [x] **AC-US4-01**: pnpm build succeeds with no TypeScript errors
- [x] **AC-US4-02**: no : any or as any remaining outside test files (1 tiptap exception)

## Type Patterns

### Array Types
```typescript
// Before
let categories: any[] = [];

// After
let categories: typeof categories.$inferSelect[] = [];
// or
type Category = typeof categories.$inferSelect;
let categories: Category[] = [];
```

### Window Interface
```typescript
// Before
(window as any).authFetch = authFetch;

// After — declare in global.d.ts
declare global {
  interface Window {
    authFetch: typeof authFetch;
  }
}
```

### Callback Parameters
```typescript
// Before
categories.filter((c: any) => !c.parentId)

// After
categories.filter((c: Category) => !c.parentId)
```

## Out of Scope

- Test files (auth/index.test.ts) — acceptable mocking patterns
- Third-party library type declarations

## Dependencies

- TypeScript 6.0.3 (already installed)
- tsconfig strict mode (enabled)
