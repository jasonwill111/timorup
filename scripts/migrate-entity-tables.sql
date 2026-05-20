-- Migration: business_pages → businesses/non_profits/public_sectors
-- Run after pushing schema to D1
-- npx wrangler d1 execute timorup-db --remote --file=scripts/migrate-entity-tables.sql

-- ============================================================================
-- MIGRATION LOGIC
-- ============================================================================

-- Step 1: Check current data counts
SELECT 'Before migration:' as msg;
SELECT 'business_pages' as table_name, COUNT(*) as cnt FROM business_pages;

-- Step 2: Migrate businesses (entity_type = 'business')
-- Direct INSERT without entity_type column
INSERT INTO businesses (
  id, title, slug, owner_id, category_id, status,
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
  id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags, industry,
  likes, saves, rating_average, rating_count, views, plan_type,
  publish_date, expiry_date, subscription_status, NULL as subscription_expires_at,
  NULL as trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
FROM business_pages
WHERE entity_type = 'business'
  AND id NOT IN (SELECT id FROM businesses);

-- Step 3: Migrate non_profits (entity_type = 'nonprofit' AND organization_type = 'ngo')
INSERT INTO non_profits (
  id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  publish_date, expiry_date, subscription_status, subscription_expires_at,
  trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
)
SELECT
  id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  publish_date, expiry_date, subscription_status, NULL as subscription_expires_at,
  NULL as trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
FROM business_pages
WHERE entity_type = 'nonprofit'
  AND organization_type = 'ngo'
  AND id NOT IN (SELECT id FROM non_profits);

-- Step 4: Migrate public_sectors (entity_type = 'nonprofit' AND organization_type = 'government')
INSERT INTO public_sectors (
  id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  publish_date, expiry_date, subscription_status, subscription_expires_at,
  trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
)
SELECT
  id, title, slug, owner_id, category_id, status,
  banner_image_id, profile_image_id, contact_name, contact_number, country_code,
  year_of_establishment, email, address, location_lat, location_lng,
  opening_hours, about_us, latest_updates, tags,
  likes, saves, rating_average, rating_count, views,
  publish_date, expiry_date, subscription_status, NULL as subscription_expires_at,
  NULL as trial_started_at, grace_period_end_date, registration_url, verified_badge,
  social_links, photo_gallery, latest_update, latest_update_images, latest_update_date,
  created_at, updated_at
FROM business_pages
WHERE entity_type = 'nonprofit'
  AND organization_type = 'government'
  AND id NOT IN (SELECT id FROM public_sectors);

-- Step 5: Verify migration
SELECT 'After migration:' as msg;
SELECT 'businesses' as table_name, COUNT(*) as cnt FROM businesses
UNION ALL
SELECT 'non_profits', COUNT(*) FROM non_profits
UNION ALL
SELECT 'public_sectors', COUNT(*) FROM public_sectors
UNION ALL
SELECT 'business_pages (remaining)', COUNT(*) FROM business_pages;

-- Step 6: Report migration counts
SELECT 'Migrated:' as msg;
SELECT 'businesses migrated' as type, COUNT(*) as cnt FROM business_pages WHERE entity_type = 'business' AS metric
UNION ALL
SELECT 'non_profits migrated', COUNT(*) FROM business_pages WHERE entity_type = 'nonprofit' AND organization_type = 'ngo'
UNION ALL
SELECT 'public_sectors migrated', COUNT(*) FROM business_pages WHERE entity_type = 'nonprofit' AND organization_type = 'government';
