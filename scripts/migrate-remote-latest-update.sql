-- Migration for remote D1: latestUpdate table rename and cleanup
-- Run this on remote database

-- Step 1: Create new latest_update table
CREATE TABLE `latest_update` (
  `id` text PRIMARY KEY NOT NULL,
  `type` text NOT NULL,
  `type_id` text NOT NULL,
  `content` text NOT NULL,
  `image_ids` text,
  `video_id` text,
  `created_at` integer,
  `updated_at` integer
);

-- Step 2: Copy data from old latest_updates to new latest_update
INSERT INTO `latest_update` (`id`, `type`, `type_id`, `content`, `image_ids`, `video_id`, `created_at`, `updated_at`)
SELECT `id`, `type`, `type_id`, `content`, `image_ids`, `video_id`, `created_at`, `updated_at` FROM `latest_updates`;

-- Step 3: Create unique index
CREATE UNIQUE INDEX `latest_update_unique` ON `latest_update` (`type`, `type_id`);
CREATE INDEX `latest_update_type_idx` ON `latest_update` (`type`);
CREATE INDEX `latest_update_type_id_idx` ON `latest_update` (`type_id`);

-- Step 4: Drop old table
DROP TABLE `latest_updates`;

-- Step 5: Remove废弃 fields from businesses
ALTER TABLE `businesses` DROP COLUMN `latest_updates`;

-- Step 6: Remove废弃 fields from non_profits
ALTER TABLE `non_profits` DROP COLUMN `latest_updates`;
ALTER TABLE `non_profits` DROP COLUMN `photo_gallery`;
ALTER TABLE `non_profits` DROP COLUMN `latest_update`;
ALTER TABLE `non_profits` DROP COLUMN `latest_update_images`;
ALTER TABLE `non_profits` DROP COLUMN `latest_update_date`;

-- Step 7: Remove废弃 fields from public_sectors
ALTER TABLE `public_sectors` DROP COLUMN `latest_updates`;
ALTER TABLE `public_sectors` DROP COLUMN `photo_gallery`;
ALTER TABLE `public_sectors` DROP COLUMN `latest_update`;
ALTER TABLE `public_sectors` DROP COLUMN `latest_update_images`;
ALTER TABLE `public_sectors` DROP COLUMN `latest_update_date`;