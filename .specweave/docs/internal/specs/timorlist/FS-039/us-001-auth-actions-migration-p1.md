---
id: US-001
feature: FS-039
title: "Auth Actions Migration (P1)"
status: not_started
priority: P1
created: 2026-05-09
tldr: "**As a** developer."
project: timorlist
---

# US-001: Auth Actions Migration (P1)

**Feature**: [FS-039](./FEATURE.md)

**As a** developer
**I want** auth endpoints migrated to Server Actions
**So that** type-safe form submission replaces REST API calls

---

## Acceptance Criteria

- [ ] **AC-US1-01**: signUp action accepts email/password/name via FormData
- [ ] **AC-US1-02**: signIn action validates credentials and returns session
- [ ] **AC-US1-03**: signOut action clears session cookie
- [ ] **AC-US1-04**: verifyEmail action marks email as verified
- [ ] **AC-US1-05**: forgotPassword action sends reset email
- [ ] **AC-US1-06**: resetPassword action updates password with token

---

## Implementation

**Increment**: [0039-server-actions-migration](../../../../../increments/0039-server-actions-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
