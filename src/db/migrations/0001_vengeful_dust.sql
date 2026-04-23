CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text,
	`cover_image_id` text,
	`author_id` text NOT NULL,
	`status` text DEFAULT 'draft',
	`tags` text,
	`published_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_slug_idx` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_author_idx` ON `blog_posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `blog_posts_status_idx` ON `blog_posts` (`status`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ad_banners` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image_id` text,
	`linked_business_page_id` text,
	`external_url` text,
	`is_active` integer DEFAULT true,
	`start_date` integer,
	`end_date` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_ad_banners`("id", "title", "description", "image_id", "linked_business_page_id", "external_url", "is_active", "start_date", "end_date", "created_at", "updated_at") SELECT "id", "title", "description", "image_id", "linked_business_page_id", "external_url", "is_active", "start_date", "end_date", "created_at", "updated_at" FROM `ad_banners`;--> statement-breakpoint
DROP TABLE `ad_banners`;--> statement-breakpoint
ALTER TABLE `__new_ad_banners` RENAME TO `ad_banners`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_business_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
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
	`latest_updates` text,
	`tags` text,
	`likes` integer DEFAULT 0,
	`saves` integer DEFAULT 0,
	`rating_average` real DEFAULT 0,
	`rating_count` integer DEFAULT 0,
	`views` integer DEFAULT 0,
	`plan_type` text,
	`publish_date` integer,
	`expiry_date` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_business_pages`("id", "title", "slug", "owner_id", "category_id", "status", "banner_image_id", "profile_image_id", "contact_name", "contact_number", "country_code", "year_of_establishment", "email", "address", "location_lat", "location_lng", "opening_hours", "about_us", "latest_updates", "tags", "likes", "saves", "rating_average", "rating_count", "views", "plan_type", "publish_date", "expiry_date", "created_at", "updated_at") SELECT "id", "title", "slug", "owner_id", "category_id", "status", "banner_image_id", "profile_image_id", "contact_name", "contact_number", "country_code", "year_of_establishment", "email", "address", "location_lat", "location_lng", "opening_hours", "about_us", "latest_updates", "tags", "likes", "saves", "rating_average", "rating_count", "views", "plan_type", "publish_date", "expiry_date", "created_at", "updated_at" FROM `business_pages`;--> statement-breakpoint
DROP TABLE `business_pages`;--> statement-breakpoint
ALTER TABLE `__new_business_pages` RENAME TO `business_pages`;--> statement-breakpoint
CREATE UNIQUE INDEX `business_pages_slug_unique` ON `business_pages` (`slug`);--> statement-breakpoint
CREATE INDEX `business_owner_idx` ON `business_pages` (`owner_id`);--> statement-breakpoint
CREATE INDEX `business_status_idx` ON `business_pages` (`status`);--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text DEFAULT '',
	`parent_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "slug", "description", "icon", "parent_id", "created_at", "updated_at") SELECT "id", "name", "slug", "description", "icon", "parent_id", "created_at", "updated_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_media` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`alt` text,
	`type` text,
	`business_id` text,
	`created_by_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_media`("id", "url", "filename", "mime_type", "size", "width", "height", "alt", "type", "business_id", "created_by_id", "created_at") SELECT "id", "url", "filename", "mime_type", "size", "width", "height", "alt", "type", "business_id", "created_by_id", "created_at" FROM `media`;--> statement-breakpoint
DROP TABLE `media`;--> statement-breakpoint
ALTER TABLE `__new_media` RENAME TO `media`;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`business_page_id` text NOT NULL,
	`user_id` text NOT NULL,
	`plan_type` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'unpaid',
	`expiry_date` integer,
	`payment_method` text,
	`paid_date` integer,
	`admin_notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "business_page_id", "user_id", "plan_type", "amount", "status", "expiry_date", "payment_method", "paid_date", "admin_notes", "created_at", "updated_at") SELECT "id", "business_page_id", "user_id", "plan_type", "amount", "status", "expiry_date", "payment_method", "paid_date", "admin_notes", "created_at", "updated_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
CREATE INDEX `orders_business_idx` ON `orders` (`business_page_id`);--> statement-breakpoint
CREATE INDEX `orders_user_idx` ON `orders` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`media_id` text NOT NULL,
	`position` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_product_images`("id", "product_id", "media_id", "position") SELECT "id", "product_id", "media_id", "position" FROM `product_images`;--> statement-breakpoint
DROP TABLE `product_images`;--> statement-breakpoint
ALTER TABLE `__new_product_images` RENAME TO `product_images`;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`price` text NOT NULL,
	`description` text,
	`business_page_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "title", "price", "description", "business_page_id", "created_at", "updated_at") SELECT "id", "title", "price", "description", "business_page_id", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE INDEX `products_business_idx` ON `products` (`business_page_id`);--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`business_page_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`is_edited` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "business_page_id", "user_id", "rating", "comment", "is_edited", "created_at", "updated_at") SELECT "id", "business_page_id", "user_id", "rating", "comment", "is_edited", "created_at", "updated_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE INDEX `reviews_business_idx` ON `reviews` (`business_page_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);