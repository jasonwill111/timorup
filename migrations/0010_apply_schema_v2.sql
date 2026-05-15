-- Migration: Apply schema changes 2026-05-14 (Part 2)
-- Updates for: orders, ad_banners, blog_posts

-- ============================================
-- 1. Update orders table
-- ============================================
ALTER TABLE orders RENAME TO orders_old;

CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,
  service_package_id TEXT,
  variant_snapshot TEXT,
  type TEXT,
  type_id TEXT,
  user_id TEXT,
  amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  paid_date INTEGER,
  expires_at INTEGER,
  admin_notes TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Copy data with variant_snapshot as JSON
INSERT INTO orders (id, user_id, amount, status, payment_method, paid_date, admin_notes, created_at, updated_at, variant_snapshot)
SELECT
  id,
  user_id,
  amount,
  status,
  payment_method,
  paid_date,
  admin_notes,
  created_at,
  updated_at,
  '{"planType":"' || COALESCE(plan_type, '') || '","expiryDate":' || COALESCE(expiry_date, 'null') || '}'
FROM orders_old;

DROP TABLE orders_old;

CREATE INDEX orders_user_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);

-- ============================================
-- 2. Recreate ad_banners table
-- ============================================
DROP TABLE IF EXISTS ad_banners_new;

CREATE TABLE ad_banners_new (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_id TEXT,
  link_url TEXT,
  link_type TEXT NOT NULL DEFAULT 'business',
  position TEXT NOT NULL DEFAULT 'homepage',
  sort_order INTEGER DEFAULT 0,
  order_id TEXT,
  is_active INTEGER DEFAULT 1,
  start_date INTEGER,
  end_date INTEGER,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX ad_banners_id_idx ON ad_banners_new(id);
CREATE INDEX ad_banners_position_idx ON ad_banners_new(position);
CREATE INDEX ad_banners_order_idx ON ad_banners_new(order_id);

-- Copy old data (map old columns to new)
INSERT INTO ad_banners_new (id, title, description, image_id, is_active, start_date, end_date, created_at, updated_at)
SELECT id, title, description, image_id, is_active, start_date, end_date, created_at, updated_at
FROM ad_banners;

DROP TABLE ad_banners;
ALTER TABLE ad_banners_new RENAME TO ad_banners;

-- ============================================
-- 3. Update blog_posts table
-- ============================================
ALTER TABLE blog_posts ADD COLUMN author_name TEXT;
ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN canonical_url TEXT;

-- Copy author_id to author_name
UPDATE blog_posts SET author_name = author_id WHERE author_name IS NULL;