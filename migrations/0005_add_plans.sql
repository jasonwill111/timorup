-- Migration: Add plans table
-- Create plans table for subscription management

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  amount INTEGER NOT NULL,
  sku_limit INTEGER NOT NULL DEFAULT 10,
  max_images INTEGER NOT NULL DEFAULT 5,
  max_videos INTEGER NOT NULL DEFAULT 1,
  features TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);

-- Create index on sort_order for efficient ordering
CREATE INDEX IF NOT EXISTS plans_sort_order_idx ON plans(sort_order);
CREATE INDEX IF NOT EXISTS plans_active_idx ON plans(active);

-- Seed initial plans
INSERT OR IGNORE INTO plans (id, name, period, amount, sku_limit, max_images, max_videos, features, description, sort_order, active, created_at, updated_at) VALUES
  ('basic-monthly', 'Basic', 'monthly', 29, 10, 5, 1, '["10 products/services", "5 images per product", "Photo gallery", "Map integration", "Customer reviews", "Business page with full details", "Contact information"]', 'For small businesses getting started', 1, 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('basic-yearly', 'Basic', 'yearly', 290, 10, 5, 1, '["10 products/services", "5 images per product", "Photo gallery", "Map integration", "Customer reviews", "Business page with full details", "Contact information", "Save 17% with annual billing"]', 'Save 17% with annual billing', 2, 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('pro-monthly', 'Pro', 'monthly', 59, 30, 5, 1, '["30 products/services", "5 images per product", "Priority support", "Enhanced visibility", "Photo gallery", "Map integration", "Customer reviews", "All Basic features"]', 'For growing businesses', 3, 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('pro-yearly', 'Pro', 'yearly', 590, 30, 5, 1, '["30 products/services", "5 images per product", "Priority support", "Enhanced visibility", "Photo gallery", "Map integration", "Customer reviews", "All Basic features", "Save 17% with annual billing"]', 'Save 17% with annual billing', 4, 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('max-monthly', 'Max', 'monthly', 89, 60, 5, 1, '["60 products/services", "5 images per product", "Dedicated support", "Featured placement", "Priority support", "Enhanced visibility", "All Pro features"]', 'For established businesses', 5, 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('max-yearly', 'Max', 'yearly', 890, 60, 5, 1, '["60 products/services", "5 images per product", "Dedicated support", "Featured placement", "Priority support", "Enhanced visibility", "All Pro features", "Save 17% with annual billing"]', 'Save 17% with annual billing', 6, 1, strftime('%s', 'now'), strftime('%s', 'now'));
