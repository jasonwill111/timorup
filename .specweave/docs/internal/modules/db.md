# db

**Path**: `src/db`

## Purpose

Database schema and Drizzle ORM configuration for D1 SQLite.

## Overview

The db module contains 12 files with approximately 500 lines of code.

## Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with email/phone |
| `businessPages` | Business/Gov/NGO listings |
| `products` | SKU/Product system |
| `categories` | Listing categories |
| `media` | Uploaded media files |
| `reviews` | Business reviews |
| `orders` | Subscription orders |
| `sessions` | Auth sessions |
| `accounts` | OAuth accounts |
| `adBanners` | Advertisement banners |
| `siteSettings` | Global settings |

## Products Schema

Products support industry-specific specifications:

```typescript
// Core fields
id, title, description, businessPageId
priceFields: JSON string (array of {label, value, unit})
serviceType: 'product'|'service'|'rental'|'food'|'accommodation'|'automotive'|'healthcare'|'education'|'beauty'|'event'
specifications: JSON string (industry-specific)
featured: boolean
active: boolean
```

## Dependencies

- `drizzle-orm` (ORM)
- `better-auth` (auth tables)

## Analysis Summary

- **Source Files**: 10
- **Test Files**: 0
- **Total Exports**: 40+

---
*Updated 2026-04-30*