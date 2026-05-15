---
increment: 0049-0040-admin-auth-cookie-middleware
title: Admin Auth Cookie + Middleware
type: feature
priority: P1
status: completed
completed: 2026-05-13
created: 2026-05-13T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Auth Cookie + Middleware

## Overview

Replace insecure localStorage admin auth with httpOnly cookie-based sessions. Create Astro middleware for centralized auth validation.

## User Stories

### US-001: Admin Cookie Session (P1)
**Project**: timorlist

**As a** admin user
**I want** my session stored in httpOnly cookie
**So that** XSS attacks cannot steal my session token

**Acceptance Criteria**:
- [x] **AC-US1-01**: Admin login sets httpOnly cookie, NOT localStorage
- [x] **AC-US1-02**: Cookie has Secure + SameSite=Strict flags
- [x] **AC-US1-03**: Admin logout clears the cookie
- [x] **AC-US1-04**: Session cookie expires after 24 hours

### US-002: Centralized Auth Middleware (P1)
**Project**: timorlist

**As a** server
**I want** auth validation in one place
**So that** 52 admin pages don't duplicate auth logic

**Acceptance Criteria**:
- [x] **AC-US2-01**: `src/middleware/index.ts` validates admin session
- [x] **AC-US2-02**: Middleware injects user into `Astro.locals`
- [x] **AC-US2-03**: Unauthenticated requests to `/admin/*` redirect to `/admin/login`
- [x] **AC-US2-04**: Auth check runs BEFORE page renders

### US-003: AdminLayout Auth (P1)
**Project**: timorlist

**As a** admin page
**I want** to read user from `Astro.locals`, not localStorage
**So that** auth is server-side validated

**Acceptance Criteria**:
- [x] **AC-US3-01**: AdminLayout reads user from `Astro.locals.user`
- [x] **AC-US3-02**: All localStorage admin session code removed
- [x] **AC-US3-03**: Unauthenticated users see redirect, not blank page

## Functional Requirements

### FR-001: Login Action
- Accept email + password
- Validate against users table (role = 'admin')
- Set httpOnly cookie with session token
- Return user object (not token)

### FR-002: Logout Action
- Clear the session cookie
- Redirect to `/admin/login`

### FR-003: Middleware
- Check for `admin_session` cookie
- Validate session exists in sessions table
- Set `Astro.locals.user` and `Astro.locals.isAdmin`
- Block `/admin/*` routes without valid session (except `/admin/login`)

### FR-004: Session Table
- Store session token, userId, expiresAt
- Use existing sessions table from auth schema

## Out of Scope

- OAuth / social login for admins
- Two-factor authentication
- Session enumeration prevention (beyond httpOnly)
- Rate limiting on login (handled in separate increment)

## Dependencies

- Better Auth session handling (existing)
- sessions table (existing in db/schema)
- users table with role field (existing)

## Implementation Notes

```
src/
├── middleware/
│   └── index.ts          # NEW: Admin auth middleware
├── actions/
│   └── admin/
│       ├── login.ts     # MOD: Set cookie, not localStorage
│       └── logout.ts    # MOD: Clear cookie
├── layouts/
│   └── AdminLayout.astro # MOD: Use Astro.locals
└── pages/admin/
    ├── login.astro      # MOD: Remove localStorage
    └── *.astro          # MOD: Remove localStorage checks
```
