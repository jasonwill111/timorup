---
id: US-002
feature: FS-062
title: "Consistent Entity Type Validation"
status: completed
priority: P1
created: 2026-05-18
tldr: "**As a** API consumer."
project: TimorLink
---

# US-002: Consistent Entity Type Validation

**Feature**: [FS-062](./FEATURE.md)

**As a** API consumer
**I want** clear error messages when passing invalid table names
**So that** I can debug integration issues quickly

---

## Acceptance Criteria

- [x] **AC-US2-01**: API returns `{ success: false, error: { message: 'Invalid table. Valid values: business, non_profit, public_sector, listing' } }` for invalid table
- [x] **AC-US2-02**: `isValidEntityType` function validates `table` parameter against allowed values (replaced Zod with function-based validation)

---

## Implementation

**Increment**: [0062-category-api-typed-mapping](../../../../../increments/0062-category-api-typed-mapping/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
