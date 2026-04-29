# Mobile UI/UX Optimization

## Overview

Optimize mobile layout for all listing pages to display content more compactly and reasonably on mobile devices.

## Goals

1. **2-Column Grid**: All listing pages display 2 cards per row on mobile
2. **Compact Cards**: Reduced padding and text sizes for mobile
3. **Responsive Images**: `aspect-video` (16:9) on mobile, `aspect-[4/3]` on desktop
4. **Reduced Spacing**: Smaller margins and gaps on mobile

## Pages Affected

| Page | Route | Changes |
|------|-------|---------|
| Homepage | `/` | 2-column grid, compact sections |
| Directory | `/listing` | 2-column grid, compact filters |
| Products | `/products-services` | 2-column grid, compact layout |
| Businesses | `/businesses` | 2-column grid |

## Component Changes

### BusinessCard
- Mobile: `p-2`, `text-xs`, `aspect-square`
- Desktop: `p-3`, `text-sm`, `aspect-square`

### ProductCard
- Mobile: `p-2`, `text-xs`, `aspect-square`
- Desktop: `p-3`, `text-sm`, `aspect-square`

### Grid Gaps
- Mobile: `gap-2`
- Desktop: `gap-4`

## Section Changes

| Element | Mobile | Desktop |
|---------|--------|---------|
| Hero Height | 240px | 500px |
| Section Margin | mb-6 | mb-12 |
| Section Title | text-lg | text-2xl |
| Filter Inputs | h-9, w-full | h-10, w-64 |

## Acceptance Criteria

- [x] Homepage displays 2 columns on mobile
- [x] Listing pages display 2 columns on mobile
- [x] Products page displays 2 columns on mobile
- [x] Cards have compact padding on mobile
- [x] Images use aspect-video on mobile
- [x] Section spacing reduced on mobile
- [x] Filters are compact on mobile
- [x] All pages render correctly on both mobile and desktop
