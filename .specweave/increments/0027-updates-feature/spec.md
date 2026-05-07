---
name: updates-feature
description: Business/Non-profit Updates (News) - posts with text, images, SKU/hashtag mentions
status: ready_for_review
created: 2026-05-07
---

# Updates Feature Specification

## Overview

Add "Updates" section to business/non-profit detail pages for posting short announcements (promotions, new products, events, volunteer opportunities).

## Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Display limit | 4 posts max | Keeps section concise |
| Text limit | 140 chars | Encourages brevity |
| Images | 4 max, optional | Visual enhancement |
| Frequency | 1 post per day | Prevents spam |
| SKU mention | @SKU-XXX links | Drives product discovery |
| Hashtag | #tag for non-profits | Alternative to SKU |
| Position | Below About Us | Supplementary content |

## Data Model

### Schema Changes

```sql
-- New table: business_updates
CREATE TABLE business_updates (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES business_pages(id),
  content TEXT NOT NULL,           -- max 140 chars
  images JSON,                      -- ['media-id-1', ...] max 4
  created_at INTEGER NOT NULL,      -- unix timestamp
  posted_date DATE NOT NULL         -- for daily limit check
);

-- Add to business_pages for quick access (latest 4)
-- or keep as separate table with JOIN
```

### API Endpoint

```
POST /api/businesses/:slug/updates
Body: { content: string, images?: string[] }
Response: { success: true, update: {...} }

GET /api/businesses/:slug/updates
Response: { updates: [...] }
```

## UI Design

```
┌─────────────────────────────────────┐
│ 📢 Updates                    [+]  │
├─────────────────────────────────────┤
│ "New almond croissants just         │
│  arrived! @SKU-CRO01"              │
│ 2 hours ago                        │
│ [img1] [img2] [img3] [img4]       │
├─────────────────────────────────────┤
│ "Volunteer day this Saturday!      │
│  #volunteer #community"            │
│ 1 day ago                          │
└─────────────────────────────────────┘
```

### Content Parsing

- `@SKU-XXX` → Blue link to product page
- `#hashtag` → Blue link to search for tag
- Auto-linkify URLs

## Implementation Tasks

### T-001: Database Schema
- [x] Create business_updates table
- [x] Add Drizzle schema

### T-002: API Endpoints
- [x] POST /api/businesses/:slug/updates
- [x] GET /api/businesses/:slug/updates
- [x] Daily limit check (1 per day)
- [x] DELETE endpoint for removing updates

### T-003: Component
- [x] UpdatesSection.astro
- [x] Content parsing (SKU, #tags)
- [x] Image grid display
- [x] Relative time display

### T-004: Integration
- [x] Add to business/[slug].astro
- [x] Add to non-profit/[slug].astro

### T-005: Admin Form
- [ ] Update edit form to add updates (V2)

## Acceptance Criteria

- [x] AC-001: Users can create updates with text (140 char limit)
- [x] AC-002: Users can attach up to 4 images
- [x] AC-003: @SKU mentions become clickable links
- [x] AC-004: #hashtags become clickable links
- [x] AC-005: Maximum 4 updates displayed per business
- [x] AC-006: Daily post limit enforced (1/day)
- [x] AC-007: Updates display below About Us section
- [x] AC-008: Updates show relative time ("2 hours ago")
