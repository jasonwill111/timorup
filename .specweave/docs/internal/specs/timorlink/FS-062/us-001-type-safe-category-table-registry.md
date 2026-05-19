---
id: US-001
feature: FS-062
title: "Type-Safe Category Table Registry"
status: completed
priority: P1
created: 2026-05-18
tldr: "**As a** developer."
project: TimorLink
---

# US-001: Type-Safe Category Table Registry

**Feature**: [FS-062](./FEATURE.md)

**As a** developer
**I want** a typed table registry with consistent entity type naming
**So that** I can safely switch between category tables without runtime errors

---

## Acceptance Criteria

- [x] **AC-US1-01**: Define `EntityType` union type: `'business' | 'non_profit' | 'public_sector' | 'listing'`
- [x] **AC-US1-02**: Create `CategoryTableRegistry` interface with typed `TABLE_MAP`
- [x] **AC-US1-03**: Update admin categories API to use typed registry
- [x] **AC-US1-04**: TypeScript compiles with 0 errors after refactor

---

## Implementation

**Increment**: [0062-category-api-typed-mapping](../../../../../increments/0062-category-api-typed-mapping/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

