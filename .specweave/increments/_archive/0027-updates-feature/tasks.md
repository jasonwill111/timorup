# Tasks: Updates Feature

## T-001: Database Schema
**Status**: completed
**Test**: Given new business → When query updates → Then returns empty array

```sql
CREATE TABLE business_updates (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  content TEXT NOT NULL,
  images JSON DEFAULT '[]',
  created_at INTEGER NOT NULL,
  posted_date TEXT NOT NULL
);
```

## T-002: API Endpoints
**Status**: completed
**Test**: Given valid content → When POST → Then update created with today's date

- POST /api/businesses/:slug/updates
- GET /api/businesses/:slug/updates
- Daily limit check

## T-003: UpdatesSection Component
**Status**: completed
**Test**: Given update with @SKU-001 → When rendered → Then shows blue link

- Content parsing (regex for @SKU-XXX and #hashtag)
- Image grid (up to 4)
- Relative time helper

## T-004: Integration
**Status**: completed
**Test**: Given business page → When loads → Then shows Updates below About

- Add to business/[slug].astro
- Add to non-profit/[slug].astro

## T-005: Admin Form
**Status**: deferred (V2)
**Test**: Given edit page → When user posts → Then shows in updates list

- Form for creating updates
- List of existing updates with delete
