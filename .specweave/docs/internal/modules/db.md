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
- `better-sqlite3` (local development)

## Local Development

`src/lib/db.ts` provides `getDb()` for multi-environment support:

| Environment | Driver | Adapter |
|-------------|--------|---------|
| Cloudflare Workers | `cloudflare:workers` D1 binding | `drizzle-orm/d1` |
| Local Development | Local SQLite file | `drizzle-orm/better-sqlite3` |

**Local DB Path**: `./.wrangler/state/v3/d1/timorlist-db.sqlite`

### ⚠️ wrangler dev 使用独立数据库

`wrangler dev` 启动的 workerd 运行时使用不同的本地数据库：

```
./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/{hash}.sqlite
```

**seed-wrangler.cjs** 脚本用于更新 wrangler dev 的数据库。

## Analysis Summary

- **Source Files**: 10
- **Test Files**: 0
- **Total Exports**: 40+

---
*Updated 2026-05-02*