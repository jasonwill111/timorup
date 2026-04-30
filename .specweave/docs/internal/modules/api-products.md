# Products API

**Path**: `src/pages/api/products`

## Overview

REST API for SKU/Product management with industry-specific specifications.

## Endpoints

### GET /api/products

List products by business.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| businessPageId | string | Filter by business |
| isAdmin | boolean | Include inactive products |
| active | boolean | Only active products (default: true) |

**Response**:
```json
{
  "success": true,
  "data": [{
    "id": "prod-xxx",
    "title": "Nasi Goreng",
    "priceFields": [{"label": "Regular", "value": "5.00", "unit": "/piece"}],
    "serviceType": "food",
    "specifications": {"cuisine": ["Indonesian"]},
    "featured": false,
    "active": true
  }]
}
```

### POST /api/products

Create new product (admin only).

**Request Body**:
```json
{
  "title": "Product Name",
  "businessPageId": "xxx",
  "serviceType": "food",
  "priceFields": [{"label": "Price", "value": "10.00", "unit": "/piece"}],
  "specifications": {"cuisine": ["Indonesian"]},
  "description": "<p>Description</p>",
  "isAdmin": true
}
```

**Features**:
- SKU limit enforcement per plan
- ServiceType validation
- JSON field safeStringify

### PUT /api/products?id=xxx

Update existing product.

**Features**:
- Partial updates
- JSON field parsing on response

## JSON Field Handling

Database stores JSON as strings. API parses on response:

```typescript
const parseJsonField = (val: string): unknown => {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return val; }
};
```

## Service Types

| Type | Specs Fields |
|------|-------------|
| food | cuisine, dietaryOptions, mealType, priceRange, parking, delivery |
| accommodation | roomType, maxGuests, bedType, checkInTime, amenities |
| automotive | vehicleType, brand, model, year, mileage, fuelType |
| healthcare | specialization, consultationType, emergencyService |
| education | courseType, subject, duration, level, certificate |
| beauty | serviceCategory, genderPreference, duration |
| event | eventType, coverage, teamIncluded |
| service | serviceCategory, coverage, responseTime |
| rental | rentalType, minRental, maxRental, deposit |

## Related Files

- `src/lib/constants.ts` - SPECIFICATION_FIELDS definition
- `src/pages/admin/skus.astro` - Admin UI
- `src/pages/business/[slug]/product/[id]/index.astro` - Product detail

---
*Updated 2026-04-30*