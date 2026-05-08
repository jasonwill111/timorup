---
increment: 0031-admin-plan-management
title: Admin Plan Management
type: feature
priority: P2
status: completed
created: 2026-05-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# SPEC: Admin Plan Management

## Context

Plans (Basic/Pro/Max) currently hardcoded in multiple files. Need centralized DB-backed plan management.

## Plan SKU Limits (Current)
| Plan | Monthly | Yearly | SKU Limit |
|------|---------|--------|-----------|
| Basic | $29 | $290 | 10 |
| Pro | $59 | $590 | 30 |
| Max | $89 | $890 | 60 |

## User Stories

### US-001: Plans Database-Backed
**Project**: timorlist

**As a** system
**I want** plans stored in database
**So that** admin can manage them dynamically

**Acceptance Criteria**:
- [x] **AC-US1-01**: Plans table exists with fields: id, name, period, amount, skuLimit, maxImages, maxVideos, features, description, sortOrder, active
- [x] **AC-US1-02**: Initial seed data matches current 6 plans
- [x] **AC-US1-03**: Public `/api/plans` returns active plans sorted by sortOrder

### US-002: Admin Plan Management UI
**Project**: timorlist

**As a** admin
**I want** to view and edit plan details
**So that** I can adjust pricing and limits without code changes

**Acceptance Criteria**:
- [x] **AC-US2-01**: Admin can view all plans at `/admin/plans`
- [x] **AC-US2-02**: Admin can edit plan name, amount, SKU limit, image limits, features, description
- [x] **AC-US2-03**: Changes saved to database immediately
- [x] **AC-US2-04**: Admin can toggle plan active/inactive

### US-003: Plan Sync to Frontend
**Project**: timorlist

**As a** system
**I want** frontend pages load plans from database
**So that** plan changes reflect immediately

**Acceptance Criteria**:
- [x] **AC-US3-01**: `/pricing` page loads plans from `/api/plans`
- [x] **AC-US3-02**: `/subscribe` page loads plans from `/api/plans`
- [x] **AC-US3-03**: Subscription helper uses DB plan limits

### US-004: Existing Subscriptions Unchanged
**Project**: timorlist

**As a** system
**I want** existing subscriptions to keep their original plan limits
**So that** users aren't surprised by sudden changes

**Acceptance Criteria**:
- [x] **AC-US4-01**: New subscriptions use current DB plan limits
- [x] **AC-US4-02**: Renewed subscriptions use updated plan limits
- [x] **AC-US4-03**: Existing active subscriptions retain original limits

## Out of Scope

- Payment gateway changes
- Plan feature flags beyond SKU/image limits
- Automatic notification to existing users of plan changes

## Dependencies

- Increment 0030 (subscription workflow) - uses subscription helpers
