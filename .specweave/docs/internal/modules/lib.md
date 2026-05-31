# lib

**Path**: `src/lib`

## Purpose

Core library utilities: authentication (light-auth + better-auth), database access (Drizzle/D1), caching, admin authorization, error handling.

## Key Files

| File | Purpose |
|------|---------|
| `auth.ts` | better-auth configuration (for Paid plan features) |
| `admin-auth.ts` | Admin role verification (`requireAdmin()`, `getAdminUser()`) |
| `db.ts` | Drizzle/D1 instance (`getDb()`) |
| `cache.ts` | KV caching utilities (`cachedGet()`) |
| `errors/` | Error codes and response helpers |
| `rate-limit.ts` | In-memory rate limiting |

## Auth Architecture

### Dual Auth Strategy

| Plan | Auth Method | CPU | Features |
|------|-------------|-----|---------|
| Free | light-auth (Server Actions) | 3-4ms | Basic sign-in/up |
| Paid | better-auth | 10-15ms | Email verification, OAuth |

### Light Auth (Primary - Free Plan)

```typescript
// src/actions/auth/light-auth.ts
import { defineAction } from 'astro:actions';
import { bcryptCompare } from 'bcryptjs';

export const lightSignIn = defineAction({
  accept: 'json',
  input: z.object({ email: z.string().email(), password: z.string().min(8) }),
  handler: async (input) => {
    // Direct D1 query - bypasses better-auth overhead
    const user = await db.prepare('SELECT ...').first();
    const valid = await bcryptCompare(input.password, user.password);
    // Session: KV write + DB insert
    return { success: true, user };
  }
});
```

### Better Auth (Secondary - Paid Plan)

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';

export const auth = withCloudflare({
  d1Native: env.DB,    // Kysely-based, lighter
  kv: env.SESSION,
}, {
  emailAndPassword: { enabled: true },
  session: { storeSessionInDatabase: true },
});
```

### Admin Authorization

```typescript
// src/lib/admin-auth.ts
import { getAuthenticatedUserFromCookies } from '@/lib/db/queries/auth';

export async function requireAdmin(cookies) {
  const result = await getAuthenticatedUserFromCookies(cookies);
  if ('error' in result) return result;
  if (!['admin', 'super_admin', 'editor'].includes(result.user.role)) {
    return { error: 'FORBIDDEN' };
  }
  return result;
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, error: { code: 'UNAUTHORIZED' } }), { status: 401 });
}
```

## Error Handling

```typescript
// src/lib/errors/errorCodes.ts
export const ErrorCode = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_RATE_LIMITED: 'AUTH_RATE_LIMITED',
  // ... 25+ codes
};

export function createErrorResponse(code, message) {
  return { success: false, error: { code, message } };
}
```

## KV Caching

```typescript
// src/lib/cache.ts
export async function cachedGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl: number }
): Promise<T> {
  const cached = await KV.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetcher();
  await KV.put(key, JSON.stringify(data), { expirationTtl: Math.max(60, options.ttl) });
  return data;
}
```

## Analysis Summary

- **Files Analyzed**: 20
- **Source Files**: 14
- **Test Files**: 6
- **Total Exports**: 92

---
*Updated 2026-05-30*
