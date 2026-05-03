CREATE TABLE `saved_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`item_type` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE INDEX `saved_items_user_idx` ON `saved_items` (`user_id`);--> statement-breakpoint
CREATE INDEX `saved_items_item_idx` ON `saved_items` (`item_id`);--> statement-breakpoint
ALTER TABLE `products` ADD `specifications` text;--> statement-breakpoint
ALTER TABLE `products` ADD `featured` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `products` ADD `active` integer DEFAULT true;--> statement-breakpoint
CREATE INDEX `products_active_idx` ON `products` (`active`);