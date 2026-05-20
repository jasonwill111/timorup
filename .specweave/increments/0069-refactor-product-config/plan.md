# Implementation Plan: Refactor Product Config Module

## Overview

Extract typed `ProductType` literal union from `src/lib/constants.ts` into new `src/lib/product-config.ts` module. Create `productConfig` singleton object with type-safe API methods while maintaining backward compatibility.

## Architecture

### Components

| Component | Purpose |
|-----------|---------|
| `src/lib/product-config.ts` | New module with types + `productConfig` API |
| `src/lib/constants.ts` | Re-export from product-config for compat |

### Data Model

```
ProductConfig
├── ProductType (literal union)
│   └── 'product' | 'service' | 'rental' | 'food' | 'accommodation' | 'automotive' | 'healthcare' | 'education' | 'beauty' | 'event'
├── PriceUnit (interface)
│   └── { value, label, placeholder }
├── SpecificationField (interface)
│   └── { key, label, type, options?, placeholder? }
└── PRICE_UNIT_MAP (Record<ProductType, string[]>)
    └── Maps each product type to valid price unit values
```

### API Contracts

```typescript
// Public API
export const productConfig = {
  isValid(type: string): type is ProductType,
  getPriceUnits(type: string): PriceUnit[],
  getSpecificationFields(type: string): SpecificationField[],
  allTypes(): ProductType[],
} as const;

// Backward compat exports
export const PRICE_UNITS: readonly PriceUnit[];
export const SKU_SERVICE_TYPES: readonly { value: string; label: string; icon: string }[];
export const getPriceUnitsForServiceType: (type: string) => PriceUnit[]; // @deprecated
```

## Technology Stack

- **Language**: TypeScript 6.x
- **Framework**: Astro 6.x (Cloudflare Workers)
- **Testing**: Vitest
- **Build**: Vite

## Implementation Phases

### Phase 1: Create Module Foundation (T-001, T-002)
1. Define `ProductType` literal union
2. Define `PriceUnit` and `SpecificationField` interfaces
3. Create `PRICE_UNIT_MAP` as private lookup table
4. Copy existing `PRICE_UNITS` and `SKU_SERVICE_TYPES` data

### Phase 2: Implement API Methods (T-003, T-004, T-005, T-006)
1. `productConfig.isValid()` - type guard
2. `productConfig.getPriceUnits()` - filtered lookup
3. `productConfig.getSpecificationFields()` - spec field lookup
4. `productConfig.allTypes()` - returns all valid types

### Phase 3: Backward Compatibility (T-007, T-008)
1. Export `PRICE_UNITS`, `SKU_SERVICE_TYPES` from product-config
2. Add deprecated `getPriceUnitsForServiceType()` wrapper

### Phase 4: Migration (T-009, T-010, T-011)
1. Update `products.astro` imports
2. Run TypeScript check
3. Run unit tests

## Testing Strategy

| Layer | Tool | Target |
|-------|------|--------|
| Unit | Vitest | 100% of `productConfig` API |
| Integration | E2E | products.astro page load |
| Type | tsc --noEmit | Zero errors |

## Technical Challenges

### Challenge: Maintaining backward compatibility
**Solution**: Keep all existing exports in `constants.ts`, re-export from new module
**Risk**: Low - no breaking changes to consumers

### Challenge: SPECIFICATION_FIELDS type safety
**Solution**: Define `SpecificationField` interface matching current runtime structure
**Risk**: Low - existing data already conforms to interface shape