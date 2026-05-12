-- Create tables with exact business_pages columns
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  owner_id TEXT NOT NULL, category_id TEXT, entity_type TEXT DEFAULT 'business',
  status TEXT DEFAULT 'draft', banner_image_id TEXT, profile_image_id TEXT,
  contact_name TEXT, contact_number TEXT, country_code TEXT DEFAULT '+670',
  year_of_establishment INTEGER, email TEXT, address TEXT,
  location_lat REAL, location_lng REAL, opening_hours TEXT,
  about_us TEXT, latest_updates TEXT, tags TEXT, industry TEXT,
  likes INTEGER DEFAULT 0, saves INTEGER DEFAULT 0, rating_average REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0, views INTEGER DEFAULT 0, plan_type TEXT,
  publish_date INTEGER, expiry_date INTEGER, subscription_status TEXT DEFAULT 'none',
  subscription_expires_at INTEGER, trial_started_at INTEGER, grace_period_end_date INTEGER,
  registration_url TEXT, verified_badge INTEGER DEFAULT 0, social_links TEXT,
  photo_gallery TEXT, latest_update TEXT, latest_update_images TEXT,
  latest_update_date INTEGER, created_at INTEGER, updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS non_profits (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  owner_id TEXT NOT NULL, category_id TEXT, entity_type TEXT DEFAULT 'nonprofit',
  status TEXT DEFAULT 'draft', banner_image_id TEXT, profile_image_id TEXT,
  contact_name TEXT, contact_number TEXT, country_code TEXT DEFAULT '+670',
  year_of_establishment INTEGER, email TEXT, address TEXT,
  location_lat REAL, location_lng REAL, opening_hours TEXT,
  about_us TEXT, latest_updates TEXT, tags TEXT,
  likes INTEGER DEFAULT 0, saves INTEGER DEFAULT 0, rating_average REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0, views INTEGER DEFAULT 0, plan_type TEXT,
  publish_date INTEGER, expiry_date INTEGER, subscription_status TEXT DEFAULT 'none',
  subscription_expires_at INTEGER, trial_started_at INTEGER, grace_period_end_date INTEGER,
  registration_url TEXT, verified_badge INTEGER DEFAULT 0, social_links TEXT,
  photo_gallery TEXT, latest_update TEXT, latest_update_images TEXT,
  latest_update_date INTEGER, created_at INTEGER, updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  owner_id TEXT NOT NULL, category_id TEXT, listing_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft', description TEXT, price TEXT, location TEXT,
  location_lat REAL, location_lng REAL, contact_name TEXT, contact_number TEXT,
  country_code TEXT DEFAULT '+670', email TEXT, image_ids TEXT, tags TEXT,
  likes INTEGER DEFAULT 0, saves INTEGER DEFAULT 0, views INTEGER DEFAULT 0,
  created_at INTEGER, updated_at INTEGER, expires_at INTEGER, last_renewed_at INTEGER
);

SELECT 'Tables created' as status;