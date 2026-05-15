---
id: US-003
feature: FS-041
title: "Replace Admin Dashboard Chart Data `any`"
status: completed
priority: P1
created: 2026-05-10T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-003: Replace Admin Dashboard Chart Data `any`

**Feature**: [FS-041](./FEATURE.md)

**As a** developer
**I want** the admin dashboard chart rendering to use typed interfaces
**So that** chart data transformations are type-safe

---

## Acceptance Criteria

- [x] **AC-US3-01**: Chart data arrays use typed interfaces `(m: MonthlyData) => ...` instead of `(m: any) => ...`
- [x] **AC-US3-02**: Subscription map uses `Subscription` type instead of `sub: any`

---

## Implementation

**Increment**: [0041-type-safety-cleanup](../../../../../increments/0041-type-safety-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
