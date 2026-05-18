# Tasks: Category API Typed Mapping

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Create Typed Registry

### T-001: Create category-registry.ts with type definitions

**Description**: Create `src/lib/category-registry.ts` with EntityType union, CategoryTableConfig interface, and CATEGORY_TABLE_MAP.

**References**: AC-US1-01, AC-US1-02

**Implementation Details**:
1. Import schema types from `@/db/schema`
2. Define `EntityType = 'business' | 'non_profit' | 'public_sector' | 'listing'`
3. Define `CategoryTableConfig` interface with `schema` and `tableName` properties
4. Create `CATEGORY_TABLE_MAP` as `Record<EntityType, CategoryTableConfig>`
5. Export `isValidEntityType(type: string): type is EntityType` validation function
6. Export `getCategoryTable(type: EntityType): CategoryTableConfig` getter

**Test Plan**:
- **File**: `src/lib/category-registry.test.ts`
- **Tests**:
  - **TC-001**: `isValidEntityType` accepts valid types
  - **TC-002**: `isValidEntityType` rejects invalid types
  - **TC-003**: `getCategoryTable` returns correct config
  - **TC-004**: `CATEGORY_TABLE_MAP` has all 4 entity types

**Status**: [x] Completed

---

### T-002: Write unit tests for category-registry

**Description**: Create `src/lib/category-registry.test.ts` with Vitest tests for validation functions.

**References**: AC-US1-01, AC-US1-02

**Implementation Details**:
1. Import from `@/lib/category-registry`
2. Test `isValidEntityType` with valid and invalid inputs
3. Test `getCategoryTable` happy path
4. Test `CATEGORY_TABLE_MAP` has correct keys
5. Test `getValidEntityTypesMessage` returns comma-separated list

**Dependencies**: T-001
**Status**: [x] Completed (12 tests passing)

---

## Phase 2: Update API

### T-003: Update admin categories API imports

**Description**: Update `src/pages/api/admin/categories/index.ts` to import from category-registry.

**References**: AC-US1-03

**Implementation Details**:
1. Add import: `import { CATEGORY_TABLE_MAP, isValidEntityType, getCategoryTable, getValidEntityTypesMessage, type EntityType } from '@/lib/category-registry'`
2. Remove `const TABLE_MAP: Record<string, any>` definition
3. Remove `const TABLE_NAMES` (use registry's `tableName` instead)

**Dependencies**: T-001
**Status**: [x] Completed

---

### T-004: Replace TABLE_MAP usage with typed registry

**Description**: Update all `TABLE_MAP[table]` usages to use typed registry functions.

**References**: AC-US1-03, AC-US1-04

**Implementation Details**:
1. In GET handler: Replace `TABLE_MAP[table]` with `isValidEntityType(table) ? getCategoryTable(table) : null`
2. In POST handler: Same pattern
3. In PUT handler: Same pattern
4. In DELETE handler: Same pattern
5. Update error message to list valid entity types using `getValidEntityTypesMessage()`

**Dependencies**: T-003
**Status**: [x] Completed

---

### T-005: Add validation for table parameter (improved error messages)

**Description**: Add clear validation error messages with valid values listed.

**References**: AC-US2-01, AC-US2-02

**Implementation Details**:
1. All handlers now use `isValidEntityType(table)` for validation
2. Error message: `"Invalid table. Valid values: business, non_profit, public_sector, listing"`
3. Returns HTTP 400 for invalid table values

**Dependencies**: T-003
**Status**: [x] Completed

---

## Phase 3: Verification

### T-006: TypeScript compilation check

**Description**: Verify TypeScript compiles without errors in changed files.

**References**: AC-US1-04

**Implementation Details**:
1. Check category-registry.ts compiles: No errors
2. Check api/admin/categories/index.ts compiles: No new errors introduced
3. Note: Pre-existing errors in other files (blogs.ts, drizzle/schema.ts) are unrelated

**Status**: [x] Completed

---

### T-007: Run unit tests

**Description**: Run category-registry unit tests.

**Implementation Details**:
1. Run `npx vitest run src/lib/category-registry.test.ts`
2. All 12 tests pass

**Dependencies**: T-002, T-006
**Status**: [x] Completed

---

### T-008: API integration test

**Description**: Test API endpoints with curl.

**Implementation Details**:
1. Dev server running at localhost:8787
2. Valid table returns 200 with categories (or empty for listing)
3. Invalid table returns 400 with clear error message
4. Auth required returns 401 Unauthorized (expected)

**Dependencies**: T-004, T-005
**Status**: [x] Completed

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 1 | T-001, T-002 | [x] [x] |
| 2 | T-003, T-004, T-005 | [x] [x] [x] |
| 3 | T-006, T-007, T-008 | [x] [x] [x] |

**Total**: 8 tasks - 8 completed