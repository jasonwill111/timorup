---
id: US-004
feature: FS-029
title: "Sign-Up Page"
status: not_started
priority: P1
created: 2026-05-07
tldr: "**As a** new user."
project: timorlist
---

# US-004: Sign-Up Page

**Feature**: [FS-029](./FEATURE.md)

**As a** new user
**I want** to register an account
**So that** I can create and manage my business listings

---

## Acceptance Criteria

- [ ] **AC-US4-01**: `/auth/sign-up` page with name, email, password fields
- [ ] **AC-US4-02**: Client-side validation (email format, password min 8 chars)
- [ ] **AC-US4-03**: POST to `/api/auth/sign-up` creates user with `role: 'user'`
- [ ] **AC-US4-04**: Redirect to `/admin` on success
- [ ] **AC-US4-05**: Error display on failure (email taken, etc.)
- [ ] **AC-US4-06**: Link from login page to sign-up page

---

## Implementation

**Increment**: [0029-role-based-auth](../../../../../increments/0029-role-based-auth/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
