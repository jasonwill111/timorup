-- Migration: Sync Remote D1 to Local Schema (Safe Version)
-- Created: 2026-05-15
-- Only adds missing columns/tables - skips if already exists

-- ============================================
-- PART 1: Create missing tables
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

CREATE TABLE IF NOT EXISTS service_packages (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  variants TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

-- ============================================
-- PART 2: Add missing columns (ONLY if not exists)
-- ============================================

-- non_profit_categories: add entity_type
ALTER TABLE non_profit_categories ADD COLUMN entity_type TEXT DEFAULT 'nonprofit';

-- public_sector_categories: add entity_type
ALTER TABLE public_sector_categories ADD COLUMN entity_type TEXT DEFAULT 'government';

-- listings: add missing columns
ALTER TABLE listings ADD COLUMN location_lat REAL;
ALTER TABLE listings ADD COLUMN location_lng REAL;
ALTER TABLE listings ADD COLUMN extra_data TEXT;
ALTER TABLE listings ADD COLUMN last_renewed_at INTEGER;
ALTER TABLE listings ADD COLUMN featured INTEGER DEFAULT 0;
ALTER TABLE listings ADD COLUMN featured_until INTEGER;

-- businesses: add missing columns
ALTER TABLE businesses ADD COLUMN limits TEXT;
ALTER TABLE businesses ADD COLUMN plan_slug TEXT;
ALTER TABLE businesses ADD COLUMN subscription_expires_at INTEGER;
ALTER TABLE businesses ADD COLUMN government_data TEXT;

-- non_profits: add government_data
ALTER TABLE non_profits ADD COLUMN government_data TEXT;

-- products: add missing columns
ALTER TABLE products ADD COLUMN slug TEXT;
ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN updated_at INTEGER;

-- latest_updates: add missing columns
ALTER TABLE latest_updates ADD COLUMN image_ids TEXT;
ALTER TABLE latest_updates ADD COLUMN video_id TEXT;

-- site_settings: add missing columns
ALTER TABLE site_settings ADD COLUMN type TEXT DEFAULT 'string';
ALTER TABLE site_settings ADD COLUMN description TEXT;
ALTER TABLE site_settings ADD COLUMN is_public INTEGER DEFAULT 0;

-- ============================================
-- PART 3: Create indexes (IF NOT EXISTS)
-- ============================================

-- service_packages indexes
CREATE UNIQUE INDEX IF NOT EXISTS service_packages_slug_idx ON service_packages(slug);
CREATE INDEX IF NOT EXISTS service_packages_type_idx ON service_packages(type);
CREATE INDEX IF NOT EXISTS service_packages_category_idx ON service_packages(category);
CREATE INDEX IF NOT EXISTS service_packages_active_idx ON service_packages(is_active);

-- accounts index
CREATE INDEX IF NOT EXISTS accounts_user_idx ON accounts(user_id);

-- sessions indexes
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS sessions_token_idx ON sessions(token);

-- verifications index
CREATE INDEX IF NOT EXISTS verifications_expires_idx ON verifications(expires_at);

-- users indexes
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- listings indexes
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_idx ON listings(slug);
CREATE INDEX IF NOT EXISTS listings_owner_idx ON listings(owner_id);
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings(status);
CREATE INDEX IF NOT EXISTS listings_category_idx ON listings(category_id);
CREATE INDEX IF NOT EXISTS listings_featured_idx ON listings(featured);
CREATE INDEX IF NOT EXISTS listings_expires_idx ON listings(expires_at);

-- businesses indexes
CREATE UNIQUE INDEX IF NOT EXISTS businesses_slug_idx ON businesses(slug);
CREATE INDEX IF NOT EXISTS businesses_owner_idx ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS businesses_status_idx ON businesses(status);
CREATE INDEX IF NOT EXISTS businesses_category_idx ON businesses(category_id);
CREATE INDEX IF NOT EXISTS businesses_subscription_status_idx ON businesses(subscription_status);

-- non_profits indexes
CREATE UNIQUE INDEX IF NOT EXISTS non_profits_slug_idx ON non_profits(slug);
CREATE INDEX IF NOT EXISTS non_profits_owner_idx ON non_profits(owner_id);
CREATE INDEX IF NOT EXISTS non_profits_status_idx ON non_profits(status);
CREATE INDEX IF NOT EXISTS non_profits_category_idx ON non_profits(category_id);

-- public_sectors indexes
CREATE UNIQUE INDEX IF NOT EXISTS public_sectors_slug_idx ON public_sectors(slug);
CREATE INDEX IF NOT EXISTS public_sectors_owner_idx ON public_sectors(owner_id);
CREATE INDEX IF NOT EXISTS public_sectors_status_idx ON public_sectors(status);
CREATE INDEX IF NOT EXISTS public_sectors_category_idx ON public_sectors(category_id);

-- products indexes
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_business_idx ON products(business_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_active_idx ON products(active);

-- latest_updates indexes
CREATE UNIQUE INDEX IF NOT EXISTS latest_updates_unique ON latest_updates(type, type_id);
CREATE INDEX IF NOT EXISTS latest_updates_type_idx ON latest_updates(type);
CREATE INDEX IF NOT EXISTS latest_updates_type_id_idx ON latest_updates(type_id);

-- blog_posts indexes
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);

-- blog_categories indexes
CREATE UNIQUE INDEX IF NOT EXISTS blog_categories_slug_idx ON blog_categories(slug);

-- ad_banners indexes
CREATE INDEX IF NOT EXISTS ad_banners_position_idx ON ad_banners(position);
CREATE INDEX IF NOT EXISTS ad_banners_active_idx ON ad_banners(is_active);
CREATE INDEX IF NOT EXISTS ad_banners_order_idx ON ad_banners(order_id);

-- orders indexes
CREATE INDEX IF NOT EXISTS orders_service_package_idx ON orders(service_package_id);
CREATE INDEX IF NOT EXISTS orders_type_idx ON orders(type);
CREATE INDEX IF NOT EXISTS orders_type_id_idx ON orders(type_id);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

-- reviews indexes
CREATE INDEX IF NOT EXISTS reviews_business_idx ON reviews(business_id);
CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews(status);
CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_business_idx ON reviews(user_id, business_id);

-- product_categories indexes
CREATE UNIQUE INDEX IF NOT EXISTS product_categories_slug_idx ON product_categories(slug);
CREATE INDEX IF NOT EXISTS product_categories_parent_idx ON product_categories(parent_id);

-- listing_categories indexes
CREATE UNIQUE INDEX IF NOT EXISTS listing_categories_slug_idx ON listing_categories(slug);
CREATE INDEX IF NOT EXISTS listing_categories_parent_idx ON listing_categories(parent_id);

-- saved_items unique index
CREATE UNIQUE INDEX IF NOT EXISTS saved_items_user_type_typeId_idx ON saved_items(user_id, type, type_id);

-- media indexes
CREATE INDEX IF NOT EXISTS media_r2_key_idx ON media(r2_key);
CREATE INDEX IF NOT EXISTS media_hash_idx ON media(hash);
CREATE INDEX IF NOT EXISTS media_deleted_idx ON media(deleted_at);

-- ============================================
-- Migration complete
-- ============================================
