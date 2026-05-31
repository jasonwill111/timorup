---
id: US-002
feature: FS-009
title: "Expired Business State Detection (P1)"
status: completed
priority: P1
created: 2026-04-19T00:00:00.000Z
tldr: "**As a** the system."
project: TimorLink
---

# US-002: Expired Business State Detection (P1)

**Feature**: [FS-009](./FEATURE.md)

**As a** the system
**I want** to detect subscription expiration from API response
**So that** the expired modal displays correctly

---

## Acceptance Criteria

- [x] **AC-US2-01**: API response includes `isSubscriptionActive` boolean field
- [x] **AC-US2-02**: Frontend checks `isSubscriptionActive` before rendering content
- [x] **AC-US2-03**: Expired status displays "Expired" badge in red

---

## Implementation

**Increment**: [0009-expired-business-modal](../../../../../increments/0009-expired-business-modal/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
