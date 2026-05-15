# Plan: Homepage Redesign - Tabs + 12 Cards

## Current State

- Homepage shows Featured Businesses (12 cards) + Government/NGO sections
- Has skeleton fallback causing flicker
- "Browse by Category" section at bottom

## Target State

- 3 tabs: Businesses | Classified Ads | Products & Services
- 6 cards per tab
- Desktop: tab buttons
- Mobile: dropdown select
- No skeleton, no categories section

## Implementation Steps

### Step 1: Create ListingCard component
**Action**: Create new card component for classified ads
**File**: `src/components/business/ListingCard.astro`
**Features**:
- listingType color themes
- price badge overlay
- type label badge

### Step 2: Rewrite HomepageContent with tabs
**Action**: Replace current layout with tab structure
**File**: `src/components/islands/HomepageContent.astro`
**Changes**:
- Query 3 content types (businesses, listings, products)
- Tab buttons + mobile dropdown
- 3 panel sections with grid layout

### Step 3: Clean up index.astro
**Action**: Remove skeleton and categories
**File**: `src/pages/index.astro`
**Changes**:
- Remove `<div slot="fallback">` skeleton
- Remove "Browse by Category" section

## Verification

```bash
# Build check
pnpm build

# Test tab functionality
curl http://localhost:4324 | grep -E "tab-btn|tab-panel"
```

## Component Structure

```
HomepageContent.astro
├── Tab Navigation (desktop buttons)
├── Mobile Dropdown
├── Tab Panels
│   ├── businesses panel
│   ├── listings panel
│   └── products panel
└── Script (tab switching)
```