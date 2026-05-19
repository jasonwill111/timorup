---
id: US-002
feature: FS-029
title: "Role-Based Admin Sidebar"
status: not_started
priority: P1
created: 2026-05-07
tldr: "**As a** logged-in admin user."
project: TimorLink
---

# US-002: Role-Based Admin Sidebar

**Feature**: [FS-029](./FEATURE.md)

**As a** logged-in admin user
**I want** to see only menu items I have permission to access
**So that** I don't see confusing unauthorized options

---

## Acceptance Criteria

- [ ] **AC-US2-01**: Sidebar hides "Users" link from non-super_admin roles
- [ ] **AC-US2-02**: Sidebar hides "AI Tools" link from non-super_admin roles
- [ ] **AC-US2-03**: Sidebar shows "Categories" and "Heroes" only to admin+
- [ ] **AC-US2-04**: Sidebar shows "Subscriptions" and "Reviews" only to admin+
- [ ] **AC-US2-05**: Logged-in user role displayed in sidebar footer
- [ ] **AC-US2-06**: Sidebar component lazy-loads role check (client-side session read)

---

## Implementation

**Increment**: [0029-role-based-auth](../../../../../increments/0029-role-based-auth/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

