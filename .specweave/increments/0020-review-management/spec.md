---
increment: 0020-review-management
title: "Review Reply & Admin Delete"
type: feature
priority: P2
status: completed
completed: 2026-04-30
created: 2026-04-30
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Review Reply & Admin Delete

## Overview

Business owners can reply to reviews (edit/delete their reply). Admins can manage and delete reviews from `/admin/reviews` with search/filter.

## User Stories

### US-001: User replies to reviews
**Project**: timorlist

**As a** business owner **I want** to reply to reviews **So that** I can engage with customers

**Acceptance Criteria**:
- [x] **AC-US1-01**: User can view reviews for their business on `/account` page and `/business/:slug` page
- [x] **AC-US1-02**: User can submit a reply via `POST /api/reviews/:id/reply`
- [x] **AC-US1-03**: One reply per review (reply once, cannot reply again)
- [x] **AC-US1-04**: User can edit their reply via `PUT /api/reviews/:id/reply`
- [x] **AC-US1-05**: User can delete their reply via `DELETE /api/reviews/:id/reply`
- [x] **AC-US1-06**: Replies display on the business page

---

### US-002: Admin manages reviews
**Project**: timorlist

**As an** admin **I want** to view and delete reviews **So that** I can moderate the platform

**Acceptance Criteria**:
- [x] **AC-US2-01**: Admin can view all reviews on `/admin/reviews` page with pagination
- [x] **AC-US2-02**: Admin can search reviews by business name, user name, or comment content
- [x] **AC-US2-03**: Admin can filter reviews by rating (1-5 stars)
- [x] **AC-US2-04**: Admin can filter reviews by date range
- [x] **AC-US2-05**: Admin can delete any review via `DELETE /api/admin/reviews/:id`
- [x] **AC-US2-06**: Delete requires admin session validation
- [x] **AC-US2-07**: Deleted review updates business rating average

---

### US-003: Reply API endpoints
**Project**: timorlist

**As a** developer **I want** CRUD endpoints **So that** the frontend can use them

**Acceptance Criteria**:
- [x] **AC-US3-01**: `POST /api/reviews/:id/reply` accepts `{ comment: string }`
- [x] **AC-US3-02**: `PUT /api/reviews/:id/reply` updates existing reply
- [x] **AC-US3-03**: `DELETE /api/reviews/:id/reply` deletes user's reply
- [x] **AC-US3-04**: `GET /api/reviews?businessPageId=X` returns reviews with reply data
- [x] **AC-US3-05**: `GET /api/admin/reviews` returns all reviews with search/filter
- [x] **AC-US3-06**: `DELETE /api/admin/reviews/:id` deletes review and updates rating

---

## Database Schema Changes

```sql
-- Add reply fields to reviews table
ALTER TABLE reviews ADD COLUMN reply TEXT;
ALTER TABLE reviews ADD COLUMN replied_at TEXT;
ALTER TABLE reviews ADD COLUMN replied_by TEXT;
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/reviews/:id/reply` | POST | Submit reply (one-time) |
| `/api/reviews/:id/reply` | PUT | Edit reply |
| `/api/reviews/:id/reply` | DELETE | Delete reply |
| `/api/admin/reviews` | GET | List all reviews (admin, with search/filter) |
| `/api/admin/reviews/:id` | DELETE | Delete review (admin only) |

## Reply Flow

```
User visits /account or /business/:slug
  → Views reviews for their business
  → Clicks "Reply" on a review
  → Submits reply via POST /api/reviews/:id/reply
  → Reply saved (can reply once per review)
  → User can Edit/Delete reply via PUT/DELETE
  → Reply displays on business page
```

## Admin Delete Flow

```
Admin visits /admin/reviews
  → Searches/filter reviews
  → Clicks "Delete" on a review
  → Confirms in modal
  → DELETE /api/admin/reviews/:id
  → Review deleted, rating updated
```

## Out of Scope

- Email notifications on new reply
- Reply notifications
- Admin editing/deleting replies
- Batch delete by admin
