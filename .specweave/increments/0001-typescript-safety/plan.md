# PLAN.md — 0001-typescript-safety

**Project**: timorlist
**Status**: in-progress

---

## Design

### 1. Type Safety Fix for Drizzle ORM Queries

**Problem**: `or()` and `eq()` conditions in Drizzle ORM are being cast as `any` to bypass TypeScript errors. This defeats the purpose of strict mode.

**Solution**: Use Drizzle's `SQL` type alias for dynamic condition arrays.

```typescript
// Before (bad)
const conditions = [
  or(eq(businesses.status, 'live'), eq(businesses.status, 'published')) as any
];

// After (good)
import { type SQL } from 'drizzle-orm';
const conditions: SQL[] = [];
conditions.push(
  or(eq(businesses.status, 'live'), eq(businesses.status, 'published'))
);
```

**Pattern**: Build condition array conditionally, then spread into `where()`.

### 2. Auth Cookie Security Configuration

**Problem**: better-auth session cookie settings not explicitly configured.

**Solution**: Add explicit `session.cookie` configuration in auth.ts.

```typescript
session: {
  cookie: {
    name: 'better-auth.session_token',
    httpOnly: true,      // Prevent XSS access
    secure: import.meta.env.PROD,  // HTTPS only in production
    sameSite: 'lax',     // CSRF protection
    maxAge: 604800,      // 7 days in seconds
  }
}
```

### 3. Test Coverage Strategy

**Pattern**: Unit tests with Vitest for utility functions.

```typescript
// src/lib/business-logic.test.ts
describe('sanitizeSearchTerm', () => {
  it('trims whitespace', () => {
    expect(sanitizeSearchTerm('  cafe  ')).toBe('cafe');
  });
  it('escapes SQL wildcards', () => {
    expect(sanitizeSearchTerm('cafe%')).toBe('cafe\\%');
  });
});
```

### 4. Error Boundary Component

**Pattern**: Astro island with try-catch and fallback UI.

```astro
---
// src/components/islands/ErrorBoundary.astro
const { fallback } = Astro.props;
---
{fallback ? (
  <slot />
) : (
  <div class="error-state">
    <p>Something went wrong. Please try again.</p>
  </div>
)}
```

---

## Rationale

### Why Use `SQL[]` Instead of `as any`
Drizzle v0.45+ supports type-safe dynamic queries via the `SQL` type. Using `as any` bypasses compile-time checks and can introduce runtime errors. The condition array pattern is the recommended approach from Drizzle docs.

### Why Explicit Cookie Config
better-auth defaults are reasonable but explicit config is better for security audits. The `secure` flag should be environment-aware (true in production, false locally).

### Why Error Boundaries as Islands
Astro server islands are already SSR components. Adding error boundaries here provides graceful degradation without affecting static parts of the page.

### Why Test Coverage Now
Before refactoring type safety, we need tests to catch regressions. Tests for `sanitizeSearchTerm` and `escapeHtml` already exist in test files — we just need to ensure they're comprehensive.

---

## Files to Modify

| File | Change | AC |
|------|--------|-----|
| `src/pages/api/businesses/index.ts` | Replace `as any` with `SQL[]` | AC-US1-01 |
| `src/pages/api/non-profits/index.ts` | Replace `as any` with `SQL[]` | AC-US1-02 |
| `src/pages/api/public-sectors/index.ts` | Replace `as any` with `SQL[]` | AC-US1-03 |
| `src/pages/api/admin/ai-generate.ts` | Replace `as any` with type params | AC-US1-04 |
| `src/lib/auth.ts` | Add session.cookie config | AC-US2-01,02,03 |
| `src/lib/business-logic.test.ts` | Add sanitizeSearchTerm tests | AC-US3-01 |
| `src/lib/security.test.ts` | Add escapeHtml tests | AC-US3-02 |
| `src/lib/subscription-expiry.test.ts` | Add getPlanLimits tests | AC-US3-03 |
| `src/components/islands/ErrorBoundary.astro` | New component | AC-US4-01 |
| `src/components/islands/HomepageContent.astro` | Wrap with ErrorBoundary | AC-US4-02 |
| `src/components/islands/BusinessList.astro` | Wrap with ErrorBoundary | AC-US4-03 |

---

## Verification

1. Run `npx tsc --noEmit` — no type errors
2. Run `npx vitest run` — all tests pass
3. Check auth.ts cookie config is present
4. Verify error boundary renders on test page

---

## Dependencies

- None — uses existing test infrastructure (Vitest)
- No new packages required