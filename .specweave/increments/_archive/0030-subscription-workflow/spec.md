---
increment: 0030-subscription-workflow
title: Subscription Workflow
type: feature
priority: P1
status: completed
created: 2026-05-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# SPEC: Subscription Workflow

**Increment**: 0030-subscription-workflow
**Project**: timorlist
**Type**: feature
**Priority**: P1

## Context

Complete subscription and listing workflow system. Each user can only have ONE listing (business OR non-profit, not both). Business listings require plan subscription; non-profit are free.

## Plan SKU Limits
| Plan | SKU Limit |
|------|-----------|
| Basic | 10 |
| Pro | 30 |
| Max | 60 |

## User Stories

### US-001: One Listing Per User
**Project**: timorlist

**As a** user
**I want** to create only ONE listing (business OR non-profit)
**So that** system maintains clean data model

**Acceptance Criteria**:
- [x] **AC-US1-01**: User without listing sees both "Business" and "Non-Profit" options when creating
- [x] **AC-US1-02**: User with existing listing sees only their listing type (Business or Non-Profit)
- [x] **AC-US1-03**: Create button disabled/hidden if user already has a listing
- [x] **AC-US1-04**: API prevents creating second listing even if frontend check bypassed

---

### US-002: Non-Profit Listing (Free, Immediate)
**Project**: timorlist

**As a** user
**I want** to create non-profit listing immediately (no payment)
**So that** government agencies and NGOs can list free

**Acceptance Criteria**:
- [x] **AC-US2-01**: Non-profit listing becomes `status: 'published'` immediately after creation
- [x] **AC-US2-02**: Non-profit has no plan/subscription/expiry fields
- [x] **AC-US2-03**: Non-profit listing CANNOT have SKUs (SKU section hidden/not available)
- [x] **AC-US2-04**: Non-profit cannot be affected by grace period or auto-delete

---

### US-003: Business Listing Requires Subscription
**Project**: timorlist

**As a** user
**I want** to complete payment and admin confirmation before my business page activates
**So that** only paid listings are visible

**Acceptance Criteria**:
- [x] **AC-US3-01**: New business listing created with `status: 'pending_payment'`
- [x] **AC-US3-02**: User redirected to select plan after creating business listing
- [x] **AC-US3-03**: After payment, order created with `status: 'paid'` after admin confirmation
- [x] **AC-US3-04**: Business listing `status: 'published'` only after admin confirms payment
- [x] **AC-US3-05**: Business page shows "Pending Approval" if not yet confirmed

---

### US-004: SKU Creation After Activation
**Project**: timorlist

**As a** business owner
**I want** to create SKUs only after my business is activated
**So that** I don't waste SKU quota before business is live

**Acceptance Criteria**:
- [x] **AC-US4-01**: SKU creation page/API blocked if business `status != 'published'`
- [x] **AC-US4-02**: SKU count limited by plan (Basic=10, Pro=30, Max=60)
- [x] **AC-US4-03**: Error shown if user tries to exceed SKU limit
- [x] **AC-US4-04**: Admin can view and manage any business's SKUs

---

### US-005: Grace Period (60 Days)
**Project**: timorlist

**As a** system
**I want** to handle expired subscriptions gracefully
**So that** users have time to renew without immediate data loss

**Acceptance Criteria**:
- [x] **AC-US5-01**: When subscription expires, listing `status: 'expired'`
- [x] **AC-US5-02**: Grace period starts (60 days from expiry)
- [x] **AC-US5-03**: During grace period, Business Page shows modal: "请及时为Business Page续费,否则60天之后会删除。谢谢配合!"
- [x] **AC-US5-04**: During grace period: NO create/edit SKU or Business Page content allowed
- [x] **AC-US5-05**: Grace period countdown visible to user
- [x] **AC-US5-06**: After grace period (60 days): listing and all SKUs deleted from database

---

### US-006: Subscription Expiry Sync
**Project**: timorlist

**As a** system
**I want** subscription expiry to sync with listing/SKU status
**So that** access control reflects payment status

**Acceptance Criteria**:
- [x] **AC-US6-01**: Listing checks subscription status before allowing SKU operations
- [x] **AC-US6-02**: Expired subscription blocks all write operations (create/edit/delete SKU)
- [x] **AC-US6-03**: Expired subscription blocks Business Page content editing
- [x] **AC-US6-04**: Renewal during grace period restores full access immediately

---

### US-007: Scheduled Cleanup Job
**Project**: timorlist

**As a** system
**I want** to automatically delete expired listings after grace period
**So that** database stays clean

**Acceptance Criteria**:
- [x] **AC-US7-01**: Scheduled job runs daily (or on demand)
- [x] **AC-US7-02**: Finds listings with grace period ended (expiry + 60 days < now)
- [x] **AC-US7-03**: Deletes listing and ALL related SKUs
- [x] **AC-US7-04**: User account NOT deleted
- [x] **AC-US7-05**: Deletion logged for audit

## Out of Scope

- Payment gateway integration (assume payment already processed externally)
- Email notifications
- User account deletion workflow
- SKU image/media cleanup (handled by existing orphan cleanup job)
- **Backlog**: `/admin/plan` page for managing plan types, prices, and SKU limits (sync updates to existing listings/SKUs)


- [ ] **Backlog**: `/admin/plan` page for managing plan types, prices, and SKU limits (sync updates to existing listings/SKUs)
