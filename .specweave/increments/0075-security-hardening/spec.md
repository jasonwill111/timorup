---
status: completed
---
# Security & Best Practices Hardening - SPEC

## Project: TimorUp

---

## US-001: Add Astro Middleware with Security Headers

**As a** Security Engineer  
**I want** to add security headers to all HTTP responses  
**So that** the application is protected against common web vulnerabilities (XSS, Clickjacking, MIME sniffing)

**Acceptance Criteria**:
- [x] **AC-US1-01**: Middleware file `src/middleware.ts` created with `onRequest` handler
- [x] **AC-US1-02**: All responses include `X-Content-Type-Options: nosniff` header
- [x] **AC-US1-03**: All responses include `X-Frame-Options: DENY` header
- [x] **AC-US1-04**: All responses include `Referrer-Policy: strict-origin-when-cross-origin` header
- [x] **AC-US1-05**: All responses include `Permissions-Policy: camera=(), microphone=(), geolocation=()` header

---

## US-002: Fix Rate Limit Cleanup Mechanism

**As a** DevOps Engineer  
**I want** the in-memory rate limit store to be periodically cleaned up  
**So that** memory doesn't grow unbounded over time during Worker cold starts

**Acceptance Criteria**:
- [x] **AC-US2-01**: `cleanupRateLimitStore()` function is called on a scheduled basis
- [x] **AC-US2-02**: Cleanup is triggered via wrangler.toml `triggers.crons` or placement `mode: "smart"` setting
- [x] **AC-US2-03**: Unit tests verify cleanup removes expired entries

---

## US-003: Update better-auth-cloudflare to Latest Version

**As a** Developer  
**I want** to update `better-auth-cloudflare` to the latest compatible version  
**So that** I benefit from bug fixes and performance improvements

**Acceptance Criteria**:
- [x] **AC-US3-01**: Run `pnpm info better-auth-cloudflare versions` to check latest version
- [x] **AC-US3-02**: Update package.json with latest compatible version
- [x] **AC-US3-03**: Verify auth flow still works (sign in, sign out, session persistence)
- [x] **AC-US3-04**: E2E tests pass after update

---

## US-004: Fix Auth Sign-In Race Condition

**As a** Developer  
**I want** to refactor the sign-in action to handle edge cases safely  
**So that** users cannot encounter inconsistent states during authentication

**Acceptance Criteria**:
- [x] **AC-US4-01**: Sign-in action handles the case where user is deleted between check and session creation
- [x] **AC-US4-02**: Error handling is improved with specific error codes
- [x] **AC-US4-03**: Unit test covers the edge case scenario

---

## US-005: Verify Tailwind v4 Compatibility

**As a** Developer  
**I want** to confirm all Tailwind v4 features are properly utilized  
**So that** styling is performant and future-proof

**Acceptance Criteria**:
- [x] **AC-US5-01**: Confirm `@import "tailwindcss"` syntax is used (not deprecated `@tailwind` directives)
- [x] **AC-US5-02**: Confirm `@theme` block is used for custom colors/variables
- [x] **AC-US5-03**: No legacy `tailwind.config.js` file exists (v4 uses CSS-first config)
- [x] **AC-US5-04**: Build output confirms Tailwind v4 CSS is generated correctly

---

## US-006: Document Environment Access Pattern

**As a** Developer  
**I want** to clarify the `cloudflare:workers` import pattern for env access  
**So that** it's clear when to use this vs globalThis.env

**Acceptance Criteria**:
- [x] **AC-US6-01**: JSDoc comments added to `src/lib/db.ts` explaining env access pattern
- [x] **AC-US6-02**: JSDoc comments added to `src/lib/auth.ts` explaining env access pattern
- [x] **AC-US6-03**: Verify `cloudflare:workers` import works in both local dev and production

---

## Verification Strategy

### Unit Tests
- `src/lib/rate-limit.test.ts`: Test cleanup logic with mock store

### Integration Tests
- None required for middleware (covered by E2E)

### E2E Tests
- `e2e/auth-flow.spec.ts`: Re-run to verify auth still works after updates
- Manual test: Check browser DevTools for security headers on any page

---

## Dependencies
- None (self-contained refactoring)

## Risks
- **Low**: Changes are additive or refactoring only
- Middleware change may affect response headers expected by tests (update test assertions)
