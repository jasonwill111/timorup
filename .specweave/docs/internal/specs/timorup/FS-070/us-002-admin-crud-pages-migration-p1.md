---
id: US-002
feature: FS-070
title: "Admin CRUD Pages Migration (P1)"
status: completed
priority: P1
created: 2026-05-20
tldr: "**As a** developer."
project: timorup
---

# US-002: Admin CRUD Pages Migration (P1)

**Feature**: [FS-070](./FEATURE.md)

**As a** developer
**I want** admin pages to use Server Actions
**So that** form submissions are type-safe and consistent

---

## Acceptance Criteria

- [x] **AC-US2-01**: `admin/blogs.astro` uses `actions.admin.blogs.*` instead of fetch — **PASSES E2E**
- [x] **AC-US2-02**: `admin/categories.astro` uses `actions.admin.categories.*` instead of fetch — **PASSES E2E**
- [x] **AC-US2-03**: `admin/heroes.astro` uses `actions.admin.heroes.*` instead of fetch — **PASSES E2E** (page is ad-banners.astro)
- [x] **AC-US2-04**: `admin/orders.astro` uses `actions.admin.subscriptions.*` instead of fetch — **PASSES E2E**
- [x] **AC-US2-05**: `admin/users.astro` uses `actions.admin.users.*` instead of fetch — **PASSES E2E**

---

## Implementation

**Increment**: [0070-migrate-to-server-actions](../../../../../increments/0070-migrate-to-server-actions/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
