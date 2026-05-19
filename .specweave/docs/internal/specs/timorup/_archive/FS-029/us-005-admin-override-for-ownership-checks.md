---
id: US-005
feature: FS-029
title: "Admin Override for Ownership Checks"
status: not_started
priority: P1
created: 2026-05-07
tldr: "**As a** admin/super_admin."
project: TimorLink
---

# US-005: Admin Override for Ownership Checks

**Feature**: [FS-029](./FEATURE.md)

**As a** admin/super_admin
**I want** to edit any listing regardless of owner
**So that** I can manage content without transfer requests

---

## Acceptance Criteria

- [ ] **AC-US5-01**: `src/lib/business-logic.ts` `canEditBusiness(user, business)` checks role first
- [ ] **AC-US5-02**: admin/super_admin can edit any listing (ownerId check bypassed)
- [ ] **AC-US5-03**: editor can only edit their own listings
- [ ] **AC-US5-04**: `/business/[slug]/edit` page renders edit form for authorized users
- [ ] **AC-US5-05**: `/business/[slug]/products` shows add-product button based on role
- [ ] **AC-US5-06**: All edit/delete API endpoints check role before ownership

---

## Implementation

**Increment**: [0029-role-based-auth](../../../../../increments/0029-role-based-auth/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

