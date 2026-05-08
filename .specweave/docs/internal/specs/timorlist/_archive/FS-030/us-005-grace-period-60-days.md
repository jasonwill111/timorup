---
id: US-005
feature: FS-030
title: "Grace Period (60 Days)"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** system."
project: timorlist
---

# US-005: Grace Period (60 Days)

**Feature**: [FS-030](./FEATURE.md)

**As a** system
**I want** to handle expired subscriptions gracefully
**So that** users have time to renew without immediate data loss

---

## Acceptance Criteria

- [x] **AC-US5-01**: When subscription expires, listing `status: 'expired'`
- [x] **AC-US5-02**: Grace period starts (60 days from expiry)
- [x] **AC-US5-03**: During grace period, Business Page shows modal: "请及时为Business Page续费,否则60天之后会删除。谢谢配合!"
- [x] **AC-US5-04**: During grace period: NO create/edit SKU or Business Page content allowed
- [x] **AC-US5-05**: Grace period countdown visible to user
- [x] **AC-US5-06**: After grace period (60 days): listing and all SKUs deleted from database

---

## Implementation

**Increment**: [0030-subscription-workflow](../../../../../increments/0030-subscription-workflow/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
