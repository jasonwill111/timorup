---
id: US-001
feature: FS-066
title: "Type Safety (P1)"
status: not_started
priority: P1
created: 2026-05-18
tldr: "**As a** developer."
project: timorlist
---

# US-001: Type Safety (P1)

**Feature**: [FS-066](./FEATURE.md)

**As a** developer
**I want** all TypeScript errors resolved
**So that** the codebase passes `npx tsc --noEmit` without errors

---

## Acceptance Criteria

- [ ] **AC-US1-01**: `npx tsc --noEmit` returns 0 errors
- [ ] **AC-US1-02**: No `possibly null` errors (TS18047)
- [ ] **AC-US1-03**: No `has no export` errors (TS2339)
- [ ] **AC-US1-04**: No `not assignable` errors (TS2322, TS2769)
- [ ] **AC-US1-05**: Build (`pnpm build`) still passes after fixes

---

## Implementation

**Increment**: [0066-typecheck-fix](../../../../../increments/0066-typecheck-fix/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
