---
id: US-003
feature: FS-029
title: "Role Management UI"
status: not_started
priority: P1
created: 2026-05-07
tldr: "**As a** super_admin."
project: timorlist
---

# US-003: Role Management UI

**Feature**: [FS-029](./FEATURE.md)

**As a** super_admin
**I want** to view and edit user roles
**So that** I can assign appropriate access levels

---

## Acceptance Criteria

- [ ] **AC-US3-01**: `/admin/users` page shows role badge for each user
- [ ] **AC-US3-02**: Dropdown to change role on each user row (super_admin only)
- [ ] **AC-US3-03**: API endpoint `PATCH /api/admin/users/[id]/role` updates role
- [ ] **AC-US3-04**: Role change requires super_admin auth check
- [ ] **AC-US3-05**: Cannot demote own super_admin role (self-protection)
- [ ] **AC-US3-06**: Success/error toast on role change

---

## Implementation

**Increment**: [0029-role-based-auth](../../../../../increments/0029-role-based-auth/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
