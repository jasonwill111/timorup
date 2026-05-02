# Module Documentation

## Source Modules

| Module | Path | Description |
|--------|------|-------------|
| **pages** | `src/pages` | Astro pages and API routes |
| **components** | `src/components` | Reusable UI components |
| **db** | `src/db` | Drizzle schema and migrations |
| **lib** | `src/lib` | Utilities, constants, auth |
| **server** | `src/server` | Cloudflare Workers entry |
| **api-products** | `src/pages/api/products` | SKU/Product API |
| **testing** | `e2e/` | Playwright E2E tests |

## Module Details

### pages/
Astro SSR pages and REST API endpoints.

- `api/products/` - Product CRUD
- `api/businesses/` - Business CRUD
- `api/auth/` - Authentication endpoints
- `admin/skus.astro` - Admin SKU management
- `listing/create` - Listing creation (gov/ngo free support)
- `subscribe` - Subscription plan selection

### components/
React/Astro hybrid components.

- `ImageUploader` - R2 media upload
- `LexicalEditor` - TipTap rich text
- `ReviewsList` - Review display

### db/
Drizzle ORM schema definitions.

- `schema/index.ts` - All table definitions
- `migrations/` - Schema migrations
- Local SQLite support via `better-sqlite3`

### lib/
Shared utilities.

- `auth.ts` - better-auth config
- `db.ts` - D1/SQLite connection
- `constants.ts` - Service types, specs
- `media.ts` - R2 operations

### api-products/
Product/SKU API endpoints.

- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products` - Update product
- Industry-specific specifications support

### testing/
Playwright E2E tests.

- `gov-ngo-subscription-flow.spec.ts` - 14 tests for gov/ngo/subscription flow
- `factories.ts` - Test data factories
- Auth via API with session token

### server/
Hono-based route handlers.

- `entry.mjs` - Main worker entry
- API apps for routing

---
*Updated 2026-05-02*