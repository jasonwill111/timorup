-- Migration: Fix products table - rename fields and add categoryId
-- Date: 2026-05-14
--
-- Changes:
-- - Rename business_page_id → business_id
-- - Add category_id (NOT NULL)
-- - Remove price, price_unit (prices now in priceFields JSON)
-- - Add product_type default

-- 1. Rename business_page_id to business_id
ALTER TABLE products RENAME TO products_old;

CREATE TABLE products (
  id TEXT PRIMARY KEY NOT NULL,
  business_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  product_type TEXT DEFAULT 'product',
  price_fields TEXT,
  specifications TEXT,
  images TEXT,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

-- Copy data from old table
INSERT INTO products (id, business_id, category_id, title, slug, description, product_type, price_fields, specifications, images, featured, active, sort_order, created_at, updated_at)
SELECT
  id,
  business_page_id as business_id,
  COALESCE(category_id, '') as category_id,
  title,
  COALESCE(slug, lower(replace(replace(replace(title, ' ', '-'), '/', '-'), '--', '-')) || '-' || substr(id, 1, 8)) as slug,
  description,
  COALESCE(product_type, 'product') as product_type,
  price_fields,
  specifications,
  images,
  featured,
  active,
  sort_order,
  created_at,
  updated_at
FROM products_old
WHERE business_page_id IS NOT NULL;

-- Add indexes
CREATE INDEX products_business_idx ON products(business_id);
CREATE INDEX products_category_idx ON products(category_id);
CREATE INDEX products_active_idx ON products(active);
CREATE UNIQUE INDEX products_slug_idx ON products(slug);

-- Drop old table
DROP TABLE products_old;

-- 2. Create product_categories table
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