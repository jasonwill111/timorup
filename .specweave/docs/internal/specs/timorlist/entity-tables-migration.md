---
name: Entity Tables Migration
description: Database migration to 4 separate tables for entities and 4 separate category tables
type: project
---

# Entity Tables Migration (2026-05-10)

## Overview

Migrated from single `businessPages` table to 4 separate entity tables. Each entity has its own category table.

## Database Tables

### Entity Tables (4)

| Table | Purpose | Features |
|-------|---------|----------|
| `businesses` | Business listings | +SKU, +Reviews, +Industry |
| `non_profits` | Non-Profit organizations | Full page, no SKU |
| `public_sectors` | Government/Public sectors | Full page, no SKU |
| `listings` | Classified ads (gumtree style) | Lightweight, expires in 3 days |

### Category Tables (4)

| Table | For Entity |
|-------|-------------|
| `business_categories` | businesses |
| `non_profit_categories` | non_profits |
| `public_sector_categories` | public_sectors |
| `listing_categories` | listings |

## Removed Fields

| Field | Removed From | Reason |
|-------|--------------|--------|
| `entityType` | All | Table IS the entity type |
| `organizationType` | non_profits | Table IS the entity type |
| `industry` | non_profits, public_sectors | Only businesses need industry |

## Schema Files

- `src/db/schema/businesses.ts`
- `src/db/schema/non-profits.ts`
- `src/db/schema/public-sectors.ts`
- `src/db/schema/listings.ts`

## API Endpoints (2026-05-11)

| Public API | Table | Purpose |
|-----------|-------|---------|
| `/api/businesses` | businesses | Business listings |
| `/api/non-profits` | non_profits | Non-Profit organizations |
| `/api/public-sectors` | public_sectors | Government/Public sectors |

| Admin API | Table | Purpose |
|-----------|-------|---------|
| `/api/admin/businesses` | businesses | Admin CRUD |
| `/api/admin/non-profits` | non_profits | Admin CRUD |
| `/api/admin/public-sectors` | public_sectors | Admin CRUD |
| `/api/admin/listing` | listings | Admin CRUD |

### Listings API (Server Actions)
Listings uses **Server Actions** instead of REST API:
- `src/actions/admin/listings.ts` — Admin CRUD operations
- `src/actions/listings.ts` — Public listing operations (create, update)

> Note: Each entity has its own API — no `type` parameter. The table IS the entity type.

## Status Values

All entity tables support dual status values:

| Status | Meaning |
|--------|---------|
| `live` | Active and visible |
| `published` | Published but may need renewal |
| `draft` | Not visible |

APIs filter: `status IN ('live', 'published')`

## Required Tables

| Table | Used By | Purpose |
|-------|---------|---------|
| `businesses` | Business pages | Main business data |
| `non_profits` | Non-Profit pages | NGO/government data |
| `public_sectors` | Public Sector pages | Government agencies |
| `business_updates` | All entity detail pages | News/updates feed |
| `business_categories` | Businesses | Industry categories |
| `non_profit_categories` | Non-Profits | Mission categories |
| `public_sector_categories` | Public Sectors | Agency categories |

## Frontend Routes

| Entity | List | Detail | Admin |
|--------|------|--------|-------|
| Business | /businesses | /business/[slug] | /admin/businesses |
| Non-Profit | /non-profits | /non-profit/[slug] | /admin/non-profits |
| Public Sector | /public-sectors | /public-sector/[slug] | /admin/public-sectors |
| Listing | /listings | /listing/[slug] | /admin/listings |

## Feature Differences

| Feature | Businesses | Non-Profits | Public Sectors | Listings |
|---------|-----------|--------------|-----------------|----------|
| Products/Services (SKU) | ✅ | ❌ | ❌ | ❌ |
| Reviews | ✅ | ❌ | ❌ | ❌ |
| Industry | ✅ | ❌ | ❌ | ❌ |
| LatestUpdate | ✅ | ✅ | ✅ | ❌ |
| Photo Gallery | ✅ (16 img + 2 vid) | ✅ (16 img + 2 vid) | ✅ (16 img + 2 vid) | ❌ |
| Images limit | 16 + 2 video | 16 + 2 video | 16 + 2 video | 8 + 1 video |
| Categories | business_categories | non_profit_categories | public_sector_categories | listing_categories (58 total) |

### Admin Edit Functionality

All 4 admin entity pages support Edit functionality for admin to modify content and create pages on behalf of users.

| Page | Route | Edit Button | Modal/Redirect |
|------|-------|-------------|----------------|
| Businesses | /admin/businesses | ✅ | Modal with pre-filled form |
| Listings | /admin/listings | ✅ | Edit button (redirect placeholder) |
| Non-Profits | /admin/non-profits | ✅ | Modal with pre-filled form |
| Public Sectors | /admin/public-sectors | ✅ | Modal with pre-filled form |

**Implementation**:
- Edit button per entity row
- Click → modal opens with pre-filled form
- Modal title changes to "Edit [Entity]"
- Submit uses PUT (edit) or POST (create) based on editingId state
- Typo fixes: "PublicSectoror" → "Public Sector", "NonProfit" → "Non-Profit"

### Listing Categories (58)

**一级分类 (12):**
- For Sale, Vehicles, Property, Jobs, Services, Community, Pets, Free
- Sports & Outdoors, Music & Instruments, Books & Media, Agriculture

**二级分类 (~50):**
- Each parent has 3-6 subcategories
- Covers: Electronics, Furniture, Vehicles, Apartments, Jobs, Beauty, Pets, etc.
- Plus Timor-Leste relevant: Agriculture, Fishing, Livestock

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/seed-listings.sql` | 19 sample listings (job, product, service, vehicle, property, wanted) |
| `scripts/migrate-entity-tables.sql` | Migration from business_pages to new tables |

## Admin Edit Functionality (2026-05-11)

All 4 admin entity pages now support Edit functionality:

| Page | Route | Edit Button | Implementation |
|------|-------|-------------|----------------|
| Businesses | /admin/businesses | ✅ | Modal with pre-filled form, PUT/P POST based on editingId |
| Listings | /admin/listings | ✅ | Edit button → redirect to edit page (alert placeholder) |
| Non-Profits | /admin/non-profits | ✅ | Modal with pre-filled form, PUT/P POST based on editingId |
| Public Sectors | /admin/public-sectors | ✅ | Modal with pre-filled form, PUT/P POST based on editingId |

**Key Features**:
- Edit button per entity row
- Click → modal opens with pre-filled form
- Modal title changes to "Edit [Entity]"
- Submit uses PUT (edit) or POST (create) based on editingId state
- Cancel/close resets editingId

## Changelog

### 2026-05-11 (Admin Edit Functionality - Increment 0049)
- **Edit Buttons**: Added Edit button to all 4 admin entity pages (businesses, listings, non-profits, public-sectors)
- **Edit Modal**: Click Edit → modal opens with pre-filled form, modal title changes to "Edit [Entity]"
- **Create/Edit Logic**: Submit uses PUT (edit) or POST (create) based on editingId state
- **Typo Fixes**: "PublicSectoror" → "Public Sector", "NonProfit" → "Non-Profit"
- **Listings Actions**: Fixed import conflict (`import { listings as listingsTable }` for Drizzle table vs `export const listings` for server actions)

### 2026-05-11 (Admin QA Fixes - Increment 0048)
- **Stats API Fix**: Updated `/api/admin/stats` to use new entity tables (businesses, nonProfits, publicSectors, listings) instead of old `businessPages` table
- **Listings Date Fix**: Added `formatDate()` helper to handle null/string/number date values
- **Categories Badge Fix**: Changed badge logic to use `currentTable` instead of `cat.entityType`
- **Public Sectors Typo**: Fixed "PublicSectorores" → "Public Sector"
- **Status Badge Fix**: Added `capitalizeFirst()` helper for status display

### 2026-05-11 (Admin Sidebar + Auth Fix)
- **Admin Sidebar**: Added Businesses, Non-Profits, Gov & NGOs navigation links
- **Sidebar Compact**: Reduced width (w-56→w-48), tighter spacing (py-3→py-2, gap-3→gap-2)
- **Auth Fix**: better-auth 使用 scrypt 密码哈希（非 bcrypt），修复 session cookie 问题
- **Cookie**: 开发环境使用 SameSite=Lax

### 2026-05-11 (List Pages UI Enhancement)
- **List Pages Card Design**: Unified card design across all 4 entity pages
- **Pagination**: Added 12 items/page pagination to all list pages
- **Category Filters**: Working parent/child category dropdowns on all pages
- **Card Display Elements**:
  - Industry badge (primary yellow background) for businesses
  - Category badge (colored by entity type) for non-profits/public-sectors
  - Type badge (color-coded) + price for listings
  - Bold title with `line-clamp-2`
  - Location with pin icon
  - 5-star rating system with count for businesses
  - Heart likes + eye views stats
- **Brand Colors**: Yellow (#FFD150) hover effects on cards
- **List Pages Updated**:
  - `/businesses` - Industries, ratings, likes, views
  - `/non-profits` - Categories (rose badge), likes, views
  - `/public-sectors` - Categories (blue badge), likes, views
  - `/listings` - Type colors (Job/Product/Service/Property/Vehicle/Wanted), price, likes, views

### 2026-05-11
- Added `business_updates` table (was missing)
- Fixed status filter to support both `live` and `published`
- Added search and category filters to businesses list page
- Created independent APIs for each entity type (removed unified type parameter)

### 2026-05-11 (Afternoon)
- **UI/UX Updates**:
  - Unified card design across all 4 entity pages
  - Added pagination (12 items/page) to all list pages
  - Enhanced card display: title, address, category badge, stats (likes, views, rating)
  - Brand yellow (#FFD150) hover effects on cards
  - Category dropdown filters work on all list pages
  - Search form submission for all list pages
- **Listing Type Colors**: Job (blue), Product (emerald), Service (purple), Property (amber), Vehicle (red), Wanted (teal)
- **Homepage Updates**:
  - "Explore Timor-Leste" section with 4 colored entity cards
  - Improved hero gradient using brand colors
  - Enhanced CTA section with brand styling