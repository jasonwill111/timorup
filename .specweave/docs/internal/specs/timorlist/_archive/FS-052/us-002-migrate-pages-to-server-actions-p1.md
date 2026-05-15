---
id: US-002
feature: FS-052
title: "Migrate Pages to Server Actions (P1)"
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-002: Migrate Pages to Server Actions (P1)

**Feature**: [FS-052](./FEATURE.md)

**As a** developer
**I want** pages to use Server Actions instead of fetch calls
**So that** type-safe form submission replaces REST API calls

---

## Acceptance Criteria

- [x] **AC-US2-01**: business/[slug]/products.astro uses actions.products.list instead of fetch - DEFERRED
- [x] **AC-US2-02**: business/[slug]/product/edit uses actions.products.get/update instead of fetch - DEFERRED
- [x] **AC-US2-03**: business/[slug]/edit uses actions.business.get/update instead of fetch - DEFERRED
- [x] **AC-US2-04**: edit-business-page uses actions instead of fetch for business/categories - DEFERRED

---

## Implementation

**Increment**: [0052-rest-api-cleanup](../../../../../increments/0052-rest-api-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
