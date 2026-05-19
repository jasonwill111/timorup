---
id: US-001
feature: FS-002
title: "Dynamic Payment QR Code"
status: completed
priority: P1
created: 2026-03-23T00:00:00.000Z
tldr: "**As a** business owner visiting the subscribe page."
project: TimorLink
---

# US-001: Dynamic Payment QR Code

**Feature**: [FS-002](./FEATURE.md)

**As a** business owner visiting the subscribe page
**I want** to see the current payment QR code configured by the admin
**So that** I can make the correct payment for my subscription

---

## Acceptance Criteria

- [x] **AC-US1-01**: The `/subscribe` page fetches the payment QR image URL from the `/api/settings/public` endpoint on page load
- [x] **AC-US1-02**: If the QR code URL is not yet configured (null, empty, or key missing), the QR section shows a placeholder message ("Payment QR code not yet configured") instead of a broken image
- [x] **AC-US1-03**: The `/api/settings/public` endpoint returns a JSON object with at least `{ payment_qr: string | null }` â€?accessible to unauthenticated users, no session required
- [x] **AC-US1-04**: The existing `/api/admin/settings` (authenticated) continues to work for Admin to save the `payment_qr` URL via the site settings form

---

## Implementation

**Increment**: [0002-p0-compliance-fix](../../../../../increments/0002-p0-compliance-fix/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

