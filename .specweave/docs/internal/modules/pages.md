# pages

**Path**: `src/pages`

## Purpose

Astro pages and API routes for the application.

## Overview

The pages module contains 60 files with approximately 1,500 lines of code.

## Directory Structure

```
pages/
├── api/                    # API endpoints (SSR)
│   ├── products/          # Product CRUD operations
│   ├── businesses/         # Business listing APIs
│   ├── auth/              # Auth endpoints
│   └── media/             # Media upload
├── admin/                  # Admin dashboard
│   ├── skus.astro         # SKU management
│   ├── businesses.astro   # Business management
│   └── dashboard.astro    # Admin home
├── business/              # Business pages
│   └── [slug]/
│       └── product/
│           └── [id]/      # Product detail page
└── index.astro            # Homepage
```

## API Routes

### Products API (`/api/products`)

| Method | Purpose |
|--------|---------|
| GET | List products by businessPageId |
| POST | Create new product (admin only) |
| PUT | Update product (by id param) |

**Features**:
- SKU limit enforcement per plan
- JSON field parsing on response
- ServiceType validation
- Industry-specific specifications support

### Businesses API (`/api/businesses`)

| Method | Purpose |
|--------|---------|
| GET | List/create businesses |
| PUT | Update business (admin) |

## Admin Pages

- `/admin/skus` - SKU management with dynamic specification fields
- `/admin/businesses` - Business listing management
- `/admin/orders` - Order/subscription management
- `/admin/reviews` - Review management

## Frontend Pages

- `/` - Homepage with business listings
- `/business/[slug]` - Business detail page
- `/business/[slug]/product/[id]` - Product/SKU detail page

## Analysis Summary

- **Source Files**: 60
- **API Files**: 8
- **Total Exports**: 20+

---
*Updated 2026-04-30*