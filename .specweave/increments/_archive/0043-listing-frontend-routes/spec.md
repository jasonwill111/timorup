---
increment: 0043-listing-frontend-routes
title: Listing Frontend Routes
type: feature
priority: P1
status: ready_for_review
created: 2026-05-10T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Listing Frontend Routes

## Overview

Frontend routes for personal and business listings with entityType routing.

---

## User Stories

### US-001: Personal Listing Page (P1)
**Project**: timorlist

**As a** visitor
**I want** view personal listings at /personal/[slug]
**So that** I can find individuals by name

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Personal listings accessible at `/personal/[slug]`
- [ ] **AC-US1-02**: Page shows owner's full name prominently
- [ ] **AC-US1-03**: Contact information displayed
- [ ] **AC-US1-04**: 404 shown for non-existent personal listings

---

### US-002: Business Listing Page Updates (P1)
**Project**: timorlist

**As a** user
**I want** business listings still work at /business/[slug]
**So that** existing business pages continue functioning

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Business listings at `/business/[slug]` render correctly
- [ ] **AC-US2-02**: Entity type badge shown on listing pages

---

### US-003: Combined Directory (P2)
**Project**: timorlist

**As a** visitor
**I want** browse all listing types in one directory
**So that** I can find both businesses and personal listings

**Acceptance Criteria**:
- [ ] **AC-US3-01**: Directory page shows filter by entity type
- [ ] **AC-US3-02**: Personal listings appear in search results
- [ ] **AC-US3-03**: Filter shows entity type badges

---

## Functional Requirements

### FR-001: Route Configuration
- `/personal/[slug]` - Personal listing detail page
- `/business/[slug]` - Business listing detail page (existing)
- `/nonprofit/[slug]` - Nonprofit listing detail page (existing)

### FR-002: Listing Page Components
- Owner name display
- Contact information
- Entity type badge
- Subscription status indicator

---

## Out of Scope

- Admin UI for managing personal listings
- Payment flow integration
- Email notifications
