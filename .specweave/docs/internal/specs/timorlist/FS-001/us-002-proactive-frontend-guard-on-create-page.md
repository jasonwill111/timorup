---
id: US-002
feature: FS-001
title: "Proactive frontend guard on create page"
status: not_started
priority: P1
created: 2026-03-22
tldr: "**As a** user who already owns a business **I want** the create page to tell me immediately that I cannot create another **So that** I am not misled into filling out a form only to be rejected at submit."
project: timorlist
---

# US-002: Proactive frontend guard on create page

**Feature**: [FS-001](./FEATURE.md)

**As a** user who already owns a business **I want** the create page to tell me immediately that I cannot create another **So that** I am not misled into filling out a form only to be rejected at submit

---

## Acceptance Criteria

- [ ] **AC-US2-01**: When a logged-in user visits `/business/create`, the page fetches `/api/businesses/my-business` (or a dedicated status endpoint) to check if they already own a business.
- [ ] **AC-US2-02**: If the user already has a business, the page replaces the form with a clear message: "You already have a business page: [BusinessName]. Visit your dashboard or edit your existing business."
- [ ] **AC-US2-03**: The guard runs after session validation (i.e., unauthenticated users are still redirected to login, not shown the "already has business" message).
- [ ] **AC-US2-04**: The frontend form submission handler shows the server's `LIMIT_REACHED` error as a user-friendly alert if the server-side check is hit.

---

## Implementation

**Increment**: [0001-one-business-per-user](../../../../../increments/0001-one-business-per-user/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
