---
id: US-002
feature: FS-020
title: "Admin manages reviews"
status: completed
priority: P2
created: 2026-04-30
tldr: "**As an** admin **I want** to view and delete reviews **So that** I can moderate the platform."
project: timorlist
---

# US-002: Admin manages reviews

**Feature**: [FS-020](./FEATURE.md)

**As an** admin **I want** to view and delete reviews **So that** I can moderate the platform

---

## Acceptance Criteria

- [x] **AC-US2-01**: Admin can view all reviews on `/admin/reviews` page with pagination
- [x] **AC-US2-02**: Admin can search reviews by business name, user name, or comment content
- [x] **AC-US2-03**: Admin can filter reviews by rating (1-5 stars)
- [x] **AC-US2-04**: Admin can filter reviews by date range
- [x] **AC-US2-05**: Admin can delete any review via `DELETE /api/admin/reviews/:id`
- [x] **AC-US2-06**: Delete requires admin session validation
- [x] **AC-US2-07**: Deleted review updates business rating average

---

## Implementation

**Increment**: [0020-review-management](../../../../../increments/0020-review-management/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
