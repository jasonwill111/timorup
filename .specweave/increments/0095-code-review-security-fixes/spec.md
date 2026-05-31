---
increment: 0095-code-review-security-fixes
title: "Code Review Security Fixes"
type: hotfix
priority: P1
status: active
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: Code Review Security Fixes

## Overview

Fix critical and high priority issues from comprehensive code review: XSS vulnerabilities, auth inconsistencies, CSRF protection, TypeScript type safety, error handling, and database optimization.

## User Stories

### US-001: Fix XSS Vulnerability in AI Tools (P1)
**Project**: timorup

**As a** security administrator
**I want** AI-generated content sanitized
**So that** malicious scripts cannot be injected via AI prompts

**Acceptance Criteria**:
- [x] **AC-US1-01**: ai-tools.astro uses DOMPurify for blog content preview
- [x] **AC-US1-02**: ai-tools.astro sanitizes feature titles and descriptions

---

### US-002: Standardize Admin Auth (P2)
**Project**: timorup

**As a** security administrator
**I want** consistent admin authentication patterns
**So that** code is maintainable and auditable

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Document auth patterns in admin-auth.ts
- [ ] **AC-US2-02**: Consider refactoring to always pass cookies explicitly

**Note**: Current auth pattern (`getAdminUser()` without args returning null) IS secure - it fails auth when no cookies. Deferred for documentation improvement.

---

### US-003: Add CSRF Protection (P1)
**Project**: timorup

**As a** security administrator
**I want** CSRF middleware
**So that** cross-site request forgery is prevented

**Acceptance Criteria**:
- [x] **AC-US3-01**: Middleware validates origin for mutation requests
- [x] **AC-US3-02**: POST/PUT/DELETE/PATCH requests checked for CSRF

---

### US-004: Fix TypeScript Type Assertions (P3)
**Project**: timorup

**As a** developer
**I want** no `as any` type assertions where avoidable
**So that** type safety is maintained

**Acceptance Criteria**:
- [x] **AC-US4-01**: Window interface declared in global.d.ts
- [ ] **AC-US4-02**: Critical `as any` usages replaced with proper types (deferred - some dynamic Window APIs require type-safe casts)

**Note**: Runtime globals like `window.initTipTapEditor` inherently require type casts. Created global.d.ts with Window interface extensions.

---

### US-005: Add Missing try/catch (P2)
**Project**: timorup

**As a** developer
**I want** proper error handling in admin actions
**So that** database errors are handled gracefully

**Acceptance Criteria**:
- [ ] **AC-US5-01**: All database operations wrapped in try/catch
- [ ] **AC-US5-02**: Errors return createErrorResponse with proper codes

---

### US-006: Add Missing Database Indexes (P2)
**Project**: timorup

**As a** developer
**I want** database indexes on foreign keys
**So that** query performance is optimized

**Acceptance Criteria**:
- [ ] **AC-US6-01**: Indexes added for businesses.ownerId, categoryId
- [ ] **AC-US6-02**: Indexes added for products.businessId, media.entityId

---

### US-007: Console.log Cleanup (P3)
**Project**: timorup

**As a** developer
**I want** no console.log in production code
**So that** logs are clean and structured

**Acceptance Criteria**:
- [ ] **AC-US7-01**: All console.log statements removed or replaced with LOG_LEVEL check

---

### US-008: Optimize N+1 Query in Cleanup (P3)
**Project**: timorup

**As a** developer
**I want** batched database deletes
**So that** cleanup script is efficient

**Acceptance Criteria**:
- [ ] **AC-US8-01**: Cleanup script uses inArray for batch deletes
- [ ] **AC-US8-02**: No N+1 query pattern in _cleanup.ts