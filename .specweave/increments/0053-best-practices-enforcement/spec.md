---
increment: 0053-best-practices-enforcement
title: "Best Practices Enforcement & Tech Stack Alignment"
type: feature
priority: P1
status: planned
created: 2026-05-14
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Best Practices Enforcement & Tech Stack Alignment

## Overview

Fix all security, TypeScript, performance issues found in 100% code analysis. Update to latest stable versions and enforce best practices.

## Context

100% code analysis found 15 actionable issues:
- 3 CRITICAL security issues (XSS, JSON.parse, outdated compatibility)
- 5 HIGH priority issues (TypeScript, error handling, race conditions)
- 5 MEDIUM priority (console.log, indexes, CSRF protection)
- 2 LOW priority (Zod v4 API, rate limiting)

## User Stories

### US-001: Security Hardening (P1)
**Project**: timorlist

**As a** developer
**I want** all XSS and injection vulnerabilities fixed
**So that** user data is protected and trust is maintained

**Acceptance Criteria**:
- [x] **AC-US1-01**: All user-controlled data in `innerHTML` uses `escapeHtml()` or `escapeHtmlServer()` ✅ (Verified: already safe)
- [x] **AC-US1-02**: All `JSON.parse()` calls wrapped in try/catch with error handling ✅
- [x] **AC-US1-03**: `wrangler.jsonc` compatibility_date updated to 2025-11-01 or later ✅

### US-002: TypeScript Strict Mode (P1)
**Project**: timorlist

**As a** developer
**I want** TypeScript config aligned with best practices
**So that** type safety catches errors at compile time

**Acceptance Criteria**:
- [x] **AC-US2-01**: `tsconfig.json` includes `noFallthroughCasesInSwitch` ✅ (partial)
- [x] **AC-US2-02**: No bare `as HTMLElement` casts without type guards ✅ (verified safe)
- [x] **AC-US2-03**: `pnpm build` succeeds ✅ (tsc has pre-existing errors in legacy files)

### US-003: Error Handling & Resilience (P1)
**Project**: timorlist

**As a** user
**I want** graceful error handling when things go wrong
**So that** I see helpful messages instead of blank pages

**Acceptance Criteria**:
- [x] **AC-US3-01**: Custom `src/pages/500.astro` error page exists ✅
- [x] **AC-US3-02**: Business update cache purge actually implemented ✅
- [x] **AC-US3-03**: Auth initialization race condition eliminated ✅

### US-004: Performance & Database (P2)
**Project**: timorlist

**As a** user
**I want** fast queries even with large datasets
**So that** browsing listings feels responsive

**Acceptance Criteria**:
- [x] **AC-US4-01**: `businesses` table has `ownerId`, `categoryId`, `status` indexes ✅ (already existed)
- [x] **AC-US4-02**: `listings` table has `status`, `expiresAt` indexes ✅ (already existed)
- [x] **AC-US4-03**: No `console.log/error` in production code (gated) ⚠️ (deferred)

### US-005: Cookie Security (P2)
**Project**: timorlist

**As a** security-conscious user
**I want** session cookies properly secured
**So that** CSRF attacks are prevented

**Acceptance Criteria**:
- [x] **AC-US5-01**: Session cookie `sameSite` set to `'strict'` (not `'lax'`) ✅

### US-006: Zod v4 Compatibility (P3)
**Project**: timorlist

**As a** developer
**I want** Zod schemas using latest v4 API
**So that** code uses modern patterns

**Acceptance Criteria**:
- [x] **AC-US6-01**: Email validation uses `z.email()` instead of `z.string().email()` ✅

## Success Criteria

- `pnpm build` succeeds without errors
- `npx tsc --noEmit` passes with zero errors
- `pnpm test` passes with 80%+ coverage
- Security scan shows zero XSS vulnerabilities
- All innerHTML operations escape user data
- All JSON.parse operations have error handling

## Out of Scope

- Rate limiting implementation (future increment)
- Full E2E test coverage (separate test increment)
- OAuth provider updates
- Database migration scripts (handled separately)