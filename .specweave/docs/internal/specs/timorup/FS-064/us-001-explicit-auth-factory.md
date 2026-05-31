---
id: US-001
feature: FS-064
title: "Explicit Auth Factory"
status: completed
priority: P1
created: 2026-05-18
tldr: "**As a** developer."
project: TimorLink
---

# US-001: Explicit Auth Factory

**Feature**: [FS-064](./FEATURE.md)

**As a** developer
**I want** to create auth instances via factory
**So that** I can test without global state

---

## Acceptance Criteria

- [x] **AC-US1-01**: `createAuthFactory()` returns factory function
- [x] **AC-US1-02**: Factory accepts db and env, returns auth instance
- [x] **AC-US1-03**: No global singleton for auth instance

---

## Implementation

**Increment**: [0064-auth-module-separate-concerns](../../../../../increments/0064-auth-module-separate-concerns/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
