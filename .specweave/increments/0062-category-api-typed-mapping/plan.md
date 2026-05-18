# Implementation Plan: Category API Typed Mapping

## Overview

Refactor the stringly-typed `TABLE_MAP` in admin categories API to use TypeScript's type system for compile-time safety. The current implementation uses `Record<string, any>` which allows any string key and loses type information.

## Architecture

### Components

1. **`src/lib/category-registry.ts`** (NEW)
   - Typed table registry with discriminated union
   - Validation functions for entity types
   - Single source of truth for table mappings

2. **`src/pages/api/admin/categories/index.ts`** (MODIFY)
   - Replace stringly-typed `TABLE_MAP` with typed registry
   - Add Zod validation for incoming `table` parameter

### Data Model

```typescript
// Discriminated union for entity types
export type EntityType = 'business' | 'non_profit' | 'public_sector' | 'listing';

export interface CategoryTableConfig {
  schema: typeof businessCategories
    | typeof nonProfitCategories
    | typeof publicSectorCategories
    | typeof listingCategories;
  tableName: string;
}

// Typed map - only valid keys allowed
export const CATEGORY_TABLE_MAP: Record<EntityType, CategoryTableConfig>;
```

### API Contracts

**GET/POST/PUT/DELETE `/api/admin/categories`**

| Parameter | Type | Validation |
|-----------|------|------------|
| `table` | query/body | `EntityType` enum |

**Error Response for Invalid Table**:
```json
{
  "success": false,
  "error": {
    "message": "Invalid table. Valid values: business, non_profit, public_sector, listing"
  }
}
```

## Technology Stack

- **Language**: TypeScript (strict mode)
- **Validation**: Zod v4
- **Database**: Drizzle ORM with D1

## Implementation Phases

### Phase 1: Create Typed Registry
- Create `src/lib/category-registry.ts`
- Define `EntityType` union
- Define `CategoryTableConfig` interface
- Create `CATEGORY_TABLE_MAP` with proper typing
- Add validation helpers (`isValidEntityType`, `getCategoryTable`)

### Phase 2: Update API
- Import from category-registry
- Replace `TABLE_MAP` with `CATEGORY_TABLE_MAP`
- Add Zod schema for `table` parameter validation
- Update error messages to list valid values

### Phase 3: Testing
- TypeScript compilation check
- Unit tests for validation functions
- Integration tests for API endpoints

## Testing Strategy

1. **Unit Tests** (`src/lib/category-registry.test.ts`):
   - `isValidEntityType()` returns true for valid types
   - `isValidEntityType()` returns false for invalid types
   - `getCategoryTable()` returns correct config
   - `getCategoryTable()` throws for invalid type

2. **API Tests**:
   - `GET /api/admin/categories?table=business` returns 200
   - `GET /api/admin/categories?table=invalid` returns 400 with clear error

## Technical Challenges

### Challenge 1: Drizzle Schema Union Type
**Problem**: TypeScript cannot create a union of different Drizzle table types directly.
**Solution**: Use `typeof` operator to preserve Drizzle table types in the union. TypeScript will properly narrow the type when using discriminated unions.

### Challenge 2: Backward Compatibility
**Problem**: Existing API consumers may use different naming conventions.
**Solution**: The `isValidEntityType` function provides a clear migration path. API error messages now list all valid values explicitly.

## ADR (Architecture Decision Record)

**ADR-0062-001**: Use discriminated union for category table registry

**Context**: The TABLE_MAP uses `Record<string, any>` which provides no type safety.

**Decision**: Create a typed registry with:
- `EntityType` as a string literal union type
- `CategoryTableConfig` as a discriminated union interface
- `Record<EntityType, CategoryTableConfig>` for the map

**Consequences**:
- Pro: Compile-time type checking prevents invalid entity types
- Pro: IDE autocomplete for valid entity types
- Con: Must update all callers to use the new types
- Con: Zod schemas must also be updated to match