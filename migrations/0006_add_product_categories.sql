-- Migration: Add productCategories table and categoryId to products
-- Date: 2026-05-14

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
-- 2. Add categoryId to products table
-- ============================================
ALTER TABLE products ADD COLUMN category_id TEXT;

CREATE INDEX products_category_idx ON products(category_id);