# lib

**Path**: `src/lib`

## Purpose

Core library utilities: authentication (better-auth), database access (Drizzle/D1), admin authorization.

## Key Files

| File | Purpose |
|------|---------|
| `auth.ts` | better-auth configuration + factory (`initAuth()`, `createAuth()`) |
| `admin-auth.ts` | Admin role verification (`getAdminUser()`) |
| `db.ts` | Drizzle/D1 instance (`getDb()`, `initDb()`) |

## Auth Architecture

### better-auth Setup

```typescript
// auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';

export function createAuth(db) {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8787',
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    emailAndPassword: { enabled: true },
    session: { expiresIn: 60 * 60 * 24 * 7 },
  });
}

export async function initAuth() {
  if (!_initAuth) {
    const db = await getDb();
    _initAuth = createAuth(db);
  }
  return _initAuth;
}
```

### Admin Authorization

```typescript
// admin-auth.ts
export async function getAdminUser(request: Request): Promise<AuthUser | null> {
  // Direct DB query for session verification
  const db = await getDb();
  const session = await db.select().from(sessions).where(...).get();
  const user = await db.select().from(users).where(...).get();

  if (!user || !['admin', 'super_admin', 'editor'].includes(user.role)) {
    return null;
  }
  return { id: user.id, email: user.email, role: user.role };
}
```

### DB Access Pattern

```typescript
// db.ts
export async function getDb() {
  if (_db) return _db;
  const { env } = await import('cloudflare:workers');
  if (env.DB) {
    _db = drizzle(env.DB, { schema, casing: 'snake_case' });
  }
  return _db;
}
```

## Environment

| Runtime | Auth | DB |
|---------|------|-----|
| Local (`pnpm dev`) | better-auth | D1 via `env.DB` |
| Workers | better-auth | D1 via `env.DB` |

## Common Issues

- **Session cookie name**: `better-auth.session_token` (httpOnly)
- **Role check**: Use `getAdminUser()` from `admin-auth.ts`, not `authApi.getSession()`
- **Custom user fields** (role): Query DB directly, better-auth doesn't return them

## Analysis Summary

- **Files Analyzed**: 20
- **Source Files**: 14
- **Test Files**: 6
- **Total Exports**: 92

---
*Analysis updated on 2026-05-06*