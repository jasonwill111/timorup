# Security & Best Practices Hardening - PLAN

## Project: TimorUp

---

## 1. Architecture Overview

### Current State
- Astro 6 with SSR + Cloudflare adapter
- Better Auth + KV Sessions
- Drizzle ORM + D1
- Tailwind CSS v4

### Target State
Same architecture, with:
1. **Security Middleware**: Astro middleware layer adding security headers
2. **Fixed Rate Limiting**: Scheduled cleanup of in-memory store
3. **Updated Dependencies**: better-auth-cloudflare at latest version
4. **Improved Auth Flow**: Safer error handling

---

## 2. Component Design

### 2.1 Middleware (`src/middleware.ts`)

```typescript
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
});
```

**Considerations**:
- Middleware runs for all routes including static assets
- Headers are safe to add; no breaking changes expected
- Can add CSP later if needed

### 2.2 Rate Limit Cleanup

**Option A**: Use wrangler.toml `triggers.crons`
```toml
[triggers]
crons = ["0 * * * *"]  # Every hour
```

**Option B**: Use `placement` with smart routing
```toml
[placement]
mode = "smart"
```

**Decision**: Use Option A (cron) for explicit control. Cron triggers are more reliable than placement for cleanup tasks.

### 2.3 Dependency Update Strategy

1. Check available versions: `pnpm info better-auth-cloudflare versions`
2. Check changelog for breaking changes
3. Update package.json
4. Run `pnpm install`
5. Test auth flows manually
6. Run E2E tests

---

## 3. File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/middleware.ts` | **CREATE** | Security middleware |
| `src/lib/rate-limit.ts` | **MODIFY** | Add cron export |
| `wrangler.jsonc` | **MODIFY** | Add cron trigger |
| `package.json` | **MODIFY** | Update better-auth-cloudflare version |
| `src/lib/db.ts` | **MODIFY** | Add JSDoc comments |
| `src/lib/auth.ts` | **MODIFY** | Add JSDoc comments |
| `src/lib/rate-limit.test.ts` | **CREATE** | Unit tests for cleanup |
| `src/actions/auth/signIn.ts` | **MODIFY** | Improve error handling |

---

## 4. Testing Strategy

### Unit Tests
- `rate-limit.test.ts`: Mock in-memory store, verify cleanup removes expired entries

### E2E Tests
- `auth-flow.spec.ts`: Re-run to verify auth still works
- Manual verification: Check DevTools Network tab for security headers

---

## 5. Rollback Plan

- **Dependencies**: Pin version in package.json, can downgrade
- **Middleware**: Delete `src/middleware.ts`, middleware won't run
- **wrangler.toml**: Remove cron trigger section

---

## 6. Non-Goals (Out of Scope)

- CSP (Content Security Policy) - complex, needs careful planning
- OAuth provider updates - separate increment
- Database migrations - not needed