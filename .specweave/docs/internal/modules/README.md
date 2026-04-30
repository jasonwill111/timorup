# Module Documentation

## Source Modules

| Module | Path | Description |
|--------|------|-------------|
| **pages** | `src/pages` | Astro pages and API routes |
| **components** | `src/components` | Reusable UI components |
| **db** | `src/db` | Drizzle schema and migrations |
| **lib** | `src/lib` | Utilities, constants, auth |
| **server** | `src/server` | Cloudflare Workers entry |

## Module Details

### pages/
Astro SSR pages and REST API endpoints.

- `api/products/` - Product CRUD
- `api/businesses/` - Business CRUD
- `admin/skus.astro` - Admin SKU management
- `business/[slug]/` - Business pages

### components/
React/Astro hybrid components.

- `ImageUploader` - R2 media upload
- `LexicalEditor` - TipTap rich text
- `ReviewsList` - Review display

### db/
Drizzle ORM schema definitions.

- `schema/index.ts` - All table definitions
- `migrations/` - Schema migrations

### lib/
Shared utilities.

- `auth.ts` - better-auth config
- `db.ts` - D1 connection
- `constants.ts` - Service types, specs
- `media.ts` - R2 operations

### server/
Hono-based route handlers.

- `entry.mjs` - Main worker entry
- API apps for routing

---
*Updated 2026-04-30*