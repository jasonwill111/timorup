-- Migration: Fix products table - rename fields and add missing
-- Date: 2026-05-14

-- 1. Rename business_page_id to business_id
ALTER TABLE products RENAME TO products_old;

CREATE TABLE products (
  id TEXT PRIMARY KEY NOT NULL,
  business_id TEXT NOT NULL,
  category_id TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  product_type TEXT DEFAULT 'product',
  price TEXT,
  price_unit TEXT,
  price_fields TEXT,
  specifications TEXT,
  images TEXT,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

-- Copy data from old table (skip rows with NULL business_page_id)
INSERT INTO products (id, business_id, category_id, title, slug, description, price_fields, price, price_unit, specifications, featured, active, created_at, updated_at)
SELECT
  id,
  business_page_id as business_id,
  category_id,
  title,
  lower(replace(replace(replace(title, ' ', '-'), '/', '-'), '--', '-')) || '-' || substr(id, 1, 8) as slug,
  description,
  price_fields,
  price,
  price_unit,
  specifications,
  featured,
  active,
  created_at,
  updated_at
FROM products_old
WHERE business_page_id IS NOT NULL;

-- Add indexes
CREATE INDEX products_business_idx ON products(business_id);
CREATE INDEX products_category_idx ON products(category_id);
CREATE INDEX products_active_idx ON products(active);

-- Drop old table
DROP TABLE products_old;