---
increment: 0047-entity-detail-pages
title: "Entity Detail Pages"
type: feature
priority: P1
status: completed
created: 2026-05-11
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Entity Detail Pages

## Overview

Create public-sector detail page + fix non-profit detail page to match business page structure (no ListingHeader/ListingBanner components, consistent with business page design).

## User Stories

### US-001: Public Sector Detail Page (P1)
**Project**: timorlist

**As a** visitor
**I want** to view public sector organization details
**So that** I can find government agencies and their contact information

**Acceptance Criteria**:
- [x] **AC-US1-01**: `/public-sector/[slug]` page renders with banner, header card, about us, photo gallery, location, hours, tags
- [x] **AC-US1-02**: Page displays contact info (phone, email, WhatsApp) and stats (views, likes, saves)
- [x] **AC-US1-03**: Share button copies URL to clipboard
- [x] **AC-US1-04**: Map opens in Google Maps or Apple Maps based on device
- [x] **AC-US1-05**: JSON-LD structured data for GovernmentOrganization

---

### US-002: Non-Profit Detail Page Cleanup (P1)
**Project**: timorlist

**As a** visitor
**I want** to view non-profit organization details with consistent UI
**So that** I get the same experience as business pages

**Acceptance Criteria**:
- [x] **AC-US2-01**: `/non-profit/[slug]` page uses business-style layout (not ListingHeader/ListingBanner)
- [x] **AC-US2-02**: Page displays banner, header card, about us, photo gallery, location, hours, tags
- [x] **AC-US2-03**: JSON-LD uses GovernmentOrganization or NGO based on organizationType

---

### US-003: Entity Pages Consistency (P1)
**Project**: timorlist

**As a** developer
**I want** all entity detail pages to share consistent patterns
**So that** maintenance is easier

**Acceptance Criteria**:
- [x] **AC-US3-01**: Business, Non-Profit, Public Sector share same page structure
- [x] **AC-US3-02**: No ProductsSection or Reviews components on Non-Profit/Public-Sector pages
- [x] **AC-US3-03**: Each entity type uses distinct color scheme (Business: amber, Non-Profit: green, Public-Sector: blue)

## Functional Requirements

### FR-001: Public Sector Page Structure
- Banner with gradient background (blue)
- Profile image with initial fallback
- Header card with contact info + stats + share
- About Us section
- Updates section (server island)
- Photo gallery sidebar
- Location map sidebar
- Hours sidebar
- Tags sidebar (if present)

### FR-002: Non-Profit Page Structure
- Banner with gradient background (green)
- Profile image with initial fallback
- Header card with contact info + stats + share
- About Us section
- Updates section (server island)
- Photo gallery sidebar
- Location map sidebar
- Hours sidebar
- Tags sidebar (if present)

### FR-003: Component Reuse
- `LocationMap` component shared across all pages
- `MediaGallery` component shared across all pages
- `UpdatesSection` component shared across all pages
- `Card` component for content containers

## Success Criteria

1. Both pages load in < 2s on localhost
2. All interactive elements (share, WhatsApp, map) functional
3. Console has no errors
4. Responsive layout works on mobile and desktop
5. Build passes without errors

## Out of Scope

- Admin CRUD for these entities (already exists)
- Email/notification functionality
- User authentication flows

## Dependencies

- `publicSectors` table in database
- `nonProfits` table in database
- `businessUpdates` table for updates section
- `media` table for photo gallery
- Shared components (LocationMap, MediaGallery, UpdatesSection, Card)