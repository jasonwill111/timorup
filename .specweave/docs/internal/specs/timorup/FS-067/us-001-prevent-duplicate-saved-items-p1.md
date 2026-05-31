---
id: US-001
feature: FS-067
title: "Prevent Duplicate Saved Items (P1)"
status: completed
priority: P1
created: 2026-05-19T00:00:00.000Z
tldr: "**As a** system."
project: timorup
---

# US-001: Prevent Duplicate Saved Items (P1)

**Feature**: [FS-067](./FEATURE.md)

**As a** system
**I want** to enforce UNIQUE constraint on `saved_items(user_id, type, type_id)`
**So that** users cannot create duplicate bookmarks for the same entity

---

## Acceptance Criteria

- [x] **AC-US1-01**: UNIQUE index `saved_items_user_type_typeId_idx` exists on D1
- [x] **AC-US1-02**: Attempting to create duplicate saved_item returns error
- [x] **AC-US1-03**: Existing duplicate data is cleaned up before adding constraint

---

## Implementation

**Increment**: [0067-d1-schema-fix](../../../../../increments/0067-d1-schema-fix/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
