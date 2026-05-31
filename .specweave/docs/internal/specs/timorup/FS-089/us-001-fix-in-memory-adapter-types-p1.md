---
id: US-001
feature: FS-089
title: "Fix In-Memory Adapter Types (P1)"
status: completed
priority: P1
created: 2026-05-29
tldr: "**As a** developer."
project: timorup
---

# US-001: Fix In-Memory Adapter Types (P1)

**Feature**: [FS-089](./FEATURE.md)

**As a** developer
**I want** in-memory adapter to use proper return types
**So that** TypeScript catches type errors at compile time

---

## Acceptance Criteria

- [x] **AC-US1-01**: `select()` method returns typed query builder
- [x] **AC-US1-02**: `insert()`, `update()`, `delete()` methods return proper types
- [x] **AC-US1-03**: `from()` and `values()` methods use proper generics

---

## Implementation

**Increment**: [0089-typescript-safety](../../../../../increments/0089-typescript-safety/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
