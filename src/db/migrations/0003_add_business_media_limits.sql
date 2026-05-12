-- Add business-level media limits to plans table
ALTER TABLE `plans` ADD COLUMN `max_business_images` INTEGER NOT NULL DEFAULT 16;
ALTER TABLE `plans` ADD COLUMN `max_business_videos` INTEGER NOT NULL DEFAULT 2;
