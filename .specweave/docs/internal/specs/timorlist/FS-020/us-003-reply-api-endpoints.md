---
id: US-003
feature: FS-020
title: "Reply API endpoints"
status: not_started
priority: P2
created: 2026-04-30
tldr: "**As a** developer **I want** reply endpoints **So that** the frontend can use them."
project: timorlist
---

# US-003: Reply API endpoints

**Feature**: [FS-020](./FEATURE.md)

**As a** developer **I want** reply endpoints **So that** the frontend can use them

---

## Acceptance Criteria

- [ ] **AC-US3-01**: `POST /api/reviews/:id/reply` accepts `{ comment: string }`
- [ ] **AC-US3-02**: `GET /api/reviews?businessPageId=X` returns reviews with reply data
- [ ] **AC-US3-03**: `DELETE /api/admin/reviews/:id` deletes review and updates rating

---

## Implementation

**Increment**: [0020-review-management](../../../../../increments/0020-review-management/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
