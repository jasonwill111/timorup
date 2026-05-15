# Feature: Price Fields Format Unification

## Overview

Unify price display format across entire application: schema → database → frontend. Single format `$X.XX / unit` with no redundancy.

## Context

Previously:
- Schema had `price`, `price_unit` columns (redundant)
- Database stored old format: `{"price":"3.50","unit":"cup"}`
- Frontend displayed inconsistent price formats

Now:
- Schema: only `priceFields` JSON array: `[{label, value, unit}]`
- Database: new format: `[{"label":"","value":"3.50","unit":"cup"}]`
- Frontend: unified display: `$4.50 / bottle`

## User Stories

### US-001: Schema Simplification
**Project**: timorlist

**As a** developer
**I want** single price format in schema
**So that** no confusion about data structure

**Acceptance Criteria**:
- [x] AC-US1-01: `products` table has only `priceFields` (no `price`, `price_unit` columns)
- [x] AC-US1-02: Schema file reflects single format
- [x] AC-US1-03: Build passes with new schema

### US-002: Database Migration
**Project**: timorlist

**As a** database admin
**I want** all existing data migrated to new format
**So that** frontend receives consistent data

**Acceptance Criteria**:
- [x] AC-US2-01: Local D1 (30 products) migrated to new format
- [x] AC-US2-02: Remote D1 (20 products) migrated to new format
- [x] AC-US2-03: No remaining old format `{"price":"X"}` entries

### US-003: Frontend Display
**Project**: timorlist

**As a** user
**I want** consistent price format everywhere
**So that** I can quickly compare prices

**Acceptance Criteria**:
- [x] AC-US3-01: Product detail page shows `$X.XX / unit`
- [x] AC-US3-02: ProductCard shows `$X.XX / unit`
- [x] AC-US3-03: ProductsSection shows `$X.XX / unit`
- [x] AC-US3-04: HomepageContent shows `$X.XX / unit`

## Price Display Format

| Component | Format | Example |
|-----------|--------|---------|
| Product detail | `$value / unit` | `$4.50 / bottle` |
| ProductCard | `$value / unit` | `$15.00 / pack` |
| ProductsSection | `$value / unit` | `$8.00 / set` |
| HomepageContent | `$value / unit` | `$12.00 / USD` |

## Files Modified

1. `src/db/schema/index.ts` - Removed `price`, `price_unit` columns
2. `src/pages/business/[slug]/product/[id]/index.astro` - Added `$` prefix
3. `src/components/business/ProductCard.astro` - Added `$` prefix
4. `src/components/islands/ProductsSection.astro` - Added `$` prefix

## Database Changes

| Environment | Products | Format |
|-------------|----------|--------|
| Local D1 | 30 | `[{"label":"","value":"X","unit":"Y"}]` |
| Remote D1 | 20 | `[{"label":"","value":"X","unit":"Y"}]` |

## Migration Scripts

- `migrations/0042_migrate_price_fields.sql` - Reference file
- `/tmp/updates.sql` - Local D1 migration
- `/tmp/updates-remote.sql` - Remote D1 migration