# Feature: Homepage Redesign - Tabs + 12 Cards

## Overview

Redesigned homepage to show 3 content types with tab navigation. Each tab displays 12 cards, with a prominent "View All" button leading to the respective listing page.

## User Stories

### US-001: Tab Navigation
**Project**: timorlist

**As a** user
**I want** to switch between Featured Businesses, Classified Ads, and Products & Services
**So that** I can quickly browse different content types

**Acceptance Criteria**:
- [x] AC-US1-01: Desktop shows tab buttons (not dropdown)
- [x] AC-US1-02: Mobile shows dropdown select
- [x] AC-US1-03: Active tab has border-primary indicator

### US-002: Content Display
**Project**: timorlist

**As a** user
**I want** 12 cards per tab with "View All" button
**So that** I can see more content and easily navigate to listings

**Acceptance Criteria**:
- [x] AC-US2-01: Featured Businesses shows 12 business cards
- [x] AC-US2-02: Classified Ads shows 12 listing cards
- [x] AC-US2-03: Products & Services shows 12 product cards
- [x] AC-US2-04: Each tab has "View All" button linking to respective list page

### US-003: Removed Sections
**Project**: timorlist

**As a** user
**I want** cleaner homepage
**So that** I focus on featured content

**Acceptance Criteria**:
- [x] AC-US3-01: No skeleton fallback (server island loads directly)
- [x] AC-US3-02: No "Browse by Category" section
- [x] AC-US3-03: No Government/NGO sections (unified into tabs if data exists)

## Layout Structure

### Desktop (md+)
```
Hero Section
Explore Timor-Leste (4 entity cards)
Tab Navigation: [Featured Businesses] [Classified Ads] [Products & Services]
Content Panel (12 cards + View All button)
CTA Section
```

### Mobile
```
Hero Section
Explore Timor-Leste (4 entity cards)
Dropdown: Select content type
Content Panel (12 cards + View All button)
CTA Section
```

## Components Modified

1. `src/pages/index.astro` - Removed skeleton, removed Browse by Category
2. `src/components/islands/HomepageContent.astro` - Tab navigation, 3 content types
3. `src/components/business/ListingCard.astro` - New component for classified ads

## Grid System

- Mobile: `grid-cols-2`
- Small: `sm:grid-cols-3`
- Medium: `md:grid-cols-4`
- Large: `lg:grid-cols-6` (up to 12 cards)

## Card Components

| Type | Component | Color Theme |
|------|-----------|------------|
| Business | BusinessCard.astro | amber/orange |
| Listing | ListingCard.astro | emerald/teal |
| Product | ProductCard.astro | blue/cyan |

## Tab States

| State | Appearance |
|-------|------------|
| Default | text-muted-foreground, no border |
| Hover | text-foreground, cursor pointer |
| Active | text-foreground, border-b-2 border-primary |

## View All Buttons

| Tab | Button Style | Link |
|----|--------------|------|
| Featured Businesses | bg-primary, text-primary-foreground | /businesses |
| Classified Ads | bg-emerald-500, text-white | /listings |
| Products & Services | bg-blue-500, text-white | /products-services |

All buttons use: `inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium hover:transition-colors`

## Data Source

- Businesses: `businesses` table, status IN ('live', 'published'), order by likes desc, limit 12
- Listings: `listings` table, status IN ('active', 'published'), order by featured/likes, limit 12
- Products: `products` table, innerJoin businesses.status IN ('live', 'published'), order by featured/createdAt, limit 12

## Note

Local D1 has listings with 'published' status, not 'active'. Query uses `or(eq(status, 'active'), eq(status, 'published'))` to handle both cases.