# Products/SKU API

**Path**: `src/pages/api/products-services` + `src/actions/products`

## Overview

Products (SKUs) are managed via both REST API and Server Actions.

## REST API

**Endpoint**: `GET /api/products-services`

```typescript
// Query parameters
?businessId=xxx      // Filter by business
&active=true         // Only active (default)
&isAdmin=true        // Include inactive
```

## Server Actions (Primary)

```typescript
import { actions } from 'astro:actions';

// Create product
const result = await actions.products.create({
  title: 'Product Name',
  businessId: 'xxx',
  productType: 'food',
  priceFields: [{ label: 'Price', value: '10.00', unit: '/piece' }],
});

// Update product
const result = await actions.products.update({
  id: 'xxx',
  title: 'New Name',
});

// Delete product
const result = await actions.products.delete({ id: 'xxx' });
```

## JSON Field Handling

Database stores JSON as strings. API parses on response:

```typescript
const parseJsonField = (val: string | null): unknown => {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return val; }
};
```

## Product Types

| Type | Description |
|------|-------------|
| food | Food items with cuisine, dietary options |
| product | General products |
| service | Services offered |
| vehicle | Vehicles |
| property | Real estate |
| job | Job listings |

## Price Fields

```typescript
interface PriceField {
  label: string;   // e.g., "Regular", "Large"
  value: string;   // e.g., "10.00"
  unit: string;    // e.g., "/piece", "/hour"
}
```

## Related Files

- `src/actions/products/` - Product actions
- `src/pages/api/products-services/` - REST API
- `src/pages/admin/products.astro` - Admin UI
- `src/pages/business/[slug]/products.astro` - Product display

---
*Updated 2026-05-31*
