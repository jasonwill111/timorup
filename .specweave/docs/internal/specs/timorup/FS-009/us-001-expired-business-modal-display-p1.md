---
id: US-001
feature: FS-009
title: "Expired Business Modal Display (P1)"
status: completed
priority: P1
created: 2026-04-19T00:00:00.000Z
tldr: "**As a** a visitor viewing an expired business page."
project: TimorLink
---

# US-001: Expired Business Modal Display (P1)

**Feature**: [FS-009](./FEATURE.md)

**As a** a visitor viewing an expired business page
**I want** to see only the business name with a centered modal overlay
**So that** I understand the business subscription has expired and cannot view full content

---

## Acceptance Criteria

- [x] **AC-US1-01**: When `isSubscriptionActive === false`, entire page content is hidden except banner and profile header
- [x] **AC-US1-02**: A centered modal overlay displays "This business's subscription has expired"
- [x] **AC-US1-03**: Modal has dark semi-transparent backdrop
- [x] **AC-US1-04**: Modal shows "Renew Subscription" and "Go Back" buttons
- [x] **AC-US1-05**: Sidebar (map, hours, WhatsApp) is hidden when expired

---

## Implementation

**Increment**: [0009-expired-business-modal](../../../../../increments/0009-expired-business-modal/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-004**: Update JS to show modal when expired
