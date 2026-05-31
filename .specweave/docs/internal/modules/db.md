# db

**Path**: `src/db`

## Purpose

Drizzle ORM schema definitions for Cloudflare D1 (SQLite) database.

## Schema Structure

```
src/db/
├── schema/
│   ├── index.ts          # All table definitions
│   ├── auth.ts          # Auth tables (users, sessions, accounts)
│   ├── businesses.ts     # Business entities
│   ├── listings.ts      # Listing ads
│   ├── media.ts         # Media attachments
│   ├── products.ts      # Products/SKUs
│   └── subscriptions.ts  # Subscription plans
├── seed.ts             # Test data seeding
└── migrations/         # Drizzle migrations
```

## Key Tables

| Table | Purpose |
|-------|---------|
| `user` | User accounts (better-auth) |
| `session` | Session tokens |
| `account` | Auth providers |
| `businesses` | Business listings |
| `business_categories` | Business categories |
| `listings` | Classified ads |
| `listing_categories` | Listing categories |
| `non_profits` | Non-profit organizations |
| `public_sectors` | Government/NGO |
| `products` | SKUs with pricing |
| `subscriptions` | Subscription plans |
| `media` | Images/videos |

## Schema Pattern

```typescript
// src/db/schema/businesses.ts
import { text, integer } from 'drizzle-orm/sqlite-core';

export const businesses = sqliteTable('businesses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').references(() => users.id),
  categoryId: text('category_id').references(() => businessCategories.id),
  // Timestamps
  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
});
```

## Auth Tables (better-auth compatible)

```typescript
// camelCase columns for better-auth
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').default('user'),
  emailVerified: integer('emailVerified', { mode: 'boolean' }),
  createdAt: integer('createdAt'),
  updatedAt: integer('updatedAt'),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt').notNull(),
  createdAt: integer('createdAt'),
  updatedAt: integer('updatedAt'),
});
```

## DB Access Pattern

```typescript
// src/lib/db.ts
import { drizzle } from 'drizzle-orm/d1';
import { getDb } from '@/lib/db';

export async function getDb() {
  const { env } = await import('cloudflare:workers');
  return drizzle(env.DB, { schema, casing: 'snake_case' });
}
```

## Server Islands Pattern

```typescript
// For Server Islands (isolated V8 context)
import { getDb } from '@/lib/db';

const db = await getDb(); // Direct import, not initDb()
```

## Analysis Summary

- **Files Analyzed**: 14
- **Source Files**: 14
- **Test Files**: 0
- **Total Exports**: 34

---
*Updated 2026-05-31*
