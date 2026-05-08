# Homepage Featured Sections - Specification

## Context

Homepage needs prominent featured sections to showcase businesses and products, increasing user engagement and willingness-to-pay.

## User Stories

### US-001: Featured Businesses Display
As a visitor, I want to see featured businesses on the homepage so I can discover popular local businesses quickly.

### US-002: Featured Products Display
As a visitor, I want to see featured products/services so I can browse what's available.

## Acceptance Criteria

### AC-001: Featured Businesses Section
- [x] Display 12 business cards on homepage
- [x] Show thumbnail, title, category, likes
- [x] Link to business detail page

### AC-002: Featured Products Section
- [x] Display 12 product cards on homepage
- [x] Show thumbnail, title, price, business name
- [x] Link to product detail page

### AC-003: ProductCard Component
- [x] Reusable product card component created
- [x] Supports flexible pricing display
- [x] Service type color coding

### AC-004: Auth Page Bug Fixes
- [x] forgot-password.astro: Add missing imports
- [x] reset-password.astro: Add CardFooter import
- [x] verify.astro: Add CardFooter import

## Schema Changes

None - uses existing businessPages and products tables.

## Updated Files

| File | Changes |
|------|---------|
| src/components/business/ProductCard.astro | NEW - product card component |
| src/pages/index.astro | Featured businesses + products queries |
| src/pages/forgot-password.astro | Fix missing imports |
| src/pages/reset-password.astro | Fix missing imports |
| src/pages/verify.astro | Fix missing imports |

## Verification

- [x] All 17 pages return HTTP 200
- [x] 12 featured business cards displayed
- [x] 12 featured product cards displayed
- [x] TipTap confirmed in business edit + product new pages

## Status

**Completed**: 2026-04-26
