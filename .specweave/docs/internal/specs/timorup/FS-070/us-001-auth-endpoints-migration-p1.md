---
id: US-001
feature: FS-070
title: "Auth Endpoints Migration (P1)"
status: completed
priority: P1
created: 2026-05-22
tldr: "**As a** developer."
project: timorup
---

# US-001: Auth Endpoints Migration (P1)

**Feature**: [FS-070](./FEATURE.md)

**As a** developer
**I want** all authentication endpoints to use Server Actions
**So that** type safety is maintained and code is unified

---

## Acceptance Criteria

- [x] **AC-US1-01**: `login.astro` uses `actions.auth.signIn()` instead of `fetch('/api/auth/sign-in')` — **PASSES E2E**
- [x] **AC-US1-02**: `signup.astro` uses `actions.auth.signUp()` instead of `fetch('/api/auth/sign-up')` — **PASSES E2E** (page is register.astro)
- [x] **AC-US1-03**: `admin/login.astro` uses `actions.auth.signIn()` instead of `fetch()` — **PASSES E2E**
- [x] **AC-US1-04**: Sign-out uses `actions.auth.signOut()` (if fetch used) — **PASSES E2E**

---

## Implementation

**Increment**: [0070-migrate-to-server-actions](../../../../../increments/0070-migrate-to-server-actions/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
