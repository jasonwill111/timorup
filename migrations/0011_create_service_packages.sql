-- Migration: Create service_packages table
-- Date: 2026-05-14
-- Replaces old plans table with new service_packages schema

CREATE TABLE IF NOT EXISTS service_packages (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,                    -- 'subscription' | 'listing_renewal' | 'featured' | 'addon'
  category TEXT,                          -- 'business' | 'listing' | 'other'
  description TEXT,
  variants TEXT NOT NULL,                -- JSON: [{ name, price, currency, durationValue, durationUnit, limits, features }]
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX service_packages_slug_idx ON service_packages(slug);
CREATE INDEX service_packages_type_idx ON service_packages(type);
CREATE INDEX service_packages_category_idx ON service_packages(category);
CREATE INDEX service_packages_active_idx ON service_packages(is_active);