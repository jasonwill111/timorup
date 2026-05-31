---
id: US-003
feature: FS-069
title: "Caller Migration (P1)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** developer."
project: timorup
---

# US-003: Caller Migration (P1)

**Feature**: [FS-069](./FEATURE.md)

**As a** developer
**I want** existing code to work without changes
**So that** migration is smooth and low-risk

---

## Acceptance Criteria

- [x] **AC-US3-01**: `getPriceUnitsForServiceType()` deprecated but still functional
- [x] **AC-US3-02**: `PRICE_UNITS` and `SKU_SERVICE_TYPES` still exported from constants.ts
- [x] **AC-US3-03**: `products.astro` uses new `productConfig` API
- [x] **AC-US3-04**: TypeScript compilation passes with no errors

---

## Implementation

**Increment**: [0069-refactor-product-config](../../../../../increments/0069-refactor-product-config/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
