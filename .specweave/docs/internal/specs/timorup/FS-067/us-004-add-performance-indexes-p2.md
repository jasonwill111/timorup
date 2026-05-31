---
id: US-004
feature: FS-067
title: "Add Performance Indexes (P2)"
status: completed
priority: P1
created: 2026-05-19T00:00:00.000Z
tldr: "**As a** system."
project: timorup
---

# US-004: Add Performance Indexes (P2)

**Feature**: [FS-067](./FEATURE.md)

**As a** system
**I want** to add indexes for frequently queried columns
**So that** database queries perform optimally

---

## Acceptance Criteria

- [x] **AC-US4-01**: `products` table has indexes: business_idx, category_idx, slug_idx, active_idx
- [x] **AC-US4-02**: `listings` table has indexes: owner_idx, status_idx, category_idx, featured_idx, expires_idx
- [x] **AC-US4-03**: `service_packages` table has indexes: slug_idx, type_idx, category_idx, active_idx
- [x] **AC-US4-04**: `reviews` table has indexes: business_idx, user_idx, status_idx, user_business_idx
- [x] **AC-US4-05**: `saved_items` table has indexes: user_idx, type_idx, type_id_idx
- [x] **AC-US4-06**: `latest_updates` table has indexes: unique_idx, type_idx, type_id_idx
- [x] **AC-US4-07**: `media` table has indexes: entity_idx, purpose_idx, deleted_idx
- [x] **AC-US4-08**: `sessions` table has UNIQUE index: token_idx
- [x] **AC-US4-09**: `blog_posts` table has index: status_idx
- [x] **AC-US4-10**: `site_settings` table has UNIQUE index: key_idx

---

## Implementation

**Increment**: [0067-d1-schema-fix](../../../../../increments/0067-d1-schema-fix/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
