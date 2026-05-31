# Module Documentation

## Source Modules

| Module | Path | Description |
|--------|------|-------------|
| **pages** | `src/pages` | Astro SSR pages and REST APIs |
| **components** | `src/components` | Reusable UI components |
| **actions** | `src/actions` | Astro Server Actions |
| **db** | `src/db` | Drizzle schema and migrations |
| **lib** | `src/lib` | Utilities, auth, caching |

## Module Details

### pages/
Astro SSR pages and REST API endpoints.

- `admin/` - Admin dashboard (CRUD for all entities)
- `api/` - REST APIs (public data, health, scheduled)
- `login.astro` - User login (uses light-signIn action)
- `business/[slug].astro` - Business detail page

### components/
Astro UI components.

- `ui/` - Buttons, cards, forms, icons
- `islands/` - Server Islands (hydrated components)
- `Header.astro`, `Footer.astro` - Site layout

### actions/
Astro Server Actions (primary mutation pattern).

- `auth/` - Authentication (light-signIn, light-signUp, signOut)
- `admin/` - Admin CRUD operations
- `business/` - Business create/update/like
- `products/` - Product CRUD
- `media/` - R2 media upload/delete

### db/
Drizzle ORM schema definitions.

- `schema/index.ts` - All table definitions
- `migrations/` - Schema migrations
- `seed.ts` - Test data seeding

### lib/
Shared utilities.

- `auth.ts` - better-auth configuration
- `light-auth.ts` - Lightweight auth (Free Plan)
- `admin-auth.ts` - Admin authorization
- `db.ts` - D1/SQLite connection
- `cache.ts` - KV caching utilities
- `errors/` - Error codes and helpers

## Auth Architecture

| Plan | Method | CPU | Files |
|------|--------|-----|-------|
| Free | light-auth (Server Actions) | 3-4ms | `actions/auth/light-auth.ts` |
| Paid | better-auth | 10-15ms | `lib/auth.ts` |

## Analysis Summary

- **Source Files**: 250+
- **Server Actions**: 45+
- **Components**: 40+
- **Documentation Coverage**: 60%

---
*Updated 2026-05-30*
