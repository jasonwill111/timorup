-- Cleanup deprecated columns from businesses table
-- 2026-05-21

ALTER TABLE businesses DROP COLUMN photo_gallery;
ALTER TABLE businesses DROP COLUMN latest_update;
ALTER TABLE businesses DROP COLUMN latest_update_images;
ALTER TABLE businesses DROP COLUMN latest_update_date;
ALTER TABLE businesses DROP COLUMN plan_status;
ALTER TABLE businesses DROP COLUMN plan_expires_at;
ALTER TABLE businesses DROP COLUMN featured;
ALTER TABLE businesses DROP COLUMN featured_until;
ALTER TABLE businesses DROP COLUMN plan_slug;
ALTER TABLE businesses DROP COLUMN grace_period_end_date;

-- Cleanup deprecated columns from listings table
ALTER TABLE listings DROP COLUMN price;
ALTER TABLE listings DROP COLUMN plan_slug;
ALTER TABLE listings DROP COLUMN plan_status;
ALTER TABLE listings DROP COLUMN plan_expires_at;
ALTER TABLE listings DROP COLUMN grace_period_end_date;