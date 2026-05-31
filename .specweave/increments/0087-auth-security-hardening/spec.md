---
increment: 0087-auth-security-hardening
title: "Auth Security Hardening"
type: feature
priority: P1
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: Auth Security Hardening

## Overview

Fix critical security gaps in auth flow: add rate limiting to signIn/signUp, configure secure cookie flags, add password complexity validation, and standardize error handling.

## User Stories

### US-001: Rate Limit Auth Attempts (P1)
**Project**: timorup

**As a** system administrator
**I want** rate limiting on sign-in and sign-up endpoints
**So that** brute-force attacks are prevented

**Acceptance Criteria**:
- [x] **AC-US1-01**: Sign-in endpoint returns 429 when rate limit exceeded
- [x] **AC-US1-02**: Sign-up endpoint returns 429 when rate limit exceeded
- [x] **AC-US1-03**: Rate limit headers (X-RateLimit-*) included in responses
- [x] **AC-US1-04**: Error response uses standardized ErrorCode.AUTH_RATE_LIMITED

---

### US-002: Configure Secure Cookie Flags (P1)
**Project**: timorup

**As a** security administrator
**I want** session cookies configured with security flags
**So that** session hijacking and CSRF attacks are mitigated

**Acceptance Criteria**:
- [x] **AC-US2-01**: Cookie has `secure: true` flag
- [x] **AC-US2-02**: Cookie has `sameSite: 'strict'` flag
- [x] **AC-US2-03**: Cookie has `httpOnly: true` flag
- [x] **AC-US2-04**: Sign-out clears cookie with secure flags

---

### US-003: Password Complexity Validation (P1)
**Project**: timorup

**As a** security administrator
**I want** password complexity requirements enforced
**So that** weak passwords are rejected at registration

**Acceptance Criteria**:
- [x] **AC-US3-01**: Password requires at least 1 uppercase letter
- [x] **AC-US3-02**: Password requires at least 1 lowercase letter
- [x] **AC-US3-03**: Password requires at least 1 number
- [x] **AC-US3-04**: Password requires at least 1 special character
- [x] **AC-US3-05**: Error message clearly indicates which requirement failed

---

### US-004: Standardize Auth Error Handling (P2)
**Project**: timorup

**As a** developer
**I want** consistent error handling across auth actions
**So that** error responses are predictable and typed

**Acceptance Criteria**:
- [x] **AC-US4-01**: All auth actions use ErrorCode enum (not inline strings)
- [x] **AC-US4-02**: ErrorCode.AUTH_INVALID_CREDENTIALS added for sign-in failures
- [x] **AC-US4-03**: ErrorCode.AUTH_RATE_LIMITED used for rate limit errors

## Functional Requirements

### FR-001: Rate Limiting Integration
- Use existing `checkRateLimitKV()` function from `src/lib/rate-limit.ts`
- Rate limit identifier format: `auth-sign-in:{ip}` and `auth-sign-up:{ip}`
- Return consistent error shape: `{ success: false, error: { code, message, resetIn } }`

### FR-002: Cookie Security Configuration
- better-auth session config: add `cookieConfig` with secure flags
- signOut action: update `cookies.set()` call with `secure: true`
- No domain restriction (allows subdomain sharing)

### FR-003: Password Schema
- Add to `src/lib/schemas/auth.ts`: create `passwordSchema` with all requirements
- Each regex has custom error message
- Re-export from `src/lib/schemas/index.ts`

## Success Criteria

| Metric | Target |
|--------|--------|
| Brute-force attack mitigation | 100% (rate limited) |
| Cookie security flags | Secure + HttpOnly + SameSite: strict |
| Password complexity enforcement | All 4 requirements |
| Error code consistency | 0 inline error strings in auth actions |

## Out of Scope

- Email verification (requires SMTP setup, add later)
- Account lockout after N failed attempts (future enhancement)
- CAPTCHA/bot protection (future enhancement)

## Dependencies

- `src/lib/rate-limit.ts` - existing rate limiting utility
- `src/lib/errors/errorCodes.ts` - existing error code system
- `src/lib/schemas/common.ts` - existing Zod schemas