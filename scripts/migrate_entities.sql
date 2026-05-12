-- Migration: business_pages -> 4 tables
-- Current data: business=13, nonprofit=8, personal=5

-- 1. Move businesses (entityType = 'business')
INSERT INTO businesses (id, title, slug, owner_id, category_id, status, banner_image_id, profile_image_id, contact_name, contact_number, country_code, year_of_establishment, email, address, location_lat, location_lng, opening_hours, about_us, latest_updates, tags, industry, likes, saves, rating_average, rating_count, views, plan_type, publish_date, expiry_date, subscription_status, subscription_expires_at, trial_started_at, grace_period_end_date, registration_url, verified_badge, social_links, photo_gallery, latest_update, latest_update_images, latest_update_date, created_at, updated_at)
SELECT id, title, slug, owner_id, category_id, status, banner_image_id, profile_image_id, contact_name, contact_number, country_code, year_of_establishment, email, address, location_lat, location_lng, opening_hours, about_us, latest_updates, tags, industry, likes, saves, rating_average, rating_count, views, plan_type, publish_date, expiry_date, subscription_status, subscription_expires_at, trial_started_at, grace_period_end_date, registration_url, verified_badge, social_links, photo_gallery, latest_update, latest_update_images, latest_update_date, created_at, updated_at FROM business_pages WHERE entity_type = 'business';

-- 2. Move non-profits
INSERT INTO non_profits (id, title, slug, owner_id, category_id, status, banner_image_id, profile_image_id, contact_name, contact_number, country_code, year_of_establishment, email, address, location_lat, location_lng, opening_hours, about_us, latest_updates, tags, likes, saves, rating_average, rating_count, views, plan_type, publish_date, expiry_date, subscription_status, subscription_expires_at, trial_started_at, grace_period_end_date, registration_url, verified_badge, social_links, photo_gallery, latest_update, latest_update_images, latest_update_date, created_at, updated_at)
SELECT id, title, slug, owner_id, category_id, status, banner_image_id, profile_image_id, contact_name, contact_number, country_code, year_of_establishment, email, address, location_lat, location_lng, opening_hours, about_us, latest_updates, tags, likes, saves, rating_average, rating_count, views, plan_type, publish_date, expiry_date, subscription_status, subscription_expires_at, trial_started_at, grace_period_end_date, registration_url, verified_badge, social_links, photo_gallery, latest_update, latest_update_images, latest_update_date, created_at, updated_at FROM business_pages WHERE entity_type = 'nonprofit';

-- 3. Move personal to listings
INSERT INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, location, location_lat, location_lng, contact_name, contact_number, country_code, email, image_ids, tags, likes, saves, views, created_at, updated_at, expires_at, last_renewed_at)
SELECT id, title, slug, owner_id, category_id, 'product', status, description, price, address, location_lat, location_lng, contact_name, contact_number, country_code, email, image_ids, tags, likes, saves, views, created_at, updated_at,
  CASE WHEN created_at IS NOT NULL THEN created_at + 259200 ELSE NULL END,
  created_at
FROM business_pages WHERE entity_type = 'personal';

-- Verify
SELECT 'businesses' tbl, count(*) cnt FROM businesses
UNION ALL SELECT 'non_profits', count(*) FROM non_profits
UNION ALL SELECT 'listings', count(*) FROM listings;