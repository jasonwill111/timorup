---
id: US-003
feature: FS-030
title: "Business Listing Requires Subscription"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** user."
project: timorlist
---

# US-003: Business Listing Requires Subscription

**Feature**: [FS-030](./FEATURE.md)

**As a** user
**I want** to complete payment and admin confirmation before my business page activates
**So that** only paid listings are visible

---

## Acceptance Criteria

- [x] **AC-US3-01**: New business listing created with `status: 'pending_payment'`
- [x] **AC-US3-02**: User redirected to select plan after creating business listing
- [x] **AC-US3-03**: After payment, order created with `status: 'paid'` after admin confirmation
- [x] **AC-US3-04**: Business listing `status: 'published'` only after admin confirms payment
- [x] **AC-US3-05**: Business page shows "Pending Approval" if not yet confirmed

---

## Implementation

**Increment**: [0030-subscription-workflow](../../../../../increments/0030-subscription-workflow/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
