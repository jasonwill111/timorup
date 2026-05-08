# Tasks - 0016: Homepage Featured Sections

## T-001: Create ProductCard Component
**Status**: [x] completed
**Satisfies**: AC-003
**Test**: Given product data → When rendered → Then displays thumbnail, price, business name

```astro
<!-- src/components/business/ProductCard.astro -->
- thumbnail with gradient background
- price badge overlay
- title + business name
- service type color coding
```

## T-002: Homepage Featured Businesses
**Status**: [x] completed
**Satisfies**: AC-001
**Test**: Given live businesses → When homepage loads → Then 12 business cards displayed

Query: `status = 'live'` ordered by likes desc, limit 12

## T-003: Homepage Featured Products
**Status**: [x] completed
**Satisfies**: AC-002
**Test**: Given products from live businesses → When homepage loads → Then 12 product cards displayed

Query: innerJoin with businessPages where status='live', order by createdAt desc, limit 12

## T-004: EntityType Filter Bug Fix
**Status**: [x] completed
**Satisfies**: AC-001
**Test**: Given businesses with entityType → When mapped → Then filter works correctly

Fixed: Added `entityType: b.entityType` to allListings map.

## T-005: Auth Page Imports
**Status**: [x] completed
**Satisfies**: AC-004
**Test**: Given auth pages → When loaded → Then HTTP 200

Fixed:
- forgot-password.astro: Added CardHeader, CardTitle, CardDescription, CardContent imports
- reset-password.astro: Added CardFooter import
- verify.astro: Added CardFooter import

## Verification

- [x] pnpm build: exit 0
- [x] 17 pages tested, all return 200
- [x] 12 featured business cards on homepage
- [x] 12 featured product cards on homepage
- [x] TipTap verified in business edit + product new
