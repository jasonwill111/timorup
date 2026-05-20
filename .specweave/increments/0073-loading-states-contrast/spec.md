---
status: completed
---
# Feature: Loading States & Color Contrast Fix

## Overview

Add skeleton loading to list pages, fix dark mode contrast issues, enhance card hover effects, and display full 5-star ratings on BusinessCard components.

---

## User Stories

### US-001: Skeleton Loading States
**Project**: timorup

**As a** site visitor
**I want** to see skeleton loaders while content loads
**So that** I don't see layout shifts and understand content is coming

**Acceptance Criteria**:
- [x] **AC-US1-01**: Business list page (`/businesses`) shows 12 skeleton cards during initial load
- [x] **AC-US1-02**: Non-profit list page (`/non-profits`) shows 12 skeleton cards during initial load
- [x] **AC-US1-03**: Public sector list page (`/public-sectors`) shows 12 skeleton cards during initial load
- [x] **AC-US1-04**: Listing list page (`/listings`) shows 12 skeleton cards during initial load
- [x] **AC-US1-05**: Product list page (`/products-services`) shows 12 skeleton cards during initial load
- [x] **AC-US1-06**: Skeletons use `bg-muted` with `animate-pulse` class matching existing Skeleton.astro component

---

### US-002: Dark Mode Contrast Fix
**Project**: timorup

**As a** user in dark mode
**I want** readable muted text
**So that** secondary text has sufficient contrast against dark backgrounds

**Acceptance Criteria**:
- [x] **AC-US2-01**: Dark mode `muted-foreground` meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
- [x] **AC-US2-02**: All `text-muted-foreground` usage verified: location text, secondary descriptions, category labels
- [x] **AC-US2-03**: Light mode `muted-foreground` remains unchanged (zinc-600 for consistency)

---

### US-003: Card Hover Enhancement
**Project**: timorup

**As a** site visitor
**I want** more visible card hover states
**So that** I can clearly identify interactive elements

**Acceptance Criteria**:
- [x] **AC-US3-01**: Card hover border changes from `border-primary/30` to `border-primary/60` for increased visibility
- [x] **AC-US3-02**: Hover shadow increases from `shadow-sm hover:shadow-md` to `shadow-sm hover:shadow-lg`
- [x] **AC-US3-03**: All entity cards (Business, Non-Profit, Public Sector, Listing, Product) use consistent hover styles

---

### US-004: BusinessCard Full Star Rating Display
**Project**: timorup

**As a** site visitor
**I want** to see visual 5-star ratings on business cards
**So that** I can quickly assess business quality without reading numbers

**Acceptance Criteria**:
- [x] **AC-US4-01**: BusinessCard displays 5 star icons (filled/empty based on rating)
- [x] **AC-US4-02**: Filled stars use `text-amber-400`, empty stars use `text-gray-300 dark:text-gray-600`
- [x] **AC-US4-03**: Rating badge shows both star display and numeric value (e.g., "4.5 (23 reviews)")
- [x] **AC-US4-04**: Star display scales properly on mobile (smaller stars) and desktop

## Dependencies

- Existing `Skeleton.astro` component
- Existing `skeleton.ts` utilities
- CSS custom properties defined in `src/styles/globals.css`
