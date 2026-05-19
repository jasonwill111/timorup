---
id: US-003
feature: FS-001
title: "Expose a user-business status API endpoint"
status: not_started
priority: P1
created: 2026-03-22
tldr: "**As a** frontend **I want** a dedicated endpoint to check if the current user owns a business **So that** the create page can guard itself efficiently."
project: TimorLink
---

# US-003: Expose a user-business status API endpoint

**Feature**: [FS-001](./FEATURE.md)

**As a** frontend **I want** a dedicated endpoint to check if the current user owns a business **So that** the create page can guard itself efficiently

---

## Acceptance Criteria

- [ ] **AC-US3-01**: `GET /api/businesses/my-business` (Hono route) returns the user's business if one exists, or 404 if none.
- [ ] **AC-US3-02**: The endpoint uses the authenticated session to identify the user (no explicit userId required in request).
- [ ] **AC-US3-03**: The response includes `{ id, title, slug, status }` of the user's business (minimal payload, no unnecessary fields).

---

## Implementation

**Increment**: [0001-one-business-per-user](../../../../../increments/0001-one-business-per-user/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

