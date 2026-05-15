---
id: US-003
feature: FS-049
title: "AdminLayout Auth (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** admin page."
project: timorlist
---

# US-003: AdminLayout Auth (P1)

**Feature**: [FS-049](./FEATURE.md)

**As a** admin page
**I want** to read user from `Astro.locals`, not localStorage
**So that** auth is server-side validated

---

## Acceptance Criteria

- [x] **AC-US3-01**: AdminLayout reads user from `Astro.locals.user`
- [x] **AC-US3-02**: All localStorage admin session code removed
- [x] **AC-US3-03**: Unauthenticated users see redirect, not blank page

---

## Implementation

**Increment**: [0049-0040-admin-auth-cookie-middleware](../../../../../increments/0049-0040-admin-auth-cookie-middleware/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
