---
increment: 0068-admin-ui-fix
title: "Admin UI Fix"
type: bug
priority: P1
status: planned
created: 2026-05-19
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin UI Fix

## Overview

Fix Admin UI issues discovered during schema audit:
1. Add formFields support to categories.astro for listing_categories and product_categories
2. Clean up deprecated fields in products.astro (businessPageId, serviceType)
3. Deploy renamed routes (orders, products, ad-banners)

## User Stories

### US-001: Add formFields to Categories Management (P1)
**Project**: timorlist

**As a** admin
**I want** to edit category-specific form field configurations
**So that** I can customize what fields appear for each listing/product category

**Acceptance Criteria**:
- [x] **AC-US1-01**: listing_categories form shows formFields textarea/input
- [x] **AC-US1-02**: product_categories form shows formFields textarea/input
- [x] **AC-US1-03**: formFields saved as JSON to database
- [x] **AC-US1-04**: formFields displayed in category list view

---

### US-002: Clean Up Deprecated Fields in Products (P2)
**Project**: timorlist

**As a** admin
**I want** to see only current field names in the products form
**So that** the UI is clear and consistent with schema

**Acceptance Criteria**:
- [x] **AC-US2-01**: Remove reference to businessPageId (deprecated field)
- [x] **AC-US2-02**: Replace serviceType dropdown with productType
- [x] **AC-US2-03**: Keep businessId field (still valid)

---

### US-003: Deploy and Test Renamed Routes (P1)
**Project**: timorlist

**As a** admin
**I want** to access renamed pages via new URLs
**So that** routes match schema naming

**Acceptance Criteria**:
- [x] **AC-US3-01**: /admin/orders accessible (renamed from /admin/subscriptions)
- [x] **AC-US3-02**: /admin/products accessible (renamed from /admin/skus)
- [x] **AC-US3-03**: /admin/ad-banners accessible (renamed from /admin/heroes)
- [x] **AC-US3-04**: Old routes redirect to new routes

---

### US-004: Update All References to Old Routes (P2)
**Project**: timorlist

**As a** system
**I want** to update all code references to old route paths
**So that** navigation works correctly after deployment

**Acceptance Criteria**:
- [x] **AC-US4-01**: AdminLayout sidebar links updated to new routes
- [x] **AC-US4-02**: Dashboard links updated to new routes
- [x] **AC-US4-03**: Any API redirects updated to new routes

## Functional Requirements

### FR-001: Categories formFields Field
The categories form should include:
- `formFields`: JSON textarea containing field definitions
- Format: `[{ name: "price", type: "number", label: "Price", required: true }, ...]`
- For listing_categories and product_categories tables only

### FR-002: Products Field Cleanup
Replace deprecated fields:
- `serviceType` → use `productType` only
- `businessPageId` → remove display (keep in schema for compatibility)

### FR-003: Route Migration
Create redirect rules or update links:
- `/admin/subscriptions` → `/admin/orders`
- `/admin/skus` → `/admin/products`
- `/admin/heroes` → `/admin/ad-banners`

## Success Criteria

1. Admin can edit formFields for listing/product categories
2. Products page uses only current field names
3. All renamed routes accessible after deployment
4. All navigation links point to correct routes

## Out of Scope

- Changes to public-facing pages
- Database schema changes (already done in 0067)
- Changes to API endpoints

## Dependencies

- Increment 0067: D1 Database Schema Fix (must be deployed first)
- Deployment to Cloudflare Workers