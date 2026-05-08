# Business Detail Page Enhancement - Specification

## Context

Increase business willingness-to-pay by adding professional features to the detail page:
- yearOfEstablishment (trust signal)
- socialLinks (multi-channel presence)
- photoGallery (visual portfolio)
- latestUpdate (engagement, weekly cadence)
- gallery lightbox (immersive viewing)

## User Stories

### US-001: Business Profile Enhancement
As a business owner, I want to display my establishment year, social media links, and photo gallery so customers can verify my credibility and see my business visually.

### US-002: Latest Update Feature
As a business owner, I want to post weekly updates about promotions, events, or news so customers stay engaged and return to my page.

### US-003: Gallery Lightbox
As a visitor, I want to view business photos in fullscreen with navigation so I can examine details closely.

## Acceptance Criteria

### AC-001: Statistics Display
- [x] views count displayed below Eye icon
- [x] likes count displayed below Heart icon
- [x] saves count displayed below Bookmark icon

### AC-002: Year of Establishment
- [x] Displayed as "Est. YYYY" near stats
- [x] Field stored in business_pages.yearOfEstablishment

### AC-003: Social Links
- [x] Facebook icon (blue) linking to business Facebook page
- [x] Instagram icon (pink) linking to business Instagram
- [x] TikTok icon (black) linking to business TikTok
- [x] Only show icons for provided links

### AC-004: Photo Gallery
- [x] 3x2 grid layout for up to 6 images
- [x] Optional video display
- [x] Empty state with placeholder

### AC-005: Latest Update
- [x] Textarea input (500 char limit)
- [x] Upload up to 3 images
- [x] Weekly update cooldown enforced
- [x] Display above Products & Services section
- [x] Left border accent highlight

### AC-006: Gallery Lightbox
- [x] Click image → fullscreen modal
- [x] Left/Right arrow buttons for navigation
- [x] Keyboard support (ESC to close, Arrow keys)
- [x] Click outside to close

## Schema Changes

```sql
-- business_pages table additions
ALTER TABLE business_pages ADD COLUMN year_of_establishment INTEGER;
ALTER TABLE business_pages ADD COLUMN social_links TEXT; -- JSON: {facebook, instagram, tiktok}
ALTER TABLE business_pages ADD COLUMN photo_gallery TEXT; -- JSON Array of media IDs
ALTER TABLE business_pages ADD COLUMN latest_update TEXT;
ALTER TABLE business_pages ADD COLUMN latest_update_images TEXT; -- JSON Array (max 3)
ALTER TABLE business_pages ADD COLUMN latest_update_date INTEGER; -- timestamp
```

## Updated Files

| File | Changes |
|------|---------|
| src/db/schema/index.ts | New fields |
| src/pages/business/[slug].astro | Display logic + lightbox |
| src/pages/business/[slug]/edit/index.astro | Edit form for new fields |
| src/db/seed.ts | Sample data with new fields |
| docs/index.md | v12.0 documentation |
| docs/ARCHITECTURE.md | v8.0 section 12 |
| docs/PRD.md | v3.2 schema update |

## Status

**Completed**: 2026-04-26
