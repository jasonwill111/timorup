---
id: US-004
feature: FS-001
title: "Unit tests for one-business-per-user logic"
status: not_started
priority: P1
created: 2026-03-22
tldr: "Unit tests for one-business-per-user logic"
project: timorbiz
---

# US-004: Unit tests for one-business-per-user logic

**Feature**: [FS-001](./FEATURE.md)

---

## Acceptance Criteria

- [ ] **AC-US4-01**: Unit test: `POST /api/businesses` returns 400 `LIMIT_REACHED` when user already owns a business.
- [ ] **AC-US4-02**: Unit test: `POST /api/businesses` succeeds (201) when user has no existing business.
- [ ] **AC-US4-03**: Unit test: `GET /api/businesses/my-business` returns 404 for a user with no business.
- [ ] **AC-US4-04**: Unit test: `GET /api/businesses/my-business` returns 200 with business data for a user who owns one.

---

## Implementation

**Increment**: [0001-one-business-per-user](../../../../../increments/0001-one-business-per-user/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
