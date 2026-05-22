-- Migration: latestUpdate table rename and cleanup
-- Run this on both local and remote D1 databases

-- Step 1: Drop old latest_updates table (if exists)
DROP TABLE IF EXISTS `latest_updates`;

-- Step 2: Create new latest_update table
CREATE TABLE IF NOT EXISTS `latest_update` (
  `id` text PRIMARY KEY NOT NULL,
  `type` text NOT NULL,
  `type_id` text NOT NULL,
  `content` text NOT NULL,
  `image_ids` text,
  `video_id` text,
  `created_at` integer,
  `updated_at` integer
);

-- Step 3: Create unique index for latest_update table
CREATE UNIQUE INDEX IF NOT EXISTS `latest_update_unique` ON `latest_update` (`type`, `type_id`);
CREATE INDEX IF NOT EXISTS `latest_update_type_idx` ON `latest_update` (`type`);
CREATE INDEX IF NOT EXISTS `latest_update_type_id_idx` ON `latest_update` (`type_id`);

-- Step 4: Remove废弃 fields from businesses
ALTER TABLE `businesses` DROP COLUMN IF EXISTS `latest_updates`;

-- Step 5: Remove废弃 fields from non_profits
ALTER TABLE `non_profits` DROP COLUMN IF EXISTS `latest_updates`;
ALTER TABLE `non_profits` DROP COLUMN IF EXISTS `photo_gallery`;
ALTER TABLE `non_profits` DROP COLUMN IF EXISTS `latest_update`;
ALTER TABLE `non_profits` DROP COLUMN IF EXISTS `latest_update_images`;
ALTER TABLE `non_profits` DROP COLUMN IF EXISTS `latest_update_date`;

-- Step 6: Remove废弃 fields from public_sectors
ALTER TABLE `public_sectors` DROP COLUMN IF EXISTS `latest_updates`;
ALTER TABLE `public_sectors` DROP COLUMN IF EXISTS `photo_gallery`;
ALTER TABLE `public_sectors` DROP COLUMN IF EXISTS `latest_update`;
ALTER TABLE `public_sectors` DROP COLUMN IF EXISTS `latest_update_images`;
ALTER TABLE `public_sectors` DROP COLUMN IF EXISTS `latest_update_date`;