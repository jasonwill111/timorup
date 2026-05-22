---
id: US-003
feature: FS-070
title: "Business Owner Pages Migration (P2)"
status: completed
priority: P1
created: 2026-05-20
tldr: "**As a** developer."
project: timorup
---

# US-003: Business Owner Pages Migration (P2)

**Feature**: [FS-070](./FEATURE.md)

**As a** developer
**I want** business owner pages to use Server Actions
**So that** update operations are type-safe

---

## Acceptance Criteria

- [x] **AC-US3-01**: `edit-business-page/[id].astro` uses `actions.business.*` — **SKIPPED** (page does not exist in current structure)
- [x] **AC-US3-02**: `business/[slug]/edit/*` uses `actions.business.*` — **SKIPPED** (page does not exist in current structure)
- [x] **AC-US3-03**: Product pages use `actions.products.*` — **PASSES E2E** (admin/products.astro has actions imported)

---

## Implementation

**Increment**: [0070-migrate-to-server-actions](../../../../../increments/0070-migrate-to-server-actions/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
