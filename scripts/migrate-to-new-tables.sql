-- Migration: business_pages → businesses/non_profits/public_sectors
-- Run: npx wrangler d1 execute timorlist-db --local --file=scripts/migrate-to-new-tables.sql

-- ============================================================================
-- Step 1: Migrate businesses (entityType = 'business')
-- ============================================================================
INSERT INTO businesses (
  entity_type, id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags, industry,
  likes, saves, rating_average, rating_count, views, plan_type,
  publish_date, expiry_date, subscription_status, subscription_expires_at,
  trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
)
SELECT
  entity_type, id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags, industry,
  likes, saves, rating_average, rating_count, views, plan_type,
  publish_date, expiry_date, subscription_status, subscription_expires_at,
  trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
FROM business_pages
WHERE entity_type = 'business'
ON CONFLICT(id) DO UPDATE SET title = excluded.title;

-- ============================================================================
-- Step 2: Migrate non_profits (entityType = 'nonprofit' AND organizationType = 'ngo')
-- Note: non_profits schema does NOT have organization_type column, using NULL
-- ============================================================================
INSERT INTO non_profits (
  entity_type, id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  created_at, updated_at
)
SELECT
  entity_type, id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  created_at, updated_at
FROM business_pages
WHERE entity_type = 'nonprofit' AND organization_type = 'ngo'
ON CONFLICT(id) DO UPDATE SET title = excluded.title;

-- ============================================================================
-- Step 3: Migrate public_sectors (entityType = 'nonprofit' AND organizationType = 'government')
-- Note: public_sectors schema does NOT have organization_type column, using NULL
-- ============================================================================
INSERT INTO public_sectors (
  entity_type, id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  created_at, updated_at
)
SELECT
  entity_type, id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  created_at, updated_at
FROM business_pages
WHERE entity_type = 'nonprofit' AND organization_type = 'government'
ON CONFLICT(id) DO UPDATE SET title = excluded.title;

-- ============================================================================
-- Step 4: Verify counts
-- ============================================================================
SELECT 'businesses' as table_name, COUNT(*) as cnt FROM businesses
UNION ALL
SELECT 'non_profits', COUNT(*) FROM non_profits
UNION ALL
SELECT 'public_sectors', COUNT(*) FROM public_sectors
UNION ALL
SELECT 'business_pages (remaining)', COUNT(*) FROM business_pages;
