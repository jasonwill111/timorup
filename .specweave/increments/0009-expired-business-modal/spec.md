---
increment: 0009-expired-business-modal
title: Expired Business Subscription Modal
type: feature
priority: P1
status: completed
created: 2026-04-19T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Expired Business Subscription Modal

## Overview

Show modal overlay on expired business pages - only display business name and centered modal with subscription expired message, hiding all other content

---

## User Stories

### US-001: Expired Business Modal Display (P1)
**Project**: timorbiz

**As a** a visitor viewing an expired business page
**I want** to see only the business name with a centered modal overlay
**So that** I understand the business subscription has expired and cannot view full content

**Acceptance Criteria**:
- [x] **AC-US1-01**: When `isSubscriptionActive === false`, entire page content is hidden except banner and profile header
- [x] **AC-US1-02**: A centered modal overlay displays "This business's subscription has expired"
- [x] **AC-US1-03**: Modal has dark semi-transparent backdrop
- [x] **AC-US1-04**: Modal shows "Renew Subscription" and "Go Back" buttons
- [x] **AC-US1-05**: Sidebar (map, hours, WhatsApp) is hidden when expired

### US-002: Expired Business State Detection (P1)
**Project**: timorbiz

**As a** the system
**I want** to detect subscription expiration from API response
**So that** the expired modal displays correctly

**Acceptance Criteria**:
- [x] **AC-US2-01**: API response includes `isSubscriptionActive` boolean field
- [x] **AC-US2-02**: Frontend checks `isSubscriptionActive` before rendering content
- [x] **AC-US2-03**: Expired status displays "Expired" badge in red

---

## Technical Approach

### Implementation
1. Add modal HTML structure with backdrop
2. Add CSS for modal centering and backdrop
3. Update JavaScript to check `isSubscriptionActive`
4. Hide all content sections when expired
5. Show only: banner, profile header (name only), expired modal
6. Add "Renew" and "Go Back" button handlers

### Files to Modify
- `src/pages/business/[slug].astro` - Modal + expired state logic

---

## Out of Scope
- Backend subscription logic changes
- Email notification system
- Admin renewal interface

---

## Dependencies
- None (pure frontend changes)
