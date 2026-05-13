---
id: US-001
feature: FS-001
title: "Remove `as any` Type Assertions (HIGH)"
status: not_started
priority: P1
created: 2026-05-13
tldr: "**As a** developer."
project: timorlist
---

# US-001: Remove `as any` Type Assertions (HIGH)

**Feature**: [FS-001](./FEATURE.md)

**As a** developer
**I want** all Drizzle ORM queries to use proper type annotations
**So that** TypeScript strict mode catches type errors at compile time

---

## Acceptance Criteria

- [ ] **AC-US1-01**: `src/pages/api/businesses/index.ts` — Remove 3 `as any` casts, use `SQL[]` condition array
- [ ] **AC-US1-02**: `src/pages/api/non-profits/index.ts` — Remove 3 `as any` casts, use `SQL[]` condition array
- [ ] **AC-US1-03**: `src/pages/api/public-sectors/index.ts` — Remove 3 `as any` casts, use `SQL[]` condition array
- [ ] **AC-US1-04**: `src/pages/api/admin/ai-generate.ts` — Remove 2 `as any` casts, use proper type parameters

---

## Implementation

**Increment**: [0001-typescript-safety](../../../../../increments/0001-typescript-safety/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
