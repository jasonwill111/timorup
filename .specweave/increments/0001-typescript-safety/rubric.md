# RUBRIC.md â€?0001-typescript-safety

**Project**: TimorLink
**Status**: in-progress

---

## Quality Contract

### Type Safety (AC-US1-01 to US1-04)
| Check | Criteria | Pass |
|-------|-----------|------|
| TSC | `npx tsc --noEmit` exits 0 | Required |
| No `as any` | `grep -r "as any" src/pages/api/` returns empty | Required |
| Condition pattern | `SQL[]` array used for dynamic conditions | Required |

### Auth Security (AC-US2-01 to US2-03)
| Check | Criteria | Pass |
|-------|-----------|------|
| httpOnly | `session.cookie.httpOnly === true` | Required |
| secure | `session.cookie.secure` is environment-aware | Required |
| sameSite | `session.cookie.sameSite === 'lax'` | Required |
| maxAge | `session.cookie.maxAge === 604800` | Required |
| AUTH_SECRET | Throws if < 32 chars at startup | Required |

### Test Coverage (AC-US3-01 to US3-03)
| Check | Criteria | Pass |
|-------|-----------|------|
| sanitizeSearchTerm | Tests: trim, SQL wildcards, empty, truncation | Required |
| escapeHtml | Tests: XSS payloads, quotes, null handling | Required |
| getPlanLimits | Tests: skuLimit, maxBusinessImages, grace period | Required |
| All tests | `npx vitest run` passes | Required |

### Error Boundaries (AC-US4-01 to US4-03)
| Check | Criteria | Pass |
|-------|-----------|------|
| Component exists | `ErrorBoundary.astro` file exists | Required |
| Homepage wrapped | `HomepageContent.astro` imports ErrorBoundary | Required |
| BusinessList wrapped | `BusinessList.astro` imports ErrorBoundary | Required |
| Fallback UI | Error boundary shows message on throw | Required |

---

## Verification Commands

```bash
# 1. TypeScript check
npx tsc --noEmit

# 2. No "as any" in API routes
grep -rn "as any" src/pages/api/

# 3. Run tests
npx vitest run

# 4. Verify auth cookie config
grep -A 10 "session:" src/lib/auth.ts | grep -E "httpOnly|secure|sameSite|maxAge"
```

---

## Quality Gates

All ACs must pass before increment can be closed:
- [ ] AC-US1-01 to AC-US1-04: TypeScript compiles
- [ ] AC-US2-01 to AC-US2-03: Auth config verified
- [ ] AC-US3-01 to AC-US3-03: Tests pass
- [ ] AC-US4-01 to AC-US4-03: Error boundaries implemented

---

## Scope Boundaries

**In scope**: Type safety fixes, auth config, test coverage, error boundaries
**Out of scope**: DB schema changes, new API endpoints, UI/UX changes (beyond error fallback)
