# Tasks: Refactor Product Config Module

## T-001: Create product-config.ts with types
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-03 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-001**: ProductType union includes all 10 types
    - Given a `ProductType` variable
    - When assigned `'product' | 'service' | 'rental' | 'food' | 'accommodation' | 'automotive' | 'healthcare' | 'education' | 'beauty' | 'event'`
    - Then TypeScript accepts it without error
  - **TC-002**: PriceUnit interface structure
    - Given a `PriceUnit` variable
    - When accessing `.value`, `.label`, `.placeholder`
    - Then all properties exist with correct types

## T-002: Add PRICE_UNIT_MAP lookup table
**User Story**: US-001 | **Satisfies ACs**: AC-US2-04 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-003**: Each product type maps to at least one price unit
    - Given `PRICE_UNIT_MAP`
    - When iterating all ProductType keys
    - Then each has non-empty array of unit values

## T-003: Implement productConfig.isValid() method
**User Story**: US-002 | **Satisfies ACs**: AC-US1-02 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-004**: Valid type returns true
    - Given `productConfig.isValid('product')`
    - When called
    - Then returns `true`
  - **TC-005**: Invalid type returns false
    - Given `productConfig.isValid('invalid_type')`
    - When called
    - Then returns `false`
  - **TC-006**: Type guard narrows type
    - Given a function accepting `type is ProductType`
    - When `isValid('product')` returns true
    - Then TypeScript narrows type correctly

## T-004: Implement productConfig.getPriceUnits() method
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-007**: Returns correct units for product type
    - Given `productConfig.getPriceUnits('product')`
    - When called
    - Then returns units with values in PRICE_UNIT_MAP.product
  - **TC-008**: Invalid type returns empty array
    - Given `productConfig.getPriceUnits('invalid')`
    - When called
    - Then returns `[]`

## T-005: Implement productConfig.getSpecificationFields() method
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-009**: Returns spec fields for valid type
    - Given `productConfig.getSpecificationFields('automotive')`
    - When called
    - Then returns array of SpecificationField objects
  - **TC-010**: Invalid type returns empty array
    - Given `productConfig.getSpecificationFields('invalid')`
    - When called
    - Then returns `[]`

## T-006: Implement productConfig.allTypes() method
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-011**: Returns all ProductType values
    - Given `productConfig.allTypes()`
    - When called
    - Then returns array with exactly 10 elements
  - **TC-012**: All returned values are valid ProductTypes
    - Given `productConfig.allTypes()`
    - When called
    - Then every item passes `isValid()` check

## T-007: Add backward-compatible exports to constants.ts
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-013**: PRICE_UNITS export exists
    - Given `import { PRICE_UNITS } from '@/lib/product-config'`
    - When imported
    - Then it's an array with length > 0
  - **TC-014**: SKU_SERVICE_TYPES export exists
    - Given `import { SKU_SERVICE_TYPES } from '@/lib/product-config'`
    - When imported
    - Then it's an array with length > 0

## T-008: Deprecate getPriceUnitsForServiceType()
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed

**Test Plan**:
- **File**: `src/lib/product-config.test.ts`
- **Tests**:
  - **TC-015**: Deprecated function still works
    - Given `getPriceUnitsForServiceType('product')`
    - When called
    - Then returns same result as `productConfig.getPriceUnits('product')`
  - **TC-016**: Deprecated function has JSDoc warning
    - Given the function definition
    - When checked
    - Then has `@deprecated` JSDoc tag

## T-009: Update products.astro imports
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03 | **Status**: [x] completed

**Test Plan**:
- **File**: `e2e/admin-all-pages.spec.ts` (existing E2E)
- **Tests**:
  - **TC-017**: Products admin page loads without errors
    - Given user navigates to `/admin/products`
    - When page loads
    - Then no console errors
  - **TC-018**: Service type change updates price units
    - Given user on `/admin/products` edit form
    - When selecting 'automotive' service type
    - Then price units dropdown shows automotive-specific units

## T-010: Verify TypeScript compilation
**User Story**: US-003 | **Satisfies ACs**: AC-US3-04 | **Status**: [x] completed

**Test Plan**:
- **Command**: `npx tsc --noEmit`
- **Tests**:
  - **TC-019**: No TypeScript errors
    - Given project compilation
    - When `tsc --noEmit` runs
    - Then exit code is 0

## T-011: Run unit tests
**User Story**: US-003 | **Status**: [x] completed

**Test Plan**:
- **Command**: `pnpm test -- src/lib/product-config`
- **Tests**:
  - **TC-020**: All product-config tests pass
    - Given test suite
    - When executed
    - Then all 15 tests pass