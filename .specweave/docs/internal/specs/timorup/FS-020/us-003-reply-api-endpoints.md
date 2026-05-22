---
id: US-003
feature: FS-020
title: "Reply API endpoints"
status: completed
priority: P2
created: 2026-04-30
tldr: "**As a** developer **I want** CRUD endpoints **So that** the frontend can use them."
project: TimorLink
---

# US-003: Reply API endpoints

**Feature**: [FS-020](./FEATURE.md)

**As a** developer **I want** CRUD endpoints **So that** the frontend can use them

---

## Acceptance Criteria

- [x] **AC-US3-01**: `POST /api/reviews/:id/reply` accepts `{ comment: string }`
- [x] **AC-US3-02**: `PUT /api/reviews/:id/reply` updates existing reply
- [x] **AC-US3-03**: `DELETE /api/reviews/:id/reply` deletes user's reply
- [x] **AC-US3-04**: `GET /api/reviews?businessPageId=X` returns reviews with reply data
- [x] **AC-US3-05**: `GET /api/admin/reviews` returns all reviews with search/filter
- [x] **AC-US3-06**: `DELETE /api/admin/reviews/:id` deletes review and updates rating

---

## Implementation

**Increment**: [0020-review-management](../../../../../increments/0020-review-management/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
