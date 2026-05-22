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
CREATE UNIQUE INDEX IF NOT EXISTS `latest_update_unique` ON `latest_update` (`type`, `type_id`);
CREATE INDEX IF NOT EXISTS `latest_update_type_idx` ON `latest_update` (`type`);
CREATE INDEX IF NOT EXISTS `latest_update_type_id_idx` ON `latest_update` (`type_id`);