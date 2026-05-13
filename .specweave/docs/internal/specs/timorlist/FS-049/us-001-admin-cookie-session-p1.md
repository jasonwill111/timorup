---
id: US-001
feature: FS-049
title: "Admin Cookie Session (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** admin user."
project: timorlist
---

# US-001: Admin Cookie Session (P1)

**Feature**: [FS-049](./FEATURE.md)

**As a** admin user
**I want** my session stored in httpOnly cookie
**So that** XSS attacks cannot steal my session token

---

## Acceptance Criteria

- [x] **AC-US1-01**: Admin login sets httpOnly cookie, NOT localStorage
- [x] **AC-US1-02**: Cookie has Secure + SameSite=Strict flags
- [x] **AC-US1-03**: Admin logout clears the cookie
- [x] **AC-US1-04**: Session cookie expires after 24 hours

---

## Implementation

**Increment**: [0049-0040-admin-auth-cookie-middleware](../../../../../increments/0049-0040-admin-auth-cookie-middleware/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
