# Plan: Price Fields Format Unification

## Current State

- Schema: Has `priceFields` + old `price`/`price_unit` columns
- Database: Old format `{"price":"3.50","unit":"cup"}`
- Frontend: Inconsistent price display

## Target State

- Schema: Only `priceFields` JSON array
- Database: New format `[{"label":"","value":"3.50","unit":"cup"}]`
- Frontend: `$X.XX / unit` everywhere

## Implementation Steps

### Step 1: Schema Update
**Action**: Remove `price`, `price_unit` columns from products table
**Files**: `src/db/schema/index.ts`
**Verify**: `pnpm build` passes

### Step 2: Local D1 Migration
**Action**: Migrate 30 products to new format
**Command**: `npx wrangler d1 execute TimorLink-db --local --file=/tmp/updates.sql`
**Verify**: `SELECT price_fields FROM products LIMIT 3` shows new format

### Step 3: Remote D1 Migration
**Action**: Migrate 20 products to new format
**Command**: `npx wrangler d1 execute TimorLink-db --remote --file=/tmp/updates-remote.sql`
**Verify**: Remote query shows new format

### Step 4: Frontend Update
**Action**: Add `$` prefix to price display in all components
**Files**:
- `src/pages/business/[slug]/product/[id]/index.astro`
- `src/components/business/ProductCard.astro`
- `src/components/islands/ProductsSection.astro`
**Verify**: Build + curl test

## Migration Script Reference

```sql
-- Migration pattern
UPDATE products SET price_fields = '[{"label":"","value":"3.50","unit":"cup"}]' WHERE id = 'prod-1';
```

## Verification Commands

```bash
# Check no old format remaining
npx wrangler d1 execute TimorLink-db --local --command="SELECT COUNT(*) FROM products WHERE price_fields LIKE '{\"price\":\"%';"

# Test price display
curl -s "http://localhost:4324/business/cafe-timor/product/prod-cafe-2" | grep -oE '\$[0-9]+\.[0-9]+ / [^"]*'
```
