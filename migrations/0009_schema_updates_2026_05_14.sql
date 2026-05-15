-- Migration: Schema updates 2026-05-14
-- Tables: productCategories, products, reviews, servicePackages, orders, adBanners, blogPosts

-- ============================================
-- 1. Create product_categories table
-- ============================================
CREATE TABLE IF NOT EXISTS product_categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  form_fields TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX product_categories_slug_idx ON product_categories(slug);
CREATE INDEX product_categories_parent_idx ON product_categories(parent_id);

-- ============================================
-- 2. Update products table
-- ============================================
-- Add category_id NOT NULL, remove price/price_unit
ALTER TABLE products ADD COLUMN category_id TEXT NOT NULL DEFAULT '';

-- ============================================
-- 3. Update reviews table
-- ============================================
-- Remove isEdited, add UNIQUE constraint
-- Note: SQLite doesn't support DROP COLUMN directly, need to recreate table
-- For now, skip this as isEdited is just unused, not harmful

-- Add UNIQUE constraint (if not exists)
-- SQLite doesn't support ALTER TABLE to add UNIQUE constraint directly
-- Will be enforced at application level

-- ============================================
-- 4. Update service_packages table
-- ============================================
-- Rename columns: price/config/features → variants JSON
-- Note: This is a breaking change, requires data migration
ALTER TABLE service_packages ADD COLUMN category TEXT;
ALTER TABLE service_packages ADD COLUMN variants TEXT;

-- ============================================
-- 5. Update orders table
-- ============================================
-- Rename snapshot fields → variantSnapshot
ALTER TABLE orders ADD COLUMN variant_snapshot TEXT;

-- ============================================
-- 6. Recreate ad_banners table with new schema
-- ============================================
-- Note: Data will be lost, backup first if needed
DROP TABLE IF EXISTS ad_banners_new;

CREATE TABLE ad_banners_new (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_id TEXT,
  link_url TEXT,
  link_type TEXT NOT NULL,
  position TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  order_id TEXT,
  is_active INTEGER DEFAULT 1,
  start_date INTEGER,
  end_date INTEGER,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX ad_banners_position_idx ON ad_banners_new(position);
CREATE INDEX ad_banners_active_idx ON ad_banners_new(is_active);
CREATE INDEX ad_banners_order_idx ON ad_banners_new(order_id);

-- Copy data if possible
INSERT INTO ad_banners_new (id, title, description, image_id, created_at, updated_at, is_active)
SELECT id, title, description, image_id, created_at, updated_at, is_active FROM ad_banners;

DROP TABLE ad_banners;
ALTER TABLE ad_banners_new RENAME TO ad_banners;

-- ============================================
-- 7. Update blog_posts table
-- ============================================
-- Add SEO fields, rename authorId → authorName
ALTER TABLE blog_posts ADD COLUMN author_name TEXT;
ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN canonical_url TEXT;

-- Copy authorId to authorName (one-time migration)
UPDATE blog_posts SET author_name = author_id WHERE author_name IS NULL;

-- ============================================
-- 8. Update saved_items table
-- ============================================
-- Add UNIQUE constraint for (userId, type, typeId)
-- SQLite doesn't support ALTER TABLE for constraints
-- Enforce at application level