---
status: completed
---
# Feature: Refactor Product Config Module

## Overview

Extract typed `ProductType` literal union from `src/lib/constants.ts`, create `productConfig` API with validation methods, maintain backward compatibility while improving type safety.

## User Stories

### US-001: Type-Safe Product Configuration (P1)
**Project**: timorup

**As a** developer
**I want** to use typed `ProductType` literal union
**So that** I get autocomplete, compile-time safety, and catch invalid types early

**Acceptance Criteria**:
- [x] **AC-US1-01**: `ProductType` literal union defined with all 10 product types
- [x] **AC-US1-02**: `productConfig.isValid()` returns correct boolean for valid/invalid types
- [x] **AC-US1-03**: `PriceUnit` and `SpecificationField` types defined

---

### US-002: Unified Config API (P1)
**Project**: timorup

**As a** developer
**I want** a single `productConfig` object with all configuration access
**So that** I don't need to import scattered functions and data

**Acceptance Criteria**:
- [x] **AC-US2-01**: `productConfig.getPriceUnits(type)` returns filtered price units
- [x] **AC-US2-02**: `productConfig.getSpecificationFields(type)` returns spec fields for type
- [x] **AC-US2-03**: `productConfig.allTypes()` returns all valid ProductType values
- [x] **AC-US2-04**: Invalid types return empty arrays (graceful fallback)

---

### US-003: Caller Migration (P1)
**Project**: timorup

**As a** developer
**I want** existing code to work without changes
**So that** migration is smooth and low-risk

**Acceptance Criteria**:
- [x] **AC-US3-01**: `getPriceUnitsForServiceType()` deprecated but still functional
- [x] **AC-US3-02**: `PRICE_UNITS` and `SKU_SERVICE_TYPES` still exported from constants.ts
- [x] **AC-US3-03**: `products.astro` uses new `productConfig` API
- [x] **AC-US3-04**: TypeScript compilation passes with no errors

---

## Functional Requirements

### FR-001: New Module Structure
- Create `src/lib/product-config.ts` with:
  - `ProductType` literal union type
  - `PriceUnit` interface
  - `SpecificationField` interface
  - `PRICE_UNIT_MAP` as private lookup table
  - `productConfig` singleton object with API methods
  - Re-export `PRICE_UNITS`, `SKU_SERVICE_TYPES` for backward compat

### FR-002: Validation Layer
- `isValid(type: string)` - type guard returning `type is ProductType`
- Invalid inputs return empty arrays (not errors)

### FR-003: Data Integrity
- `PRICE_UNIT_MAP` is single source of truth for unit/type mapping
- No duplicated lookup logic

## Success Criteria

| Metric | Target |
|--------|--------|
| Type coverage | 100% of product type operations use `ProductType` |
| Backward compat | Zero breaking changes |
| Test coverage | Unit tests for `productConfig` API |

## Out of Scope

- Migrating `INDUSTRIES` constant (separate concern)
- Database schema changes
- UI component changes beyond import updates

## Dependencies

None - pure refactoring within existing module structure.
