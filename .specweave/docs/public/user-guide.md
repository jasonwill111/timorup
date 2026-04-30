# TimorList User Guide

## Quick Start

### For Business Owners

1. **Create Account**: Sign up at `/signup`
2. **Create Business Page**: Go to `/businesses/create`
3. **Add Products/SKUs**: Manage at `/admin/skus`

### For Admin Users

1. **Access Admin Panel**: `/admin`
2. **Manage Listings**: `/admin/businesses`
3. **Manage SKUs**: `/admin/skus`
4. **View Analytics**: `/admin/dashboard`

## Key Features

### Product/Service Types

TimorList supports multiple industry types with specialized fields:

| Type | Use For |
|------|---------|
| Food & Dining | Restaurants, cafes, food stalls |
| Accommodation | Hotels, homestays, rentals |
| Automotive | Cars, motorcycles, rentals |
| Healthcare | Clinics, pharmacies |
| Education | Schools, tutoring centers |
| Beauty | Salons, spas |
| Event | Photography, catering |

### SKU Management

Each product can have:
- **Multiple pricing options** (e.g., small/medium/large)
- **Industry-specific specifications** (auto-fills based on type)
- **Rich description** with TipTap editor

## API Documentation

### Products API

```
GET  /api/products?businessPageId=xxx
POST /api/products
PUT  /api/products?id=xxx
```

See `.specweave/docs/internal/modules/api-products.md` for details.

## Deployment

- **Production**: https://timorlist.jasonwill.workers.dev
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2

---
*Generated 2026-04-30*