---
id: US-001
feature: FS-020
title: "User replies to reviews"
status: completed
priority: P2
created: 2026-04-30
tldr: "**As a** business owner **I want** to reply to reviews **So that** I can engage with customers."
project: timorlist
---

# US-001: User replies to reviews

**Feature**: [FS-020](./FEATURE.md)

**As a** business owner **I want** to reply to reviews **So that** I can engage with customers

---

## Acceptance Criteria

- [x] **AC-US1-01**: User can view reviews for their business on `/account` page and `/business/:slug` page
- [x] **AC-US1-02**: User can submit a reply via `POST /api/reviews/:id/reply`
- [x] **AC-US1-03**: One reply per review (reply once, cannot reply again)
- [x] **AC-US1-04**: User can edit their reply via `PUT /api/reviews/:id/reply`
- [x] **AC-US1-05**: User can delete their reply via `DELETE /api/reviews/:id/reply`
- [x] **AC-US1-06**: Replies display on the business page

---

## Implementation

**Increment**: [0020-review-management](../../../../../increments/0020-review-management/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
