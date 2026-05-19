---
increment: 0024-server-islands-businesses
title: "Server Islands for Businesses"
type: refactor
priority: P2
status: completed
project: TimorLink
created: 2026-05-03
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Server Islands for Businesses

## Overview

Extract business list and category filter to Server Islands with server-side pagination, filtering, and URL params.

## User Stories

### US-001: Business Directory with Server-Side Pagination
**Project**: TimorLink

**As a** visitor
**I want** to browse businesses with proper pagination
**So that** I can navigate large business listings efficiently

**Acceptance Criteria**:
- [x] **AC-US1-01**: Business list displays 24 items per page
- [x] **AC-US1-02**: Pagination controls (Previous/Next/Page numbers) appear when >1 page
- [x] **AC-US1-03**: URL reflects current page (`?page=N`)
- [x] **AC-US1-04**: Result count shows "Showing X-Y of Z businesses"

### US-002: Server-Side Category Filter
**Project**: TimorLink

**As a** visitor
**I want** to filter businesses by category via URL
**So that** I can share filtered views and improve SEO

**Acceptance Criteria**:
- [x] **AC-US2-01**: Category dropdown updates URL (`?category=slug`)
- [x] **AC-US2-02**: Filtered results show only matching category
- [x] **AC-US2-03**: Category persists across pagination

### US-003: Server-Side Sort Options
**Project**: TimorLink

**As a** visitor
**I want** to sort businesses by popularity, recency, or name
**So that** I can find relevant businesses faster

**Acceptance Criteria**:
- [x] **AC-US3-01**: Sort dropdown with options: Most Popular, Most Recent, A-Z
- [x] **AC-US3-02**: Sort preference persists in URL (`?sort=popular`)
- [x] **AC-US3-03**: Sort applies correctly to paginated results

### US-004: Search Functionality
**Project**: TimorLink

**As a** visitor
**I want** to search businesses by keyword
**So that** I can find specific businesses quickly

**Acceptance Criteria**:
- [x] **AC-US4-01**: Search input submits via form GET
- [x] **AC-US4-02**: Search query appears in URL (`?q=keyword`)
- [x] **AC-US4-03**: Search filters businesses by title

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| DB queries per request | 4 | 2-3 |
| Pagination | None (first 20 only) | 24/page with full navigation |
| Server-side filter | No (client JS) | Yes |
| URL params | No | Yes |

## Out of Scope

- Client-side search (search via API endpoint remains client-side)
- Infinite scroll
- Category count per category

## Dependencies

- Existing `BusinessCard` component
- `getDb()` pattern for D1 access
- Astro Server Islands architecture

