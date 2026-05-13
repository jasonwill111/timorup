-- Migration: Split categories into 4 independent tables
-- Date: 2026-05-13
-- Description: Replace single categories table with entity-specific category tables

-- ============================================
-- Step 1: Create new category tables
-- ============================================

CREATE TABLE IF NOT EXISTS business_categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '',
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS non_profit_categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '',
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS public_sector_categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '',
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS listing_categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '',
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- ============================================
-- Step 2: Migrate data from categories table
-- ============================================

-- Move business categories
INSERT INTO business_categories (id, name, slug, description, icon, parent_id, created_at, updated_at)
SELECT id, name, slug, description, icon, parent_id, created_at, updated_at
FROM categories
WHERE entity_type = 'business' OR entity_type IS NULL;

-- Move nonprofit categories
INSERT INTO non_profit_categories (id, name, slug, description, icon, parent_id, created_at, updated_at)
SELECT id, name, slug, description, icon, parent_id, created_at, updated_at
FROM categories
WHERE entity_type = 'nonprofit';

-- Move public sector categories (if any)
INSERT INTO public_sector_categories (id, name, slug, description, icon, parent_id, created_at, updated_at)
SELECT id, name, slug, description, icon, parent_id, created_at, updated_at
FROM categories
WHERE entity_type = 'public_sector';

-- Move listing categories
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, created_at, updated_at)
SELECT id, name, slug, description, icon, parent_id, created_at, updated_at
FROM categories
WHERE entity_type = 'listing';

-- ============================================
-- Step 3: Create indexes
-- ============================================

CREATE INDEX IF NOT EXISTS biz_cat_parent_idx ON business_categories(parent_id);
CREATE INDEX IF NOT EXISTS biz_cat_active_idx ON business_categories(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS biz_cat_slug_unique ON business_categories(slug);

CREATE INDEX IF NOT EXISTS np_cat_parent_idx ON non_profit_categories(parent_id);
CREATE INDEX IF NOT EXISTS np_cat_active_idx ON non_profit_categories(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS np_cat_slug_unique ON non_profit_categories(slug);

CREATE INDEX IF NOT EXISTS ps_cat_parent_idx ON public_sector_categories(parent_id);
CREATE INDEX IF NOT EXISTS ps_cat_active_idx ON public_sector_categories(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS ps_cat_slug_unique ON public_sector_categories(slug);

CREATE INDEX IF NOT EXISTS list_cat_parent_idx ON listing_categories(parent_id);
CREATE INDEX IF NOT EXISTS list_cat_active_idx ON listing_categories(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS list_cat_slug_unique ON listing_categories(slug);

-- ============================================
-- Step 4: Remove entityType from business_pages
-- ============================================

-- Drop the entity_type index (if exists)
DROP INDEX IF EXISTS business_entity_type_idx;

-- Remove entityType column from business_pages (run separately if column exists)
-- ALTER TABLE business_pages DROP COLUMN IF EXISTS entity_type;

-- ============================================
-- Step 5: Remove entityType/entityId from media
-- ============================================

-- Drop composite index (if exists)
DROP INDEX IF EXISTS media_entity_idx;

-- Remove columns from media (run separately if columns exist)
-- ALTER TABLE media DROP COLUMN IF EXISTS entity_type;
-- ALTER TABLE media DROP COLUMN IF EXISTS entity_id;

-- ============================================
-- Step 6: Backup and drop old categories table
-- ============================================

-- Create backup (optional - run manually if needed)
-- CREATE TABLE categories_backup AS SELECT * FROM categories;

-- Drop old table (run after verifying migration)
-- DROP TABLE IF EXISTS categories;

-- ============================================
-- Verification queries (run after migration)
-- ============================================

-- SELECT 'business_categories' as table_name, COUNT(*) as count FROM business_categories;
-- SELECT 'non_profit_categories' as table_name, COUNT(*) as count FROM non_profit_categories;
-- SELECT 'public_sector_categories' as table_name, COUNT(*) as count FROM public_sector_categories;
-- SELECT 'listing_categories' as table_name, COUNT(*) as count FROM listing_categories;