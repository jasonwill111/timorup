# Implementation Plan: Best Practices Enforcement & Tech Stack Alignment

## Overview

Fix 15 code quality issues across security, TypeScript, performance, and error handling. Align all tech stack components with latest stable best practices.

## Design

### Phase 1: Security Hardening (US-001)

**Files to modify**:
- `src/components/Header.astro` — Escape user data in innerHTML
- `src/components/UpdatesSection.astro` — Escape user data in innerHTML
- `src/lib/modal.ts` — Escape user data in innerHTML
- `src/actions/business/create.ts` — Wrap JSON.parse in try/catch
- `src/actions/business/update.ts` — Wrap JSON.parse in try/catch
- `wrangler.jsonc` — Update compatibility_date

**Pattern for XSS fix**:
```typescript
// src/lib/utils.ts already has escapeHtmlServer()
import { escapeHtmlServer } from '@/lib/utils';

// Before (XSS risk)
el.innerHTML = `<span>${userName}</span>`;

// After (safe)
el.innerHTML = `<span>${escapeHtmlServer(userName)}</span>`;
```

### Phase 2: TypeScript Strictness (US-002)

**File**: `tsconfig.json`

Add to compilerOptions:
```json
{
  "noFallthroughCasesInSwitch": true,
  "exactOptionalPropertyTypes": true,
  "useUnknownInCatchVariables": true
}
```

**Refactor type assertions**: Replace bare `as HTMLElement` with type guards where possible, or use `Document.cast()` pattern.

### Phase 3: Error Handling (US-003)

**Files**:
- `src/pages/500.astro` — Create custom error page
- `src/lib/auth.ts` — Fix race condition
- `src/actions/business/update.ts` — Implement cache purge

**Auth race condition fix**:
```typescript
let initPromise: Promise<BetterAuthInstance> | undefined;

export async function initAuth(env?: { SESSION?: KVNamespace }) {
  if (!_initAuth) {
    initPromise ??= (async () => {
      const db = await getDb();
      return createAuth(db, env);
    })();
    _initAuth = await initPromise;
  }
  return _initAuth;
}
```

### Phase 4: Database & Performance (US-004)

**File**: `src/db/schema/index.ts`

Add indexes:
```typescript
// businesses table - add to existing index section
index("businesses_owner_idx").on(table.ownerId),
index("businesses_category_idx").on(table.categoryId),
index("businesses_status_idx").on(table.status),

// listings table - add to existing index section
index("listings_status_idx").on(table.status),
index("listings_expires_idx").on(table.expiresAt),
```

### Phase 5: Cookie Security (US-005)

**File**: `src/lib/auth.ts`

```diff
- sameSite: 'lax'
+ sameSite: 'strict'
```

### Phase 6: Zod v4 Update (US-006)

Update email validation in action schemas:
```diff
- email: z.string().email('Valid email required')
+ email: z.email({ error: 'Valid email required' })
```

## Technology Stack Alignment

| Component | Current | Target | Action |
|-----------|---------|--------|--------|
| Astro | 6.3.2 | 6.3.x (latest) | Keep current |
| better-auth | 1.6.11 | 1.6.x | Keep current |
| drizzle-orm | 0.45.2 | 0.45.x | Keep current |
| zod | 4.4.3 | 4.4.x | API update |
| wrangler | 4.90.1 | 4.x | Update compat_date |
| TypeScript | 6.0.3 | 6.x | Strict mode |
| Cloudflare | Workers | Workers | compat_date update |

## Rationale

1. **Security first**: XSS and injection fixes are non-negotiable
2. **TypeScript strict**: Catches bugs at compile time, not runtime
3. **Error boundaries**: User experience improvement
4. **DB indexes**: Query performance at scale
5. **Cookie security**: CSRF protection per OWASP recommendations
6. **Zod v4**: Modern API usage, future-proof

## Technical Challenges

### Challenge 1: Auth race condition in concurrent requests
**Solution**: Module-level promise pattern ensures single initialization
**Risk**: Low — well-tested pattern

### Challenge 2: Type assertion refactoring
**Solution**: Focus on safety-critical casts, leave cosmetic ones
**Risk**: Low — no behavior change

### Challenge 3: New database indexes require migration
**Solution**: `npx drizzle-kit push` to apply schema changes
**Risk**: Medium — test locally first