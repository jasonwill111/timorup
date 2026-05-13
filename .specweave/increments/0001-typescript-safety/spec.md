# SPEC.md — 0001-typescript-safety

**Project**: timorlist
**Type**: refactor
**Status**: in-progress

---

## User Stories

### US-001: Remove `as any` Type Assertions (HIGH)
**As a** developer
**I want** all Drizzle ORM queries to use proper type annotations
**So that** TypeScript strict mode catches type errors at compile time

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/pages/api/businesses/index.ts` — Remove 3 `as any` casts, use `SQL[]` condition array
- [x] **AC-US1-02**: `src/pages/api/non-profits/index.ts` — Remove 3 `as any` casts, use `SQL[]` condition array
- [x] **AC-US1-03**: `src/pages/api/public-sectors/index.ts` — Remove 3 `as any` casts, use `SQL[]` condition array
- [x] **AC-US1-04**: `src/pages/api/admin/ai-generate.ts` — Remove 2 `as any` casts, use proper type parameters

---

### US-002: Verify better-auth Session Cookie Config (MEDIUM)
**As a** security engineer
**I want** session cookies to have proper security flags
**So that** the app is protected against XSS and CSRF attacks

**Acceptance Criteria**:
- [x] **AC-US2-01**: `src/lib/auth.ts` — Add explicit `session.cookie` config with `httpOnly: true`, `secure: true`, `sameSite: 'lax'`
- [x] **AC-US2-02**: Session cookie maxAge set to 7 days (604800 seconds)
- [x] **AC-US2-03**: AUTH_SECRET validation at startup (minimum 32 characters)

---

### US-003: Improve Test Coverage (MEDIUM)
**As a** QA engineer
**I want** critical code paths to have unit test coverage
**So that** refactoring doesn't introduce regressions

**Acceptance Criteria**:
- [x] **AC-US3-01**: Add tests for `sanitizeSearchTerm()` function
- [x] **AC-US3-02**: Add tests for `escapeHtml()` and `escapeHtmlServer()`
- [x] **AC-US3-03**: Add tests for `getPlanLimits()` subscription logic

---

### US-004: Add Error Boundary Components (LOW)
**As a** frontend engineer
**I want** critical pages to have error boundaries
**So that** users see friendly error messages instead of blank screens

**Acceptance Criteria**:
- [x] **AC-US4-01**: Create `src/components/islands/ErrorBoundary.astro` component
- [x] **AC-US4-02**: Wrap `HomepageContent.astro` with ErrorBoundary
- [x] **AC-US4-03**: Wrap `BusinessList.astro` with ErrorBoundary

---

## Technical Context

### Tech Stack
- **Framework**: Astro 6.2.1 (SSR mode)
- **Runtime**: Cloudflare Workers
- **ORM**: Drizzle ORM 0.45.2
- **Auth**: better-auth 1.6.9
- **Validation**: Zod v4.4.1
- **TypeScript**: 6.0.3 (strict mode enabled)

### Files to Modify
- `src/pages/api/businesses/index.ts`
- `src/pages/api/non-profits/index.ts`
- `src/pages/api/public-sectors/index.ts`
- `src/pages/api/admin/ai-generate.ts`
- `src/lib/auth.ts`
- `src/lib/business-logic.test.ts`
- `src/lib/security.test.ts`
- `src/lib/subscription-expiry.test.ts`
- `src/components/islands/ErrorBoundary.astro`
- `src/components/islands/HomepageContent.astro`
- `src/components/islands/BusinessList.astro`

### Constraints
- Must maintain backward compatibility with existing API contracts
- All tests must pass after changes
- No performance regression in DB queries

---

## Dependencies
None — this is a standalone refactor increment.

---

## Out of Scope
- Database schema changes
- API endpoint additions
- UI/UX changes beyond error boundaries