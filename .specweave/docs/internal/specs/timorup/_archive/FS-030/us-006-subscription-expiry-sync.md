---
id: US-006
feature: FS-030
title: "Subscription Expiry Sync"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** system."
project: TimorLink
---

# US-006: Subscription Expiry Sync

**Feature**: [FS-030](./FEATURE.md)

**As a** system
**I want** subscription expiry to sync with listing/SKU status
**So that** access control reflects payment status

---

## Acceptance Criteria

- [x] **AC-US6-01**: Listing checks subscription status before allowing SKU operations
- [x] **AC-US6-02**: Expired subscription blocks all write operations (create/edit/delete SKU)
- [x] **AC-US6-03**: Expired subscription blocks Business Page content editing
- [x] **AC-US6-04**: Renewal during grace period restores full access immediately

---

## Implementation

**Increment**: [0030-subscription-workflow](../../../../../increments/0030-subscription-workflow/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

