---
increment: 0044-listing-admin-pages
title: Listing Admin Pages
type: feature
priority: P1
status: ready_for_review
created: 2026-05-10T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Listing Admin Pages

## Overview

Admin UI updates for managing listings with entityType filters.

---

## User Stories

### US-001: Filter Listings by Entity Type (P1)
**Project**: timorlist

**As an** admin
**I want** filter listings by entity type
**So that** I can manage business, nonprofit, and personal separately

**Acceptance Criteria**:
- [ ] **AC-US1-01**: Admin listings page shows entity type filter dropdown
- [ ] **AC-US1-02**: Filter persists when navigating pages
- [ ] **AC-US1-03**: Count shows per entity type

---

### US-002: Personal Listing Management (P1)
**Project**: timorlist

**As an** admin
**I want** view and manage personal listings
**So that** I can approve or remove personal entries

**Acceptance Criteria**:
- [ ] **AC-US2-01**: Personal listings appear in admin listings
- [ ] **AC-US2-02**: Can edit personal listing details
- [ ] **AC-US2-03**: Can delete personal listings

---

## Out of Scope

- Payment management UI
- Subscription status management
