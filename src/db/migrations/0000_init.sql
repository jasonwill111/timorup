-- D1 Init Migration - Create all tables from scratch

CREATE TABLE IF NOT EXISTS `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`refreshToken` text,
	`accessToken` text,
	`accessTokenExpires` integer,
	`scope` text,
	`password` text,
	`createdAt` integer,
	`updatedAt` integer
);
CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`name` text NOT NULL,
	`image` text,
	`role` text DEFAULT 'user',
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);
CREATE INDEX IF NOT EXISTS `users_email_idx` ON `users` (`email`);
CREATE TABLE IF NOT EXISTS `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
CREATE TABLE IF NOT EXISTS `blog_posts` (
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
CREATE UNIQUE INDEX IF NOT EXISTS `blog_posts_slug_unique` ON `blog_posts` (`slug`);
CREATE INDEX IF NOT EXISTS `blog_posts_author_idx` ON `blog_posts` (`author_id`);
CREATE INDEX IF NOT EXISTS `blog_posts_status_idx` ON `blog_posts` (`status`);
CREATE TABLE IF NOT EXISTS `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text DEFAULT '',
	`parentId` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS `categories_slug_unique` ON `categories` (`slug`);
CREATE TABLE IF NOT EXISTS `media` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`filename` text NOT NULL,
	`mimeType` text NOT NULL,
	`size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`alt` text,
	`type` text,
	`businessId` text,
	`createdById` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE IF NOT EXISTS `business_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`ownerId` text NOT NULL,
	`categoryId` text,
	`status` text DEFAULT 'draft',
	`bannerImageId` text,
	`profileImageId` text,
	`contactName` text,
	`contactNumber` text,
	`countryCode` text DEFAULT '+670',
	`yearOfEstablishment` integer,
	`email` text,
	`address` text,
	`locationLat` real,
	`locationLng` real,
	`openingHours` text,
	`aboutUs` text,
	`latestUpdates` text,
	`tags` text,
	`likes` integer DEFAULT 0,
	`saves` integer DEFAULT 0,
	`ratingAverage` real DEFAULT 0,
	`ratingCount` integer DEFAULT 0,
	`views` integer DEFAULT 0,
	`planType` text,
	`publishDate` integer,
	`expiryDate` integer,
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS `business_pages_slug_unique` ON `business_pages` (`slug`);
CREATE INDEX IF NOT EXISTS `business_owner_idx` ON `business_pages` (`ownerId`);
CREATE INDEX IF NOT EXISTS `business_status_idx` ON `business_pages` (`status`);
CREATE TABLE IF NOT EXISTS `products` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`price` text NOT NULL,
	`description` text,
	`businessPageId` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS `products_business_idx` ON `products` (`businessPageId`);
CREATE TABLE IF NOT EXISTS `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`mediaId` text NOT NULL,
	`position` integer DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`businessPageId` text NOT NULL,
	`userId` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`isEdited` integer DEFAULT false,
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS `reviews_business_idx` ON `reviews` (`businessPageId`);
CREATE INDEX IF NOT EXISTS `reviews_user_idx` ON `reviews` (`userId`);
CREATE TABLE IF NOT EXISTS `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`businessPageId` text NOT NULL,
	`userId` text NOT NULL,
	`planType` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'unpaid',
	`expiryDate` integer,
	`paymentMethod` text,
	`paidDate` integer,
	`adminNotes` text,
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS `orders_business_idx` ON `orders` (`businessPageId`);
CREATE INDEX IF NOT EXISTS `orders_user_idx` ON `orders` (`userId`);
CREATE TABLE IF NOT EXISTS `ad_banners` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`imageId` text,
	`linkedBusinessPageId` text,
	`externalUrl` text,
	`isActive` integer DEFAULT true,
	`startDate` integer,
	`endDate` integer,
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE IF NOT EXISTS `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS `site_settings_key_unique` ON `site_settings` (`key`);
