-- Migration: Unified Schema Sync
-- Date: 2026-05-13
-- Description: Sync remote D1 with unified schema

-- ============================================
-- Step 1: Create saved_items table
-- ============================================

CREATE TABLE IF NOT EXISTS saved_items (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  type_id TEXT NOT NULL,
  created_at INTEGER
);

CREATE INDEX IF NOT EXISTS saved_items_user_idx ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS saved_items_type_idx ON saved_items(type);
CREATE INDEX IF NOT EXISTS saved_items_type_id_idx ON saved_items(type_id);
CREATE UNIQUE INDEX IF NOT EXISTS saved_items_user_type_typeId_idx ON saved_items(user_id, type, type_id);

-- ============================================
-- Step 2: Create latest_updates table
-- ============================================

CREATE TABLE IF NOT EXISTS latest_updates (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  type_id TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  posted_date TEXT
);

CREATE INDEX IF NOT EXISTS latest_updates_type_idx ON latest_updates(type);
CREATE INDEX IF NOT EXISTS latest_updates_type_id_idx ON latest_updates(type_id);
CREATE INDEX IF NOT EXISTS latest_updates_created_idx ON latest_updates(created_at);

-- ============================================
-- Step 3: Migrate business_updates to latest_updates
-- ============================================

-- Check if business_updates exists and has data
-- SELECT COUNT(*) FROM business_updates;

-- Migrate data (if business_updates exists)
-- INSERT INTO latest_updates (id, type, type_id, content, images, created_at, posted_date)
-- SELECT id, 'businesses', business_id, content, images, created_at, posted_date FROM business_updates;

-- ============================================
-- Step 4: Drop product_images table
-- ============================================

-- Note: products.images field will store media IDs as JSON
-- DROP TABLE IF EXISTS product_images;

-- ============================================
-- Step 5: Migrate media table (optional - requires data migration)
-- ============================================

-- Current remote media has: type, business_id
-- New schema needs: type (as path prefix), type_id, hash, r2Key
--
-- This requires application-level migration to:
-- 1. Update media.type to new format (e.g., 'businesses/biz-123/profile')
-- 2. Copy business_id to type_id
-- 3. Generate hash and r2Key for existing records
--
-- For now, add new columns:
ALTER TABLE media ADD COLUMN type_id TEXT;
ALTER TABLE media ADD COLUMN hash TEXT;
ALTER TABLE media ADD COLUMN r2_key TEXT;

-- Make type NOT NULL
-- ALTER TABLE media MODIFY type TEXT NOT NULL;

-- ============================================
-- Step 6: Migrate reviews table (optional)
-- ============================================

-- Current remote reviews has: business_page_id, comment
-- New schema needs: business_id, content, title, reply, replied_at, replied_by, status
--
-- ALTER TABLE reviews RENAME TO reviews_old;
--
-- CREATE TABLE reviews (
--   id TEXT PRIMARY KEY NOT NULL,
--   business_id TEXT NOT NULL,
--   user_id TEXT NOT NULL,
--   rating INTEGER NOT NULL,
--   title TEXT,
--   content TEXT,
--   reply TEXT,
--   replied_at INTEGER,
--   replied_by TEXT,
--   is_edited INTEGER DEFAULT 0,
--   status TEXT DEFAULT 'pending',
--   created_at INTEGER,
--   updated_at INTEGER
-- );
--
-- CREATE INDEX IF NOT EXISTS reviews_business_idx ON reviews(business_id);
-- CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews(user_id);
-- CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews(status);
--
-- -- Migrate data
-- INSERT INTO reviews (id, business_id, user_id, rating, content, is_edited, created_at, updated_at)
-- SELECT id, business_page_id, user_id, rating, comment, is_edited, created_at, updated_at FROM reviews_old;

-- ============================================
-- Verification queries
-- ============================================

-- SELECT 'saved_items' as table_name, COUNT(*) as count FROM saved_items;
-- SELECT 'latest_updates' as table_name, COUNT(*) as count FROM latest_updates;
-- SELECT 'media' as table_name, COUNT(*) as count, SUM(CASE WHEN type_id IS NOT NULL THEN 1 ELSE 0 END) as migrated FROM media;
-- SELECT 'reviews' as table_name, COUNT(*) as count FROM reviews;

-- ============================================
-- Cleanup (after verifying migration)
-- ============================================

-- DROP TABLE IF EXISTS business_updates;
-- DROP TABLE IF EXISTS reviews_old;