---
increment: 0067-d1-schema-fix
title: "D1 Database Schema Fix"
type: bug
priority: P1
status: planned
created: 2026-05-19
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: D1 Database Schema Fix

## Overview

Fix critical data integrity issues discovered during schema audit:
1. Add UNIQUE constraints to prevent duplicate data
2. Add missing columns to tables
3. Add performance indexes

## User Stories

### US-001: Prevent Duplicate Saved Items (P1)
**Project**: TimorLink

**As a** system
**I want** to enforce UNIQUE constraint on `saved_items(user_id, type, type_id)`
**So that** users cannot create duplicate bookmarks for the same entity

**Acceptance Criteria**:
- [x] **AC-US1-01**: UNIQUE index `saved_items_user_type_typeId_idx` exists on D1
- [x] **AC-US1-02**: Attempting to create duplicate saved_item returns error
- [x] **AC-US1-03**: Existing duplicate data is cleaned up before adding constraint

---

### US-002: Prevent Duplicate Reviews (P1)
**Project**: TimorLink

**As a** system
**I want** to enforce UNIQUE constraint on `reviews(user_id, business_id)`
**So that** users cannot submit multiple reviews for the same business

**Acceptance Criteria**:
- [x] **AC-US2-01**: UNIQUE index `reviews_user_business_idx` exists on D1
- [x] **AC-US2-02**: Attempting to create duplicate review returns error
- [x] **AC-US2-03**: Existing duplicate data is cleaned up before adding constraint

---

### US-003: Add Missing Columns (P1)
**Project**: TimorLink

**As a** system
**I want** to add missing columns to match schema definitions
**So that** all application features work correctly

**Acceptance Criteria**:
- [x] **AC-US3-01**: `public_sectors.government_data` TEXT column exists
- [x] **AC-US3-02**: `products.sort_order` INTEGER DEFAULT 0 column exists
- [x] **AC-US3-03**: All new columns accept NULL or have appropriate defaults

---

### US-004: Add Performance Indexes (P2)
**Project**: TimorLink

**As a** system
**I want** to add indexes for frequently queried columns
**So that** database queries perform optimally

**Acceptance Criteria**:
- [x] **AC-US4-01**: `products` table has indexes: business_idx, category_idx, slug_idx, active_idx
- [x] **AC-US4-02**: `listings` table has indexes: owner_idx, status_idx, category_idx, featured_idx, expires_idx
- [x] **AC-US4-03**: `service_packages` table has indexes: slug_idx, type_idx, category_idx, active_idx
- [x] **AC-US4-04**: `reviews` table has indexes: business_idx, user_idx, status_idx, user_business_idx
- [x] **AC-US4-05**: `saved_items` table has indexes: user_idx, type_idx, type_id_idx
- [x] **AC-US4-06**: `latest_updates` table has indexes: unique_idx, type_idx, type_id_idx
- [x] **AC-US4-07**: `media` table has indexes: entity_idx, purpose_idx, deleted_idx
- [x] **AC-US4-08**: `sessions` table has UNIQUE index: token_idx
- [x] **AC-US4-09**: `blog_posts` table has index: status_idx
- [x] **AC-US4-10**: `site_settings` table has UNIQUE index: key_idx

## Functional Requirements

### FR-001: Data Cleanup Before Constraints
Before adding UNIQUE constraints, identify and remove duplicate records:
- `saved_items`: Find users with multiple saves for same type+typeId, keep latest
- `reviews`: Find users with multiple reviews for same business, keep highest rated

### FR-002: Migration Script
Create D1 migration file with:
1. DROP existing problematic data
2. ADD columns
3. CREATE indexes

### FR-003: Verification
After migration:
- Verify indexes exist via `PRAGMA index_list(table)`
- Verify columns exist via `PRAGMA table_info(table)`
- Test constraint enforcement

## Success Criteria

1. All UNIQUE constraints created without errors
2. All missing columns added
3. All indexes created
4. Application still functions correctly after migration
5. Query performance improved (measurable via EXPLAIN)

## Out of Scope

- Changes to application code (UI/API)
- Schema migrations for tables not listed above
- Data migration for corrupted records

## Dependencies

- D1 database access (wrangler)
- Migration file execution
- Post-migration verification

## SQL Commands to Execute

```sql
-- CRITICAL: Clean up duplicates before adding constraints

-- Find duplicate saved_items
SELECT user_id, type, type_id, COUNT(*) as cnt
FROM saved_items
GROUP BY user_id, type, type_id
HAVING COUNT(*) > 1;

-- Find duplicate reviews
SELECT user_id, business_id, COUNT(*) as cnt
FROM reviews
GROUP BY user_id, business_id
HAVING COUNT(*) > 1;

-- Keep latest saved_item, delete duplicates
DELETE FROM saved_items WHERE id NOT IN (
  SELECT MAX(id) FROM saved_items GROUP BY user_id, type, type_id
);

-- Keep highest rating review, delete others
DELETE FROM reviews WHERE id NOT IN (
  SELECT MAX(id) FROM reviews GROUP BY user_id, business_id
);

-- Add UNIQUE constraints
CREATE UNIQUE INDEX saved_items_user_type_typeId_idx ON saved_items(user_id, type, type_id);
CREATE UNIQUE INDEX reviews_user_business_idx ON reviews(user_id, business_id);

-- Add missing columns
ALTER TABLE public_sectors ADD COLUMN government_data TEXT;
ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Add performance indexes
CREATE INDEX products_business_idx ON products(business_id);
CREATE INDEX products_category_idx ON products(category_id);
CREATE UNIQUE INDEX products_slug_idx ON products(slug);
CREATE INDEX products_active_idx ON products(active);

CREATE INDEX listings_owner_idx ON listings(owner_id);
CREATE INDEX listings_status_idx ON listings(status);
CREATE INDEX listings_category_idx ON listings(category_id);
CREATE INDEX listings_featured_idx ON listings(featured);
CREATE INDEX listings_expires_idx ON listings(expires_at);

CREATE UNIQUE INDEX service_packages_slug_idx ON service_packages(slug);
CREATE INDEX service_packages_type_idx ON service_packages(type);
CREATE INDEX service_packages_category_idx ON service_packages(category);
CREATE INDEX service_packages_active_idx ON service_packages(is_active);

CREATE INDEX reviews_business_idx ON reviews(business_id);
CREATE INDEX reviews_user_idx ON reviews(user_id);
CREATE INDEX reviews_status_idx ON reviews(status);

CREATE INDEX saved_items_user_idx ON saved_items(user_id);
CREATE INDEX saved_items_type_idx ON saved_items(type);
CREATE INDEX saved_items_type_id_idx ON saved_items(type_id);

CREATE UNIQUE INDEX latest_updates_unique ON latest_updates(type, type_id);
CREATE INDEX latest_updates_type_idx ON latest_updates(type);
CREATE INDEX latest_updates_type_id_idx ON latest_updates(type_id);

CREATE INDEX media_entity_idx ON media(entity_type, entity_id);
CREATE INDEX media_purpose_idx ON media(purpose);
CREATE INDEX media_deleted_idx ON media(deleted_at);

CREATE UNIQUE INDEX sessions_token_idx ON sessions(token);

CREATE INDEX blog_posts_status_idx ON blog_posts(status);

CREATE UNIQUE INDEX site_settings_key_idx ON site_settings(key);
```
