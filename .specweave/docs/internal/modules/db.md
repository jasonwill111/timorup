# db

**Path**: `src/db`

## Purpose

Drizzle ORM schema definitions for D1/SQLite database.

## Key Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with role |
| `sessions` | better-auth sessions |
| `businesses` | Business listings |
| `categories` | Two-level hierarchy |
| `media` | Images/videos (R2) |
| `products` | SKUs with pricing |
| `reviews` | User reviews |

## Schema Pattern

```typescript
// src/db/schema/index.ts
import { text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('user'),  // 'user' | 'admin' | 'super_admin' | 'editor'
  // ... better-auth fields
});

export const businesses = sqliteTable('businesses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  userId: text('user_id').references(() => users.id),
  // ...
});
```

## Drizzle Config

```typescript
// drizzle.config.json
{
  "dialect": "sqlite",
  "schema": "./src/db/schema/index.ts",
  "dbCredentials": {
    "url": "https://{account}.user.devcloud.cloudflarestored.com"
  }
}
```

## DB Access

```typescript
// src/lib/db.ts
import { drizzle } from 'drizzle-orm/d1';
import { getDb } from '@/lib/db';

export async function getDb() {
  const { env } = await import('cloudflare:workers');
  return drizzle(env.DB, { schema, casing: 'snake_case' });
}
```

**Note**: `casing: 'snake_case'` converts Drizzle camelCase to DB snake_case.

## Analysis Summary

- **Files Analyzed**: 4
- **Source Files**: 4
- **Test Files**: 0
- **Total Exports**: 34

---
*Analysis updated on 2026-05-06*