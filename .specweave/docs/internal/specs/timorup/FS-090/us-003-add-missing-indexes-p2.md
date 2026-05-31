---
id: US-003
feature: FS-090
title: "Add Missing Indexes (P2)"
status: not_started
priority: P1
created: 2026-05-29
tldr: "**As a** developer."
project: timorup
---

# US-003: Add Missing Indexes (P2)

**Feature**: [FS-090](./FEATURE.md)

**As a** developer
**I want** frequently queried columns indexed
**So that** query performance is optimized

---

## Acceptance Criteria

- [ ] **AC-US3-01**: `latest_updates` table has (typeId, createdAt) index
- [ ] **AC-US3-02**: `reviews` table has (businessId, status) index
- [ ] **AC-US3-03**: `listings` table has (ownerId) index

---

## Implementation

**Increment**: [0090-db-optimization](../../../../../increments/0090-db-optimization/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
