---
id: US-004
feature: FS-030
title: "SKU Creation After Activation"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** business owner."
project: TimorLink
---

# US-004: SKU Creation After Activation

**Feature**: [FS-030](./FEATURE.md)

**As a** business owner
**I want** to create SKUs only after my business is activated
**So that** I don't waste SKU quota before business is live

---

## Acceptance Criteria

- [x] **AC-US4-01**: SKU creation page/API blocked if business `status != 'published'`
- [x] **AC-US4-02**: SKU count limited by plan (Basic=10, Pro=30, Max=60)
- [x] **AC-US4-03**: Error shown if user tries to exceed SKU limit
- [x] **AC-US4-04**: Admin can view and manage any business's SKUs

---

## Implementation

**Increment**: [0030-subscription-workflow](../../../../../increments/0030-subscription-workflow/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

