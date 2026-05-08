PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text DEFAULT '',
	`parent_id` text,
	`entity_type` text DEFAULT 'business',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-1','Restaurants & Cafes','restaurants-cafes','Food and beverage establishments','emoji:🍽️',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-2','Hotels & Accommodation','hotels-accommodation','Hotels, hostels, and lodging','emoji:🏨',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-3','Shopping','shopping','Retail stores and shops','emoji:🛍️',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-4','Health & Beauty','health-beauty','Healthcare and beauty services','emoji:💆',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-5','Automotive','automotive','Car dealers, repair shops','emoji:🚗',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-6','Professional Services','professional-services','Legal, accounting, consulting','emoji:💼',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-7','Education','education','Schools, tutoring, training','emoji:📚',NULL,'business',1776906423,1776906423);
INSERT INTO "categories" ("id","name","slug","description","icon","parent_id","entity_type","created_at","updated_at") VALUES('cat-8','Entertainment','entertainment','Bars, clubs, venues','emoji:🎭',NULL,'business',1776906423,1776906423);
