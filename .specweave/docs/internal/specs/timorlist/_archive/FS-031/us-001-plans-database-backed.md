---
id: US-001
feature: FS-031
title: "Plans Database-Backed"
status: completed
priority: P2
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** system."
project: timorlist
---

# US-001: Plans Database-Backed

**Feature**: [FS-031](./FEATURE.md)

**As a** system
**I want** plans stored in database
**So that** admin can manage them dynamically

---

## Acceptance Criteria

- [x] **AC-US1-01**: Plans table exists with fields: id, name, period, amount, skuLimit, maxImages, maxVideos, features, description, sortOrder, active
- [x] **AC-US1-02**: Initial seed data matches current 6 plans
- [x] **AC-US1-03**: Public `/api/plans` returns active plans sorted by sortOrder

---

## Implementation

**Increment**: [0031-admin-plan-management](../../../../../increments/0031-admin-plan-management/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
