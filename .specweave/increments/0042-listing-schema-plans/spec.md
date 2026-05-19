---
increment: 0042-listing-schema-plans
title: Listing Schema and Plans
type: feature
priority: P1
status: completed
created: 2026-05-10T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Listing Schema and Plans

## Overview

New database schema for listings with personal subscription system. Adds `entityType`, `planType`, and `subscriptionStatus` fields to support both business and personal listing types with subscription-based access.

---

## User Stories

### US-001: Personal Listing Creation (P1)
**Project**: TimorLink

**As a** individual user
**I want** create a personal listing with my name
**So that** I can be found by name without registering a business

**Acceptance Criteria**:
- [x] **AC-US1-01**: User can create personal listing with `entityType = 'personal'`
- [x] **AC-US1-02**: Personal listings display owner's full name prominently
- [x] **AC-US1-03**: Personal listings appear in `/business/[slug]` route (same route, entityType flag)
- [x] **AC-US1-04**: Each user can have only one personal listing

---

### US-002: Subscription Plan Selection (P1)
**Project**: TimorLink

**As a** user
**I want** choose between trial, weekly, monthly, yearly subscription periods
**So that** I can pay only for the duration I need

**Acceptance Criteria**:
- [x] **AC-US2-01**: Plans table supports periods: `trial_3d`, `weekly`, `monthly`, `yearly`
- [x] **AC-US2-02**: User selects planType during listing creation
- [x] **AC-US2-03**: Trial period converts to paid on payment completion
- [x] **AC-US2-04**: Subscription expiration triggers listing status change

---

### US-003: Subscription Status Tracking (P1)
**Project**: TimorLink

**As a** system
**I want** track subscription lifecycle
**So that** access can be granted or revoked based on payment status

**Acceptance Criteria**:
- [x] **AC-US3-01**: Subscription statuses: `trial`, `active`, `expired`, `cancelled`
- [x] **AC-US3-02**: Expired subscriptions block access to listing management
- [x] **AC-US3-03**: Payment completion transitions status from `trial` to `active`
- [x] **AC-US3-04**: Scheduled job marks expired subscriptions daily

---

### US-004: Listing Access Control (P2)
**Project**: TimorLink

**As a** visitor
**I want** view only active listings
**So that** expired or unpaid listings don't appear in search

**Acceptance Criteria**:
- [x] **AC-US4-01**: Search results filter by `subscriptionStatus = 'active'`
- [x] **AC-US4-02**: Homepage sections show only active listings
- [x] **AC-US4-03**: Expired listings show "Subscription Expired" banner

---

## Functional Requirements

### FR-001: Schema Changes
- Add `entityType` ENUM: `'business' | 'personal'`
- Add `planType` ENUM: `'trial_3d' | 'weekly' | 'monthly' | 'yearly'`
- Add `subscriptionStatus` ENUM: `'trial' | 'active' | 'expired' | 'cancelled'`
- Add `subscriptionExpiresAt` TIMESTAMP column
- Add `trialStartedAt` TIMESTAMP column

### FR-002: Plan Configuration
- Default plans: Trial (3 days), Weekly, Monthly, Yearly
- Each plan defines: `skuLimit`, `maxImages`, `maxVideos`, `maxBusinessImages`, `maxBusinessVideos`

### FR-003: API Endpoints
- `GET /api/admin/listings` - Filter by entityType, planType, subscriptionStatus
- `PATCH /api/admin/listings/[id]/subscription` - Update subscription status
- `GET /api/plans/active` - Public plan listing for pricing page

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Trial â†?Active conversion | > 60% |
| Subscription expiry job | Runs daily, < 1s execution |
| Schema migration | Zero data loss |

---

## Out of Scope

- Payment gateway integration (Stripe, etc.)
- Email notifications for expiry
- Auto-renewal logic
- Admin UI for subscription management

---

## Dependencies

- Existing `business_pages` table schema
- Existing `plans` table schema
- Scheduled job infrastructure (`/api/scheduled/*`)

