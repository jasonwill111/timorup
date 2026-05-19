# ADR-0011: Industry-Specific Product Specifications

**Status**: Implemented
**Date**: 2026-04-30

## Context

The TimorLink product/SKU system needed to support industry-specific fields. Different business types (restaurants, hotels, car rentals, clinics) require different data points to describe their offerings.

## Decision

Add a flexible `specifications` JSON field to the products table, populated based on `serviceType`.

## Implementation

### Database Schema

```typescript
// products table
specifications: text('specifications'),  // JSON string
featured: integer('featured', { mode: 'boolean' }).default(false),
active: integer('active', { mode: 'boolean' }).default(true),
```

### Service Types & Specifications

| ServiceType | Key Fields |
|-------------|------------|
| food | cuisine, dietaryOptions, mealType, priceRange, parking, delivery, takeaway, reservation |
| accommodation | roomType, maxGuests, bedType, checkInTime, checkOutTime, roomSize, amenities |
| automotive | vehicleType, brand, model, year, mileage, fuelType, transmission, condition, doors, seats |
| healthcare | specialization, consultationType, consultationDuration, emergencyService, homeVisit |
| education | courseType, subject, duration, schedule, level, certificate, classSize, language |
| beauty | serviceCategory, genderPreference, duration, advanceBooking, homeService |
| event | eventType, coverage, minBooking, teamIncluded, equipment |
| service | serviceCategory, coverage, responseTime, warranty, insured |
| rental | rentalType, minRental, maxRental, deposit, delivery, deliveryFee |

### API Changes

1. **JSON Parsing**: Added `parseJsonField()` helper to parse stored JSON on response
2. **safeStringify()**: Added helper to safely handle both string and object inputs

```typescript
const parseJsonField = (val: string): unknown => {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return val; }
};
```

## Consequences

### Positive

- Single products table supports all industry types
- Frontend and admin can share the same schema
- Extensible - new service types can be added to constants

### Negative

- Less type safety at database level (JSON storage)
- Querying specific specification fields requires JSON parsing

## Files Changed

- `src/db/schema/index.ts` - Added columns
- `src/pages/api/products/index.ts` - Added JSON parsing
- `src/lib/constants.ts` - Added SPECIFICATION_FIELDS
- `src/pages/admin/skus.astro` - Added dynamic form fields
- `src/pages/business/[slug]/product/[id]/index.astro` - Added specs display
