-- Migration: Add formFields to category tables + extend servicePackages
-- Generated: 2026-05-14

-- ============================================
-- Create blog_categories if not exists
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX IF NOT EXISTS blog_categories_slug_idx ON blog_categories (slug);

-- ============================================
-- Add formFields to business_categories (if column not exists)
-- ============================================
ALTER TABLE business_categories ADD COLUMN form_fields TEXT;

-- ============================================
-- Update service_packages schema
-- ============================================
ALTER TABLE service_packages ADD COLUMN tier TEXT;
ALTER TABLE service_packages ADD COLUMN billing_period TEXT;
ALTER TABLE service_packages ADD COLUMN is_default INTEGER DEFAULT 0;

-- ============================================
-- Indexes for new columns
-- ============================================
CREATE INDEX IF NOT EXISTS service_packages_tier_idx ON service_packages (tier);
CREATE INDEX IF NOT EXISTS business_categories_parent_idx ON business_categories (parent_id);
CREATE INDEX IF NOT EXISTS non_profit_categories_parent_idx ON non_profit_categories (parent_id);
CREATE INDEX IF NOT EXISTS public_sector_categories_parent_idx ON public_sector_categories (parent_id);