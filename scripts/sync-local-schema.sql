-- Sync local D1 to match remote schema
-- Drop all local tables first
DROP TABLE IF EXISTS `listing_categories`;
DROP TABLE IF EXISTS `listings`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `latest_update`;

-- Create all tables from remote schema
CREATE TABLE `accounts` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `account_id` text NOT NULL,
  `provider_id` text NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `id_token` text,
  `access_token_expires_at` integer,
  `refresh_token_expires_at` integer,
  `scope` text,
  `password` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE INDEX `accounts_user_idx` ON `accounts` (`user_id`);

CREATE TABLE `ad_banners` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `image_url` text NOT NULL,
  `link_url` text,
  `link_type` text,
  `position` text,
  `sort_order` integer DEFAULT 0,
  `status` text DEFAULT 'active',
  `starts_at` integer,
  `ends_at` integer,
  `order_id` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE INDEX `ad_banners_status_idx` ON `ad_banners` (`status`);
CREATE INDEX `ad_banners_order_idx` ON `ad_banners` (`order_id`);

CREATE TABLE `blog_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `sort_order` integer DEFAULT 0,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `blog_categories_slug_idx` ON `blog_categories` (`slug`);

CREATE TABLE `blog_posts` (
  `id` text PRIMARY KEY NOT NULL,
  `category_id` text,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `excerpt` text,
  `content` text NOT NULL,
  `cover_image_id` text,
  `author_name` text,
  `author_id` text,
  `status` text DEFAULT 'draft',
  `featured` integer DEFAULT 0,
  `published_at` integer,
  `meta_title` text,
  `meta_description` text,
  `canonical_url` text,
  `tags` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `blog_posts_slug_idx` ON `blog_posts` (`slug`);
CREATE INDEX `blog_posts_status_idx` ON `blog_posts` (`status`);
CREATE INDEX `blog_posts_published_idx` ON `blog_posts` (`published_at`);

CREATE TABLE `business_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `icon` text,
  `parent_id` text,
  `sort_order` integer DEFAULT 0,
  `is_active` integer DEFAULT 1,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `business_categories_slug_idx` ON `business_categories` (`slug`);
CREATE INDEX `business_categories_parent_idx` ON `business_categories` (`parent_id`);

CREATE TABLE `businesses` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `owner_id` text NOT NULL,
  `category_id` text,
  `status` text DEFAULT 'draft',
  `banner_image_id` text,
  `profile_image_id` text,
  `contact_name` text,
  `contact_number` text,
  `country_code` text DEFAULT '+670',
  `year_of_establishment` integer,
  `email` text,
  `address` text,
  `location_lat` real,
  `location_lng` real,
  `opening_hours` text,
  `about_us` text,
  `tags` text,
  `likes` integer DEFAULT 0,
  `saves` integer DEFAULT 0,
  `rating_average` real DEFAULT 0,
  `rating_count` integer DEFAULT 0,
  `views` integer DEFAULT 0,
  `plan_slug` text,
  `plan_status` text DEFAULT 'none',
  `plan_expires_at` integer,
  `grace_period_end_date` integer,
  `limits` text,
  `registration_url` text,
  `verified_badge` integer DEFAULT 0,
  `social_links` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `businesses_slug_idx` ON `businesses` (`slug`);
CREATE INDEX `businesses_owner_idx` ON `businesses` (`owner_id`);
CREATE INDEX `businesses_status_idx` ON `businesses` (`status`);
CREATE INDEX `businesses_category_idx` ON `businesses` (`category_id`);
CREATE INDEX `businesses_plan_status_idx` ON `businesses` (`plan_status`);

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
CREATE UNIQUE INDEX `latest_update_unique` ON `latest_update` (`type`, `type_id`);
CREATE INDEX `latest_update_type_idx` ON `latest_update` (`type`);
CREATE INDEX `latest_update_type_id_idx` ON `latest_update` (`type_id`);

CREATE TABLE `listing_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `icon` text,
  `parent_id` text,
  `sort_order` integer DEFAULT 0,
  `is_active` integer DEFAULT 1,
  `form_fields` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `listing_categories_slug_idx` ON `listing_categories` (`slug`);
CREATE INDEX `listing_categories_parent_idx` ON `listing_categories` (`parent_id`);

CREATE TABLE `listings` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `owner_id` text NOT NULL,
  `category_id` text,
  `status` text DEFAULT 'draft',
  `description` text NOT NULL,
  `price_amount` real,
  `price_unit` text,
  `condition` text,
  `location` text,
  `location_lat` real,
  `location_lng` real,
  `contact_name` text,
  `contact_number` text,
  `country_code` text DEFAULT '+670',
  `email` text,
  `image_ids` text,
  `tags` text,
  `likes` integer DEFAULT 0,
  `saves` integer DEFAULT 0,
  `views` integer DEFAULT 0,
  `expires_at` integer,
  `last_renewed_at` integer,
  `featured` integer DEFAULT 0,
  `featured_until` integer,
  `plan_slug` text,
  `plan_status` text DEFAULT 'none',
  `plan_expires_at` integer,
  `grace_period_end_date` integer,
  `extra_data` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `listings_slug_idx` ON `listings` (`slug`);
CREATE INDEX `listings_owner_idx` ON `listings` (`owner_id`);
CREATE INDEX `listings_status_idx` ON `listings` (`status`);
CREATE INDEX `listings_category_idx` ON `listings` (`category_id`);
CREATE INDEX `listings_featured_idx` ON `listings` (`featured`);
CREATE INDEX `listings_expires_idx` ON `listings` (`expires_at`);

CREATE TABLE `media` (
  `id` text PRIMARY KEY NOT NULL,
  `r2_key` text NOT NULL UNIQUE,
  `filename` text NOT NULL,
  `mime_type` text NOT NULL,
  `size` integer NOT NULL,
  `width` integer,
  `height` integer,
  `entity_type` text NOT NULL,
  `entity_id` text NOT NULL,
  `purpose` text NOT NULL,
  `sort_order` integer DEFAULT 0,
  `alt` text,
  `hash` text UNIQUE,
  `created_by_id` text,
  `created_at` integer,
  `deleted_at` integer
);
CREATE UNIQUE INDEX `media_r2_key_idx` ON `media` (`r2_key`);
CREATE INDEX `media_entity_idx` ON `media` (`entity_type`, `entity_id`);
CREATE INDEX `media_purpose_idx` ON `media` (`purpose`);
CREATE INDEX `media_hash_idx` ON `media` (`hash`);
CREATE INDEX `media_deleted_idx` ON `media` (`deleted_at`);

CREATE TABLE `non_profit_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `icon` text,
  `parent_id` text,
  `sort_order` integer DEFAULT 0,
  `is_active` integer DEFAULT 1,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `non_profit_categories_slug_idx` ON `non_profit_categories` (`slug`);
CREATE INDEX `non_profit_categories_parent_idx` ON `non_profit_categories` (`parent_id`);

CREATE TABLE `non_profits` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `owner_id` text NOT NULL,
  `category_id` text,
  `status` text DEFAULT 'draft',
  `banner_image_id` text,
  `profile_image_id` text,
  `contact_name` text,
  `contact_number` text,
  `country_code` text DEFAULT '+670',
  `year_of_establishment` integer,
  `email` text,
  `address` text,
  `location_lat` real,
  `location_lng` real,
  `opening_hours` text,
  `about_us` text,
  `tags` text,
  `likes` integer DEFAULT 0,
  `saves` integer DEFAULT 0,
  `views` integer DEFAULT 0,
  `registration_url` text,
  `verified_badge` integer DEFAULT 0,
  `social_links` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `non_profits_slug_idx` ON `non_profits` (`slug`);
CREATE INDEX `non_profits_owner_idx` ON `non_profits` (`owner_id`);
CREATE INDEX `non_profits_status_idx` ON `non_profits` (`status`);
CREATE INDEX `non_profits_category_idx` ON `non_profits` (`category_id`);

CREATE TABLE `orders` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `business_id` text NOT NULL,
  `product_id` text NOT NULL,
  `quantity` integer DEFAULT 1,
  `total_amount` real NOT NULL,
  `currency` text DEFAULT 'USD',
  `status` text DEFAULT 'pending',
  `payment_method` text,
  `payment_id` text,
  `variant_snapshot` text,
  `notes` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE INDEX `orders_user_idx` ON `orders` (`user_id`);
CREATE INDEX `orders_business_idx` ON `orders` (`business_id`);
CREATE INDEX `orders_status_idx` ON `orders` (`status`);

CREATE TABLE `plans` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `price` real NOT NULL,
  `currency` text DEFAULT 'USD',
  `duration_days` integer NOT NULL,
  `features` text,
  `limits` text,
  `is_active` integer DEFAULT 1,
  `sort_order` integer DEFAULT 0,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `plans_slug_idx` ON `plans` (`slug`);

CREATE TABLE `product_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `icon` text,
  `parent_id` text,
  `sort_order` integer DEFAULT 0,
  `is_active` integer DEFAULT 1,
  `form_fields` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `product_categories_slug_idx` ON `product_categories` (`slug`);
CREATE INDEX `product_categories_parent_idx` ON `product_categories` (`parent_id`);

CREATE TABLE `products` (
  `id` text PRIMARY KEY NOT NULL,
  `business_id` text,
  `category_id` text,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `product_type` text DEFAULT 'product',
  `price_amount` real,
  `price_unit` text,
  `specifications` text,
  `images` text DEFAULT '[]',
  `featured` integer DEFAULT 0,
  `active` integer DEFAULT 1,
  `sort_order` integer DEFAULT 0,
  `created_at` integer,
  `updated_at` integer
);
CREATE INDEX `products_business_idx` ON `products` (`business_id`);
CREATE INDEX `products_category_idx` ON `products` (`category_id`);
CREATE UNIQUE INDEX `products_slug_idx` ON `products` (`slug`);
CREATE INDEX `products_active_idx` ON `products` (`active`);

CREATE TABLE `public_sector_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `icon` text,
  `parent_id` text,
  `sort_order` integer DEFAULT 0,
  `is_active` integer DEFAULT 1,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `public_sector_categories_slug_idx` ON `public_sector_categories` (`slug`);
CREATE INDEX `public_sector_categories_parent_idx` ON `public_sector_categories` (`parent_id`);

CREATE TABLE `public_sectors` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `owner_id` text NOT NULL,
  `category_id` text,
  `status` text DEFAULT 'draft',
  `banner_image_id` text,
  `profile_image_id` text,
  `contact_name` text,
  `contact_number` text,
  `country_code` text DEFAULT '+670',
  `year_of_establishment` integer,
  `email` text,
  `address` text,
  `location_lat` real,
  `location_lng` real,
  `opening_hours` text,
  `about_us` text,
  `tags` text,
  `likes` integer DEFAULT 0,
  `saves` integer DEFAULT 0,
  `views` integer DEFAULT 0,
  `registration_url` text,
  `verified_badge` integer DEFAULT 0,
  `social_links` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `public_sectors_slug_idx` ON `public_sectors` (`slug`);
CREATE INDEX `public_sectors_owner_idx` ON `public_sectors` (`owner_id`);
CREATE INDEX `public_sectors_status_idx` ON `public_sectors` (`status`);
CREATE INDEX `public_sectors_category_idx` ON `public_sectors` (`category_id`);

CREATE TABLE `reviews` (
  `id` text PRIMARY KEY NOT NULL,
  `business_id` text NOT NULL,
  `user_id` text NOT NULL,
  `rating` integer NOT NULL,
  `title` text,
  `content` text,
  `reply` text,
  `replied_at` integer,
  `replied_by` text,
  `status` text DEFAULT 'pending',
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `reviews_user_business_unique` ON `reviews` (`user_id`, `business_id`);
CREATE INDEX `reviews_business_idx` ON `reviews` (`business_id`);
CREATE INDEX `reviews_status_idx` ON `reviews` (`status`);

CREATE TABLE `saved_items` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `entity_type` text NOT NULL,
  `entity_id` text NOT NULL,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `saved_items_unique` ON `saved_items` (`user_id`, `entity_type`, `entity_id`);
CREATE INDEX `saved_items_user_idx` ON `saved_items` (`user_id`);

CREATE TABLE `service_packages` (
  `id` text PRIMARY KEY NOT NULL,
  `business_id` text NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `description` text,
  `variants` text,
  `featured` integer DEFAULT 0,
  `active` integer DEFAULT 1,
  `sort_order` integer DEFAULT 0,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `service_packages_slug_idx` ON `service_packages` (`slug`);
CREATE INDEX `service_packages_business_idx` ON `service_packages` (`business_id`);

CREATE TABLE `sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `token` text NOT NULL UNIQUE,
  `expires_at` integer NOT NULL,
  `user_agent` text,
  `ip_address` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);

CREATE TABLE `site_settings` (
  `id` text PRIMARY KEY NOT NULL,
  `key` text NOT NULL UNIQUE,
  `value` text,
  `type` text DEFAULT 'string',
  `group` text,
  `created_at` integer,
  `updated_at` integer
);
CREATE UNIQUE INDEX `site_settings_key_idx` ON `site_settings` (`key`);

CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL UNIQUE,
  `email_verified` integer DEFAULT 0,
  `phone` text,
  `name` text NOT NULL,
  `image` text,
  `role` text DEFAULT 'user',
  `created_at` integer,
  `updated_at` integer
);
CREATE INDEX `users_role_idx` ON `users` (`role`);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);

CREATE TABLE `verifications` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expires_at` integer NOT NULL,
  `created_at` integer
);
CREATE INDEX `verifications_expires_idx` ON `verifications` (`expires_at`);