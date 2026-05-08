---
id: US-001
feature: FS-029
title: "Permission Model Definition"
status: not_started
priority: P1
created: 2026-05-07
tldr: "**As a** system architect."
project: timorlist
---

# US-001: Permission Model Definition

**Feature**: [FS-029](./FEATURE.md)

**As a** system architect
**I want** a clear 4-tier permission model
**So that** each role has explicit, non-overlapping capabilities

---

## Acceptance Criteria

- [ ] **AC-US1-01**: `user` role: read own listings, manage own content
- [ ] **AC-US1-02**: `editor` role: create/edit/delete own listings + products
- [ ] **AC-US1-03**: `admin` role: full CRUD on all listings, products, categories, banners, media, reviews, skus, blogs, subscriptions
- [ ] **AC-US1-04**: `super_admin` role: admin + user role management + AI tools access
- [ ] **AC-US1-05**: Permission constants centralized in `src/lib/permissions.ts`

---

## Implementation

**Increment**: [0029-role-based-auth](../../../../../increments/0029-role-based-auth/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
