---
id: US-001
feature: FS-030
title: "One Listing Per User"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** user."
project: TimorLink
---

# US-001: One Listing Per User

**Feature**: [FS-030](./FEATURE.md)

**As a** user
**I want** to create only ONE listing (business OR non-profit)
**So that** system maintains clean data model

---

## Acceptance Criteria

- [x] **AC-US1-01**: User without listing sees both "Business" and "Non-Profit" options when creating
- [x] **AC-US1-02**: User with existing listing sees only their listing type (Business or Non-Profit)
- [x] **AC-US1-03**: Create button disabled/hidden if user already has a listing
- [x] **AC-US1-04**: API prevents creating second listing even if frontend check bypassed

---

## Implementation

**Increment**: [0030-subscription-workflow](../../../../../increments/0030-subscription-workflow/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

