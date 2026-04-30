---
id: US-001
feature: FS-020
title: "User replies to reviews"
status: not_started
priority: P2
created: 2026-04-30
tldr: "**As a** business owner **I want** to reply to reviews on my account page **So that** I can engage with customers."
project: timorlist
---

# US-001: User replies to reviews

**Feature**: [FS-020](./FEATURE.md)

**As a** business owner **I want** to reply to reviews on my account page **So that** I can engage with customers

---

## Acceptance Criteria

- [ ] **AC-US1-01**: User can view list of reviews for their business on `/account` page
- [ ] **AC-US1-02**: User can submit a reply to a review via API `POST /api/reviews/:id/reply`
- [ ] **AC-US1-03**: Reply is stored with `reply`, `repliedAt`, `repliedBy` fields
- [ ] **AC-US1-04**: User cannot delete their own reviews (only reply)
- [ ] **AC-US1-05**: Replies display on the business page

---

## Implementation

**Increment**: [0020-review-management](../../../../../increments/0020-review-management/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
