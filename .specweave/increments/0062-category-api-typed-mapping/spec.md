---
increment: 0062-category-api-typed-mapping
title: "Category API Typed Mapping"
type: refactor
priority: P1
status: planned
created: 2026-05-18
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Category API Typed Mapping

## Overview

Fix stringly-typed TABLE_MAP in admin categories API with inconsistent entity type naming. The TABLE_MAP uses `non_profit` (with underscore) while other parts of the codebase use `nonprofit` (no underscore). This inconsistency causes potential bugs and reduces type safety.

## User Stories

### US-001: Type-Safe Category Table Registry
**Project**: TimorLink

**As a** developer
**I want** a typed table registry with consistent entity type naming
**So that** I can safely switch between category tables without runtime errors

**Acceptance Criteria**:
- [x] **AC-US1-01**: Define `EntityType` union type: `'business' | 'non_profit' | 'public_sector' | 'listing'`
- [x] **AC-US1-02**: Create `CategoryTableRegistry` interface with typed `TABLE_MAP`
- [x] **AC-US1-03**: Update admin categories API to use typed registry
- [x] **AC-US1-04**: TypeScript compiles with 0 errors after refactor

---

### US-002: Consistent Entity Type Validation
**Project**: TimorLink

**As a** API consumer
**I want** clear error messages when passing invalid table names
**So that** I can debug integration issues quickly

**Acceptance Criteria**:
- [x] **AC-US2-01**: API returns `{ success: false, error: { message: 'Invalid table. Valid values: business, non_profit, public_sector, listing' } }` for invalid table
- [x] **AC-US2-02**: `isValidEntityType` function validates `table` parameter against allowed values (replaced Zod with function-based validation)

## Functional Requirements

### FR-001: Typed Table Registry
Create `src/lib/category-registry.ts`:
```typescript
export type EntityType = 'business' | 'non_profit' | 'public_sector' | 'listing';

export interface CategoryTableConfig {
  schema: typeof businessCategories | typeof nonProfitCategories | typeof publicSectorCategories | typeof listingCategories;
  tableName: string;
}

export const CATEGORY_TABLE_MAP: Record<EntityType, CategoryTableConfig>

export function getCategoryTable(type: EntityType): CategoryTableConfig
export function isValidEntityType(type: string): type is EntityType
```

### FR-002: Update API Endpoints
Update `src/pages/api/admin/categories/index.ts`:
- Import from `src/lib/category-registry.ts`
- Replace stringly-typed `TABLE_MAP` with typed `CATEGORY_TABLE_MAP`
- Add Zod validation for `table` query parameter

## Success Criteria

1. TypeScript compiles with zero errors
2. API endpoints accept valid entity types: `business`, `non_profit`, `public_sector`, `listing`
3. API rejects invalid entity types with clear error message
4. Unit tests verify type narrowing functions

## Out of Scope

- Changing existing data in database
- Modifying client-side code that consumes these APIs
- Creating new database migrations

## Dependencies

- None (self-contained refactor)
