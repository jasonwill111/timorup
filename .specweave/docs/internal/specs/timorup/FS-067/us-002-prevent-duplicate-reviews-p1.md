---
id: US-002
feature: FS-067
title: "Prevent Duplicate Reviews (P1)"
status: completed
priority: P1
created: 2026-05-19
tldr: "**As a** system."
project: timorup
---

# US-002: Prevent Duplicate Reviews (P1)

**Feature**: [FS-067](./FEATURE.md)

**As a** system
**I want** to enforce UNIQUE constraint on `reviews(user_id, business_id)`
**So that** users cannot submit multiple reviews for the same business

---

## Acceptance Criteria

- [x] **AC-US2-01**: UNIQUE index `reviews_user_business_idx` exists on D1
- [x] **AC-US2-02**: Attempting to create duplicate review returns error
- [x] **AC-US2-03**: Existing duplicate data is cleaned up before adding constraint

---

## Implementation

**Increment**: [0067-d1-schema-fix](../../../../../increments/0067-d1-schema-fix/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
