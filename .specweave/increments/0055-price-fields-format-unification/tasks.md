# Tasks: Price Fields Format Unification

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[x]`: Completed
- `[~]`: Already correct

---

## Phase 1: Schema Simplification (US-001)

### T-001: Verify schema has only priceFields
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed

**Test**: Given products table schema → When queried → Then no `price` or `price_unit` columns exist
```sql
PRAGMA table_info(products);
-- Expected: no columns named 'price' or 'price_unit'
```

---

### T-002: Verify schema file reflects single format
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02 | **Status**: [x] completed

**Test**: Given `src/db/schema/index.ts` → When grep for `price` → Then no `price: text()` or `price_unit: text()` definitions

---

### T-003: Verify build passes
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [x] completed

**Test**: Given `pnpm build` → When executed → Then exit code 0 with "Build complete!"

---

## Phase 2: Database Migration (US-002)

### T-004: Migrate local D1
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed

**Test**: Given local D1 → When query `SELECT price_fields FROM products LIMIT 3` → Then all results are new format `[{label, value, unit}]`

---

### T-005: Migrate remote D1
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Test**: Given remote D1 → When query `SELECT price_fields FROM products LIMIT 3` → Then all results are new format `[{label, value, unit}]`

---

### T-006: Verify no old format remaining
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Test**: Given both D1 databases → When query `SELECT COUNT(*) WHERE price_fields LIKE '{"price":"%'` → Then count = 0

---

## Phase 3: Frontend Display (US-003)

### T-007: Product detail page shows $X.XX / unit
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed

**Test**: Given product detail page at `/business/cafe-timor/product/prod-cafe-2` → When fetched → Then price displays as `$4.50 / bottle`

**Files**: `src/pages/business/[slug]/product/[id]/index.astro`
**Changes**: Line 65: `$${priceFields[0].value} / ${priceFields[0].unit}`

---

### T-008: ProductCard shows $X.XX / unit
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [x] completed

**Test**: Given ProductCard component → When rendered with priceFields → Then price badge shows `$X.XX / unit`

**Files**: `src/components/business/ProductCard.astro`
**Changes**: Line 25: `$${priceFields[0].value} / ${priceFields[0].unit}`

---

### T-009: ProductsSection shows $X.XX / unit
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03 | **Status**: [x] completed

**Test**: Given ProductsSection component → When rendered with priceFields → Then price span shows `$value / unit`

**Files**: `src/components/islands/ProductsSection.astro`
**Changes**: Line 58: `$${priceValue} / {priceUnit}`

---

### T-010: HomepageContent shows $X.XX / unit
**User Story**: US-003 | **Satisfies ACs**: AC-US3-04 | **Status**: [x] completed

**Test**: Given HomepageContent component → When products loaded → Then ProductCard receives price in `$value / unit` format

**Files**: `src/components/islands/HomepageContent.astro`
**Changes**: Direct JSON.parse of priceFields, passed to ProductCard

---

## Phase 4: Verification

### T-011: Run build
**Status**: [x] completed

`pnpm build` - Build completed successfully.

---

### T-012: Test product page with curl
**Status**: [x] completed

**Test**: Given `curl http://localhost:4324/business/cafe-timor/product/prod-cafe-2` → Then HTML contains `$4.50 / bottle`

---

## Summary

| Phase | Tasks | Completed |
|-------|-------|-----------|
| 1: Schema | 3 | 3 |
| 2: Database | 3 | 3 |
| 3: Frontend | 4 | 4 |
| 4: Verification | 2 | 2 |
| **Total** | **12** | **12** |

## Files Modified

1. `src/db/schema/index.ts` - Removed redundant columns
2. `src/pages/business/[slug]/product/[id]/index.astro` - Added `$` prefix
3. `src/components/business/ProductCard.astro` - Added `$` prefix
4. `src/components/islands/ProductsSection.astro` - Added `$` prefix

## Files Created

1. `.specweave/increments/0055-price-fields-format-unification/metadata.json`
2. `.specweave/increments/0055-price-fields-format-unification/spec.md`
3. `.specweave/increments/0055-price-fields-format-unification/tasks.md`
4. `migrations/0042_migrate_price_fields.sql` - Migration reference