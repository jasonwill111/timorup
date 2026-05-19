---
id: US-007
feature: FS-030
title: "Scheduled Cleanup Job"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** system."
project: TimorLink
---

# US-007: Scheduled Cleanup Job

**Feature**: [FS-030](./FEATURE.md)

**As a** system
**I want** to automatically delete expired listings after grace period
**So that** database stays clean

---

## Acceptance Criteria

- [x] **AC-US7-01**: Scheduled job runs daily (or on demand)
- [x] **AC-US7-02**: Finds listings with grace period ended (expiry + 60 days < now)
- [x] **AC-US7-03**: Deletes listing and ALL related SKUs
- [x] **AC-US7-04**: User account NOT deleted
- [x] **AC-US7-05**: Deletion logged for audit

---

## Implementation

**Increment**: [0030-subscription-workflow](../../../../../increments/0030-subscription-workflow/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

