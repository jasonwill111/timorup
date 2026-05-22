---
id: US-002
feature: FS-069
title: "Unified Config API (P1)"
status: completed
priority: P1
created: 2026-05-22
tldr: "**As a** developer."
project: timorup
---

# US-002: Unified Config API (P1)

**Feature**: [FS-069](./FEATURE.md)

**As a** developer
**I want** a single `productConfig` object with all configuration access
**So that** I don't need to import scattered functions and data

---

## Acceptance Criteria

- [x] **AC-US2-01**: `productConfig.getPriceUnits(type)` returns filtered price units
- [x] **AC-US2-02**: `productConfig.getSpecificationFields(type)` returns spec fields for type
- [x] **AC-US2-03**: `productConfig.allTypes()` returns all valid ProductType values
- [x] **AC-US2-04**: Invalid types return empty arrays (graceful fallback)

---

## Implementation

**Increment**: [0069-refactor-product-config](../../../../../increments/0069-refactor-product-config/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
