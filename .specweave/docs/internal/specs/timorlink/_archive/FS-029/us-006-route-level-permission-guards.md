---
id: US-006
feature: FS-029
title: "Route-Level Permission Guards"
status: not_started
priority: P1
created: 2026-05-07
tldr: "**As a** security system."
project: TimorLink
---

# US-006: Route-Level Permission Guards

**Feature**: [FS-029](./FEATURE.md)

**As a** security system
**I want** protected routes to redirect unauthorized users
**So that** no one accesses admin pages without proper role

---

## Acceptance Criteria

- [ ] **AC-US6-01**: `/admin/*` routes redirect to `/admin/login` if no session
- [ ] **AC-US6-02**: `/admin/users` redirects to dashboard if not super_admin
- [ ] **AC-US6-03**: `/admin/ai-tools` redirects to dashboard if not super_admin
- [ ] **AC-US6-04**: API endpoints return 403 for insufficient role (not just 401)

---

## Implementation

**Increment**: [0029-role-based-auth](../../../../../increments/0029-role-based-auth/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

