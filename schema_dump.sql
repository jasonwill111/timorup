PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE `ad_banners` (
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
CREATE TABLE `business_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`owner_id` text NOT NULL,
	`category_id` text,
	`entity_type` text DEFAULT 'business',
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
	`industry` text,
	`likes` integer DEFAULT 0,
	`saves` integer DEFAULT 0,
	`rating_average` real DEFAULT 0,
	`rating_count` integer DEFAULT 0,
	`views` integer DEFAULT 0,
	`plan_type` text,
	`publish_date` integer,
	`expiry_date` integer,
	`registration_url` text,
	`verified_badge` integer DEFAULT false,
	`social_links` text,
	`photo_gallery` text,
	`latest_update` text,
	`latest_update_images` text,
	`latest_update_date` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
, organization_type text, subscription_status TEXT DEFAULT 'none', grace_period_end_date INTEGER);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-1','Café Timor','cafe-timor','user-1','cat-1','business','live',NULL,NULL,'João Silva','77001234','+670',NULL,'info@cafetimor.tl','Avenida de绍兴, Dili',-8.5569,125.5603,'{"monday":{"open":"07:00","close":"22:00"},"tuesday":{"open":"07:00","close":"22:00"},"wednesday":{"open":"07:00","close":"22:00"},"thursday":{"open":"07:00","close":"22:00"},"friday":{"open":"07:00","close":"23:00"},"saturday":{"open":"08:00","close":"23:00"},"sunday":{"open":"08:00","close":"20:00"}}','Café Timor is the premier coffee destination in Dili, serving the finest Timor-Leste coffee beans since 2010.',NULL,'["coffee","cafe","wifi","meeting place"]',NULL,156,42,4.5,28,1250,'pro',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1776906423,1776906423,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-2','Hotel Timor','hotel-timor','user-2','cat-2','business','live',NULL,NULL,'Maria Reis','77005678','+670',NULL,'reservations@hoteltimor.tl','Beach Road, Dili',-8.4833,125.5856,'{"monday":{"open":"00:00","close":"00:00"},"tuesday":{"open":"00:00","close":"00:00"}}','Hotel Timor offers luxury accommodation with stunning ocean views.',NULL,'["hotel","luxury","pool","wifi","restaurant"]',NULL,289,78,4.8,52,3420,'max',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1776906423,1776906423,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-3','Timor Tech Solutions','timor-tech-solutions','user-3','cat-6','business','live',NULL,NULL,'Carlos Almeida','77009999','+670',NULL,'carlos@timortech.tl','Building Trade, Dili',-8.5569,125.5603,'{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"}}','Timor Tech Solutions provides IT consulting and web development services.',NULL,'["it","consulting","web development","software"]',NULL,87,23,4.2,15,890,'basic',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1776906423,1776906423,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-4','Beach Shop Dili','beach-shop-dili','user-1','cat-3','business','live',NULL,NULL,'Ana Costa','77004567','+670',NULL,'shop@beachdili.tl','Coastal Road, Dili',-8.4567,125.5734,NULL,'Beach Shop offers souvenirs, swimwear, and beach essentials.',NULL,'["souvenirs","swimwear","beach","shopping"]',NULL,45,12,4,8,456,'basic',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1776906423,1776906423,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-5','Timor Dental Clinic','timor-dental-clinic','user-2','cat-4','business','live',NULL,NULL,'Dr. Pedro Santos','77007890','+670',NULL,'info@timordental.tl','Main Street, Dili',-8.5569,125.5603,NULL,'Professional dental services with modern equipment.',NULL,'["dental","health","medical","clinic"]',NULL,67,18,4.6,22,789,'pro',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1776906423,1776906423,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-1777694938343','test business Name','test-business-name','qxPYNRXCn11ubNuTHFXJc4r9MMZg4ik2',NULL,'business','draft',NULL,NULL,'Nick','+670 123414','+670',NULL,'feaffa@gmail.com','fafafafaf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1777694938,1777694938,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('gov-test-001','Ministry of Finance','ministry-finance','system',NULL,'nonprofit','live',NULL,NULL,NULL,NULL,'+670',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'2026-05-05 07:46:55',1777967215,'government','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-002','Cafe Brisa Serena','cafe-brisa-serena','system',NULL,'business','live',NULL,NULL,NULL,'+670 7723 1234','+670',NULL,'hello@brisaserena.tl','Rua de Caminho, Dili',-8.5541,125.5735,NULL,'Waterfront cafe with sunset views',NULL,NULL,'food.cafes',445,0,4.5,203,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077423,1778077423,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-003','Timor Plaza','timor-plaza','system',NULL,'business','live',NULL,NULL,NULL,'+670 331 5678','+670',NULL,'info@timorplaza.tl','Avenida President Nicolas Lobato, Dili',-8.5578,125.5789,NULL,'Largest shopping center',NULL,NULL,'retail.shopping_malls',167,0,4,89,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077439,1778077439,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-004','Hosanna Supermarket','hosanna-supermarket','system',NULL,'business','live',NULL,NULL,NULL,'+670 331 9012','+670',NULL,'contact@hosanna.tl','Bidau Santana, Dili',-8.5389,125.5812,NULL,'Fresh produce since 2005',NULL,NULL,'retail.grocery',89,0,4.1,134,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077446,1778077446,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-005','Kokui Indonesian Restaurant','kokui-indonesian-restaurant','system',NULL,'business','live',NULL,NULL,NULL,'+670 7721 4567','+670',NULL,'reservasi@kokui.tl','Lacluta, Dili',-8.5512,125.5698,NULL,'Authentic Indonesian cuisine',NULL,NULL,'food.restaurants',234,0,4.3,178,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077451,1778077451,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-006','Lita Bakery and Cafe','lita-bakery-and-cafe','system',NULL,'business','live',NULL,NULL,NULL,'+670 331 3456','+670',NULL,'orders@litabakery.tl','Comoro, Dili',-8.5423,125.5545,NULL,'Fresh bread since 1998',NULL,NULL,'food.bakeries',567,0,4.4,212,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077457,1778077457,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-007','Ready M8 Auto Service','ready-m8-auto-service','system',NULL,'business','live',NULL,NULL,NULL,'+670 7723 7890','+670',NULL,'service@readym8.tl','Lelogu, Dili',-8.5489,125.5489,NULL,'Professional auto repair',NULL,NULL,'automotive.repair',345,0,4.6,98,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077464,1778077464,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('biz-008','Timor Language Center','timor-language-center','system',NULL,'business','live',NULL,NULL,NULL,'+670 331 7890','+670',NULL,'info@timorlc.tl','Farol, Dili',-8.5556,125.5612,NULL,'Language school - Tetum, Portuguese, English',NULL,NULL,'education.language',123,0,4.7,156,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077469,1778077469,NULL,'none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('ngo-001','CARE International Timor-Leste','care-international-timor-leste','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 2100','+670',NULL,'info@careintl.tl','Fatumas Hel, Dili',-8.5523,125.5689,NULL,'Fighting poverty - gender equality, food security',NULL,NULL,'',234,0,4.8,67,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077474,1778077474,'ngo','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('ngo-002','World Vision Timor-Leste','world-vision-timor-leste','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 3456','+670',NULL,'info@wvi.org','Campo, Dili',-8.5498,125.5634,NULL,'Children well-being programs',NULL,NULL,'',189,0,4.7,89,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077479,1778077479,'ngo','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('ngo-003','Plan International Timor-Leste','plan-international-timor-leste','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 4567','+670',NULL,'info.tl@plan-international.org','Motael, Dili',-8.5567,125.5656,NULL,'Children rights and equality for girls',NULL,NULL,'',156,0,4.6,45,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077487,1778077487,'ngo','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('ngo-004','Cruz Vermelha Timor-Leste','cruz-vermelha-timor-leste','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 2345','+670',NULL,'cvtl@cvtimor.tl','Bairro Pite, Dili',-8.5512,125.5534,NULL,'Red Cross - humanitarian aid, disaster response',NULL,NULL,'',98,0,4.5,34,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077492,1778077492,'ngo','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('gov-001','STAE - Electoral Administration','stae-electoral-administration','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 1234','+670',NULL,'info@stae.tl','Palacio do Gov',-8.5534,125.5601,NULL,'Manages elections and democratic processes',NULL,NULL,'',67,0,4.2,23,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077497,1778077497,'government','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('gov-002','Ministerio da Saude','ministerio-da-saude','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 4567','+670',NULL,'geral@ms.gov.tl','Avenida do Museu, Dili',-8.5545,125.5589,NULL,'Public health policy and healthcare',NULL,NULL,'',134,0,4.4,56,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077505,1778077505,'government','none',NULL);
INSERT INTO "business_pages" ("id","title","slug","owner_id","category_id","entity_type","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","industry","likes","saves","rating_average","rating_count","views","plan_type","publish_date","expiry_date","registration_url","verified_badge","social_links","photo_gallery","latest_update","latest_update_images","latest_update_date","created_at","updated_at","organization_type","subscription_status","grace_period_end_date") VALUES('gov-003','PMDTL - Protecao Civil','pmdtl-protecao-civil','system',NULL,'nonprofit','live',NULL,NULL,NULL,'+670 331 7890','+670',NULL,'protecao.civil@pmdtl.tl','Fatumeta, Dili',-8.5489,125.5567,NULL,'Civil protection and disaster management',NULL,NULL,'',45,0,4.3,19,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,1778077510,1778077510,'government','none',NULL);
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
CREATE TABLE `media` (
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
CREATE TABLE `orders` (
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
INSERT INTO "orders" ("id","business_page_id","user_id","plan_type","amount","status","expiry_date","payment_method","paid_date","admin_notes","created_at","updated_at") VALUES('order-1777809820389-9xr1fr45l','biz-1777694938343','qxPYNRXCn11ubNuTHFXJc4r9MMZg4ik2','basic-monthly',29,'unpaid',NULL,NULL,NULL,NULL,1777809820,1777809820);
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`media_id` text NOT NULL,
	`position` integer DEFAULT 0
);
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`business_page_id` text NOT NULL,
	`price_fields` text,
	`service_type` text DEFAULT 'product',
	`price` text,
	`price_unit` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
, specifications TEXT, featured INTEGER DEFAULT 0, active INTEGER DEFAULT 1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-1','Timor Gold Coffee','Premium roasted coffee beans, 500g','biz-1',NULL,'product','5.00',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-2','Espresso Special','Double shot espresso with Timor beans','biz-1',NULL,'product','.00',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-3','Deluxe Suite','Ocean view suite with breakfast included','biz-2',NULL,'accommodation','50/night',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-4','Standard Room','Comfortable room with city view','biz-2',NULL,'accommodation','0/night',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-5','Website Development','Custom website with responsive design','biz-3',NULL,'service','00+',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-6','IT Consultation','Expert IT advice for your business','biz-3',NULL,'service','0/hour',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-7','Surfboard Rental','Quality surfboards for all levels','biz-4',NULL,'rental','0/day',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-8','Dental Checkup','Complete dental examination and cleaning','biz-5',NULL,'service','0',NULL,1776906423,1776906423,NULL,0,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-001','Standard Room',NULL,'biz-001',NULL,'accommodation','45','USD/night',1778077558,1778077558,'{"roomType":"double","maxGuests":2}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-002','Deluxe Suite',NULL,'biz-001',NULL,'accommodation','85','USD/night',1778077568,1778077568,'{"roomType":"suite","maxGuests":3}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-003','Timor Blend Coffee',NULL,'biz-002',NULL,'food','3','USD',1778077573,1778077573,'{"priceRange":"$"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-004','Sunset Set Lunch',NULL,'biz-002',NULL,'food','12','USD',1778077579,1778077579,'{"mealType":"lunch","priceRange":"565424"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-005','Nasi Goreng Spesial',NULL,'biz-005',NULL,'food','8','USD',1778077584,1778077584,'{"cuisine":["Indonesian"],"priceRange":"565531"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-006','Seafood Platter',NULL,'biz-005',NULL,'food','25','USD',1778077589,1778077589,'{"mealType":"dinner","priceRange":"565564$"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-007','Oil Change Service',NULL,'biz-007',NULL,'automotive','25','USD',1778077593,1778077593,'{"serviceCategory":"repair"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-008','Full Service Inspection',NULL,'biz-007',NULL,'automotive','75','USD',1778077602,1778077602,'{"serviceCategory":"repair","warranty":"6 months"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-009','Tetum Course',NULL,'biz-008',NULL,'education','120','USD/month',1778077608,1778077608,'{"courseType":"language","subject":"Tetum"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-010','English Intensive',NULL,'biz-008',NULL,'education','150','USD/month',1778077613,1778077613,'{"courseType":"language","subject":"English","certificate":true}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-011','Fresh Bread Loaf',NULL,'biz-006',NULL,'food','2.5','USD',1778077618,1778077618,'{"priceRange":"$"}',1,1);
INSERT INTO "products" ("id","title","description","business_page_id","price_fields","service_type","price","price_unit","created_at","updated_at","specifications","featured","active") VALUES('prod-012','Birthday Cake Custom',NULL,'biz-006',NULL,'food','25','USD',1778077623,1778077623,'{"priceRange":"565816$"}',1,1);
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`business_page_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`is_edited` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
INSERT INTO "reviews" ("id","business_page_id","user_id","rating","comment","is_edited","created_at","updated_at") VALUES('rev-1','biz-1','user-2',5,'Best coffee in Dili! Love the atmosphere.',0,1777886877,1777886877);
INSERT INTO "reviews" ("id","business_page_id","user_id","rating","comment","is_edited","created_at","updated_at") VALUES('rev-2','biz-1','user-3',4,'Great coffee, but can get crowded on weekends.',0,1777886877,1777886877);
INSERT INTO "reviews" ("id","business_page_id","user_id","rating","comment","is_edited","created_at","updated_at") VALUES('rev-3','biz-2','user-1',5,'Amazing views and excellent service!',0,1777886877,1777886877);
INSERT INTO "reviews" ("id","business_page_id","user_id","rating","comment","is_edited","created_at","updated_at") VALUES('rev-4','biz-2','user-3',5,'Best hotel in Timor. Will definitely return.',0,1777886877,1777886877);
INSERT INTO "reviews" ("id","business_page_id","user_id","rating","comment","is_edited","created_at","updated_at") VALUES('rev-5','biz-3','user-1',4,'Very professional team. Helped us modernize our business.',0,1777886877,1777886877);
INSERT INTO "reviews" ("id","business_page_id","user_id","rating","comment","is_edited","created_at","updated_at") VALUES('rev-6','biz-5','user-1',5,'Dr. Belo is fantastic! Painless procedure.',0,1777886877,1777886877);
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
INSERT INTO "site_settings" ("id","key","value","updated_at") VALUES('site_name','site_name','',1778202028);
INSERT INTO "site_settings" ("id","key","value","updated_at") VALUES('contact_email','contact_email','',1778202028);
INSERT INTO "site_settings" ("id","key","value","updated_at") VALUES('contact_phone','contact_phone','',1778202028);
INSERT INTO "site_settings" ("id","key","value","updated_at") VALUES('payment_info','payment_info','',1778202028);
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified INTEGER DEFAULT 0,
  phone TEXT,
  name TEXT NOT NULL,
  image TEXT,
  role TEXT DEFAULT 'user',
  created_at INTEGER,
  updated_at INTEGER
);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('d76ZR6Sq0sey4WCbmgcX95K4xlvsfB8e','new1777856597720@test.com',0,NULL,'Auth Test',NULL,'user',1777856599,1777856599);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('x6hEVBqkwUvHozuZrfRjaLRHPZUvQODE','atest@test.com',0,NULL,'A Test',NULL,'user',1777857005,1777857005);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('3PJIKscSjwgmh3DYTQe51YVnwuSoJ9uA','prod-direct-1777859925516@test.com',0,NULL,'Prod Direct Test',NULL,'user',1777859927,1777859927);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('user-1','john@example.com',0,NULL,'John Smith',NULL,'user',NULL,NULL);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('user-2','maria@example.com',0,NULL,'Maria Santos',NULL,'user',NULL,NULL);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('user-3','carlos@example.com',0,NULL,'Carlos Oliveira',NULL,'user',NULL,NULL);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('j2mQc2fKhIGpDrMhAjPeLg3lpGjo4U5M','test2@test.com',0,NULL,'Test',NULL,'user',1777891008,1777891008);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('admin-main','admin@timorup.com',0,NULL,'Admin',NULL,'super_admin',1778130000,1778130000);
INSERT INTO "users" ("id","email","email_verified","phone","name","image","role","created_at","updated_at") VALUES('user-main','user@timorup.com',0,NULL,'User',NULL,'user',1778130000,1778130000);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('zstesNdLaNsRP8zjQKTZBhoNKPdgrPJa','d76ZR6Sq0sey4WCbmgcX95K4xlvsfB8e','rgCtf2Ryu10eXq3OilocOutMzeATQmJ8',1778461400,'','',1777856600,1777856600);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('MsixO4aJgs5V2OCRzOfI9MoLTIvKuRzG','x6hEVBqkwUvHozuZrfRjaLRHPZUvQODE','97JTV1RwSPCmYHRdWEA34sqHBmgRtwhR',1778461805,'','',1777857005,1777857005);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('NJFVwplY43VmDzkKEn5uFC56HJcSITzM','x6hEVBqkwUvHozuZrfRjaLRHPZUvQODE','s5S1FeUBLxG6teOrYjiwaTQhiSCE7rhT',1778461818,'','',1777857018,1777857018);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('sirY2NwH6qOD0evkYJBReWWnqZPW8XsU','3PJIKscSjwgmh3DYTQe51YVnwuSoJ9uA','knlEacs5QAOT7tZufMYHQ6qmXUSQ4Y9a',1778464727,'','',1777859927,1777859927);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('AMrvbCPJVg7tENBvHTBecqPCyQaRbmiv','j2mQc2fKhIGpDrMhAjPeLg3lpGjo4U5M','qfhvHEeJQM9KyC1u9akrS6FqVAdVD2xk',1778495809,'','',1777891009,1777891009);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('h6nmx4CeDhqDC2dA7rT4CBwiykv8tjzz','j2mQc2fKhIGpDrMhAjPeLg3lpGjo4U5M','6hI9JgjtwsDFhMUIuOFuSzhZ7BtXIIXK',1778495819,'','',1777891019,1777891019);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('uTXKHvj1nuwFAW6JvurDsO472o465Y8g','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','u19O5FZKXKScG5UJHTGzA0ed8BIbckxN',1778496265,'','',1777891465,1777891465);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('xIVR9OT5LzMzeBsfqgyV8K0gdqLittPG','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','l7isOT2jGN9WRH9zDLrx7g0V4avb81FI',1778496268,'','',1777891468,1777891468);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('Rs932BeyeEe5jUAGP5x7bpjruc2ayGSj','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','Gcew28rl0COalA6TI49WsQh0vtXoPlKE',1778496719,'','',1777891919,1777891919);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('3R7bFHkxSwO8jOTZ1LgXXRuALY5xoXzR','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','SRBW4RlffavMcVbcueRObMYpzptYgUKA',1778496765,'','',1777891965,1777891965);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('LcFzXG2F8qQf6hQlixOrmnac0EyoksR3','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','TbZ7oHnhQgsczCNP53LLxrVLgO9C67vI',1778496866,'','',1777892066,1777892066);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('Q9OJ6pK8VPV66hZPhYASpDKUa0Nhn1yN','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','JHXz2xAv86fdkgLUzZugK85qMTdwPnXt',1778497006,'','',1777892206,1777892206);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('dVG8xJoctSOUCchs0cYiSbGPyDQ4tyfr','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','BwjcamGZ2heNHtmvRdkVDoCjXEJIl1kv',1778497026,'','',1777892226,1777892226);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('nZvzZ53Crj3n72ivpAGBYVdOLDJN18lA','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','VTEBp4PWjZr0lXV2nvYCyjLzYQ7c21Wu',1778497045,'','',1777892245,1777892245);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('byykmxRzBxVvEBEGb3Ov47cf9xrWmZmi','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','xuqCR35qU52BPoFFKHpevd8Pc3GOFyK1',1778497111,'','',1777892311,1777892311);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('NeHI8vZWiLNmkqkFpHGSdxln8PNsH0VP','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','xYGjzj11SDi1wRn1dyKqILrBk2uERYDD',1778497923,'','',1777893123,1777893123);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('GIKc1XYSR75SVyjrYXIGB9LdFhIEI7E9','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','0C9DdyoUiGfGZBPe7a1NV0QMLXBCpZ8q',1778498029,'','',1777893229,1777893229);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('tfh4hMbXm4ZGBmPDSm2fGOAy7LvU7V9G','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','lMtrE4SX3BAJxRZN8EKXdiLeUwVe7sJ0',1778498051,'','',1777893251,1777893251);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('BjzUiYmv5CBdNxdX6IOPB9qvgLsZhwXm','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','7YkSTOAohL2gB138EVXUcyLbwUoWN335',1778501620,'','',1777896820,1777896820);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('tmi3g5xIW0Wpzwl3K6mmPGxTgC90G0Zd','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','BxCnDDgspjN8ZRWleb9pK4x20gLoar6e',1778501635,'','',1777896835,1777896835);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('vfZVdkuRIrm9hwE8fwWGLsGGSM18SGCW','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','LaXcE2ZXjkX0HEZaKaiCxAbMkeY9xMIz',1778501805,'','',1777897005,1777897005);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('xJsz0JZpMyZ6UVyls1IgzC3ypPa0xinX','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','E7jnXAcf29XEIb5JSKIVksbEAEl6KkTe',1778501831,'','',1777897031,1777897031);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('CKr608yueXjq439N1yteHm0S3Hzz1eCF','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','7QAg0DoC8Reo9beUluvALVcP7sdfVN7f',1778502525,'','',1777897725,1777897725);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('YBUBNf0emhP1V3sBOepL1QivEw9jAeaw','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','7Al4bXWfAoEIwZQQFyCNfOZ11ke8xCfA',1778739753,'','',1778134953,1778134953);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('YrxzdWCzbNCLusJMEKvYwIjNlBQVb8YU','TXd2dXFbLQfYFI0gSx5mDIMOuWvtF6LQ','2Aw0N7SbKtQgYdOm4T1hfS1PRhWmrPVS',1778739812,'','',1778135012,1778135012);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('UWzlgePyMqWyMlt42XBd7qUBpfm0xeBT','admin-main','xoI1kWv7zmbdOURLG0Ld8hYrS7SC819e',1778740091,'','',1778135291,1778135291);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('WQ012IeIn6CSN43il8xvkEWxPBYPHmoF','user-main','jXYdJbuR6ZccOflFOuOvpYMnmcJoxyl2',1778740092,'','',1778135292,1778135292);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('RQunZAALz59ahzFK2uNC9uqpTIlWRG5c','admin-main','hBZYe9fmEN8SYoZW7uG9qhpohc9ZvBAB',1778740119,'','',1778135319,1778135319);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('aPZH5qkwnj279AJPGkH0H2x7IkpW4AoK','user-main','VdVf2BuFyNTGFsnwqEtvPGGYM81kzkn9',1778740121,'','',1778135321,1778135321);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('bK2AfnGIudQ6UCLSzGgvGO7gVTJ2GzUB','admin-main','1sB3TqZ6Pypinnpvc66VQCIyKAikBxpm',1778740135,'','',1778135335,1778135335);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('uMuG7K3F8EVcweo7aAbXZfGyMW9jrT1l','admin-main','C8QjqSaCBrN8yXNHTl2ugGklpVVdRL4U',1778740250,'','',1778135450,1778135450);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('qAeiLWQE0AFLMmVLgWe25fU5N6BIH4ZY','admin-main','lFyMnivEo9v8aPgmxL11g3cha5PmTusl',1778740302,'','',1778135502,1778135502);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('4sVhCeiIHvYlDnjftLGVxo4Y0ovwxEz7','user-main','HVsjEGDye9oeOYO6mP3kUxMowGtqjfA2',1778740303,'','',1778135503,1778135503);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('JC0xXAXo735RsICZMdIPzS8ECeo7yvd5','admin-main','8REgkOWsqnNLPXIJsLiUUoMF3fQYbopQ',1778740487,'','',1778135687,1778135687);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('Z7QlA7Jf4nEtVh5aBzMMx1fnFoGL5PrT','user-main','sn7IckcEPZdfghc3wptFN0l6lQZAiyGo',1778740488,'','',1778135688,1778135688);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('2dJiDrEdb7jQS5Y1Iq6VdBjN0VZhXzzW','admin-main','ce6xg3lxHGPnCTUU2jBrcpqoEngBnHTW',1778740609,'','',1778135809,1778135809);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('HUF1ZJk9fdAQZm2MEoRMYC8MGeMDxuci','admin-main','6WsBxEjMLaZLPbEKQrPr15rvOYDuBomt',1778740678,'','',1778135878,1778135878);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('7H0Qk3fhLCYZRCOwE6ZFvvm17sm0pF2L','admin-main','CTacTnSMUzykPBkuqq45l6ZqwItguExF',1778740705,'','',1778135905,1778135905);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('1uGbUGj4MXd0fgMEHZ2c5LfLu40RPRUR','admin-main','oSEV1iWM0EUednrKbgeLa3vQd0cZ2VS7',1778740844,'','',1778136044,1778136044);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('w0mlldPNf4NdEIgoxd0DeSW1v1EuDECq','user-main','IIMhe1T7T2XYm094jKYOhBuPfXdJCTct',1778740845,'','',1778136045,1778136045);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('0WoxLUXNZEt5IOchTY0f5sEmKtyjxtzo','admin-main','CPKVown9n2mtC6lGYySlfGB9ZwQ2OBVO',1778765070,'','',1778160270,1778160270);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('Y65ezFmIToU72nVtg7CEJUcZYh95OpMv','admin-main','yyKn69EWOaP5yYe9FcTeO5yG1A1l3aYV',1778765092,'','',1778160292,1778160292);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('aJxASgd4zB1Vb08hBFbTmRXv1h8CtTrn','user-main','0tvh6xFzzGltDtCrVAkUpNjzYcqblNHG',1778765092,'','',1778160292,1778160292);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('wjaqWjs1wbnvSBQrngim6EOMCnCAJNpJ','admin-main','oy9D0lz8yuGUsoAyawWXQiAXBitNtQGJ',1778765110,'','',1778160310,1778160310);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('8y9eANYVILuKRnCktm1sNkknKSlXH6ZB','admin-main','f3NqlEeyEu3MUl8zdbQJM8OHFw44Qs3M',1778765129,'','',1778160329,1778160329);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('o0i59mTR090FTcPHFsymRIukSEhmNYlu','user-main','pypoFPVEd1wIIIlRpsxxGaap0Xq1JSQr',1778765130,'','',1778160330,1778160330);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('bbqerNCAlA1BAibOTb49uojpGB7xNkyG','admin-main','gbpYksy5jtk5RUM3842nob9ySJa9MUAU',1778765246,'','',1778160446,1778160446);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('EPU34r0Sm6vn5xX2KV6uTTRXZS7GP9Od','admin-main','LBXTkCCX3WkNAS92xCNnZqPs3KL5vgDy',1778765862,'','',1778161062,1778161062);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('zVzHv5K5mcJkQmZtnDx3KItHQRqueAuh','admin-main','ZZL4k4AXAcCj48I04z14p7iwOP3CUQY5',1778766086,'','',1778161286,1778161286);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('0sagAf48AbjUSLrpIiU7itG5db9uwbgN','admin-main','MmzHVBK60reEnvumWIFjGZrX6wCnAzLd',1778766275,'','',1778161475,1778161475);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('25pjtEdLORZi7kg6IjOqHKt3YmejQcis','admin-main','WBMuR8WRqm8ATlRemkLeOSK2KVTwCvn9',1778766547,'','',1778161747,1778161747);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('1MsPIzazRRGiFQMDViv3H94tM2Yjqw5g','user-main','aFx8DdljupKGpo5WGHcNoszFBeVm8qpn',1778766550,'','',1778161750,1778161750);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('zF5QxuR5fI7MHtMUBFIqTPdsjJomyADg','admin-main','wVfAmjw0gHXX8DZJQQ8u3ElM5f5c2KOA',1778768616,'','',1778163816,1778163816);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('GmnJdRBLbN5wwpd357meUXebjaeDIE7M','admin-main','44FhGPFU1rGgRL71IEWajdwK6xJhWPEK',1778806516,'','',1778201716,1778201716);
INSERT INTO "sessions" ("id","user_id","token","expires_at","ip_address","user_agent","created_at","updated_at") VALUES('i5FfdRcPVRQVM7NQ44vVcu4g9twxAWN5','admin-main','LuLptwmui57cQ1jn1Bs6PZgsd9UnfM8l',1778806806,'','',1778202006,1778202006);
CREATE TABLE accounts (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
INSERT INTO "accounts" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('s2J2LNh0ZS9EzntXr22cIytujxGcdno8','d76ZR6Sq0sey4WCbmgcX95K4xlvsfB8e','credential','d76ZR6Sq0sey4WCbmgcX95K4xlvsfB8e',NULL,NULL,NULL,NULL,NULL,NULL,'fa6e387b2a6d9593ebc7a6f482d047cb:048c842a97761a087a83545ec0f590199ba336e8d9ccea563e1a1ab708ccaa3e0e2d25b0b2e95464540aa8024d35c9d09da0cd4de993f66b77b831a9a5a32fc8',1777856600,1777856600);
INSERT INTO "accounts" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('LP6CpKHigZHkACGAW2L1mIhFn2euLPLr','x6hEVBqkwUvHozuZrfRjaLRHPZUvQODE','credential','x6hEVBqkwUvHozuZrfRjaLRHPZUvQODE',NULL,NULL,NULL,NULL,NULL,NULL,'028f9f969a7b2e339a8ef336fef7399e:47d5ea89ab0f861636a983254c295b2ded89d61d4376c736a618b30e832b131cb0adbe4782a35cd48f16c1c3eaa580dfdae4f63f67f66f97028e5146879ffbbf',1777857005,1777857005);
INSERT INTO "accounts" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('zE5acCGcGnID1mVJTrfMbzxkwbAV7uow','3PJIKscSjwgmh3DYTQe51YVnwuSoJ9uA','credential','3PJIKscSjwgmh3DYTQe51YVnwuSoJ9uA',NULL,NULL,NULL,NULL,NULL,NULL,'8b9aa33ee0faca68cdc2810cd39ae837:6cf8fc7353fd1e2b2a6626e32923a888a0ec054c17f73f4db4c43b4af2dcbed7d22fa4983ee477744295f237f2fbf30bce2b806e0c24a8aaf6bfa12d32b3dbb0',1777859927,1777859927);
INSERT INTO "accounts" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('P4VsuzziZZRjrlqBFGHyJ5VwVpCaTE9X','j2mQc2fKhIGpDrMhAjPeLg3lpGjo4U5M','credential','j2mQc2fKhIGpDrMhAjPeLg3lpGjo4U5M',NULL,NULL,NULL,NULL,NULL,NULL,'443c770e0b0590e00beecc4426712a50:0b144d90928854f1362000a5e8e4e220c946ba5cc130e3e838055eaa22525f784aaca8ee67cab8b0bcd48512fb4c27de0b6083f4edf655282f7042c2f5374872',1777891008,1777891008);
INSERT INTO "accounts" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('acc-admin-main','acc-admin-main','credential','admin-main',NULL,NULL,NULL,NULL,NULL,NULL,'1fcd01691889426f1bb5adf16aa48436:b48f5e6a010f598d7fb6bbe9225d540e432284b7798f9fd27566c53f509a64c4e7987b0a1bbed330f0e5e9dc623b60ad29f73bdcb1adc8951c59c4c755037a88',1778135278,1778135278);
INSERT INTO "accounts" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at") VALUES('acc-user-main','acc-user-main','credential','user-main',NULL,NULL,NULL,NULL,NULL,NULL,'4e5b8d96b547d7beee67df4d2c146a6b:f17ee084759e1f7bbe55a4f2c21e2e960a8268262410791fa7f9cc59454c03ff44962f92b0f44c60ef21b97a45e4585964389fe48efed418a1764baf64b8d162',1778135278,1778135278);
CREATE TABLE verifications (
  id TEXT PRIMARY KEY NOT NULL,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER
);
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_add_missing_indexes.sql','2026-05-06 11:30:49');
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  amount INTEGER NOT NULL,
  sku_limit INTEGER NOT NULL DEFAULT 10,
  max_images INTEGER NOT NULL DEFAULT 5,
  max_videos INTEGER NOT NULL DEFAULT 1,
  features TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);
INSERT INTO "plans" ("id","name","period","amount","sku_limit","max_images","max_videos","features","description","sort_order","active","created_at","updated_at") VALUES('basic-monthly','Basic','monthly',29,10,5,1,'["10 products/services", "5 images per product", "Photo gallery", "Map integration", "Customer reviews", "Business page with full details", "Contact information"]','For small businesses getting started',1,1,1778149041,1778149041);
INSERT INTO "plans" ("id","name","period","amount","sku_limit","max_images","max_videos","features","description","sort_order","active","created_at","updated_at") VALUES('basic-yearly','Basic','yearly',290,10,5,1,'["10 products/services", "5 images per product", "Photo gallery", "Map integration", "Customer reviews", "Business page with full details", "Contact information", "Save 17% with annual billing"]','Save 17% with annual billing',2,1,1778149041,1778149041);
INSERT INTO "plans" ("id","name","period","amount","sku_limit","max_images","max_videos","features","description","sort_order","active","created_at","updated_at") VALUES('pro-monthly','Pro','monthly',59,30,5,1,'["30 products/services", "5 images per product", "Priority support", "Enhanced visibility", "Photo gallery", "Map integration", "Customer reviews", "All Basic features"]','For growing businesses',3,1,1778149041,1778149041);
INSERT INTO "plans" ("id","name","period","amount","sku_limit","max_images","max_videos","features","description","sort_order","active","created_at","updated_at") VALUES('pro-yearly','Pro','yearly',590,30,5,1,'["30 products/services", "5 images per product", "Priority support", "Enhanced visibility", "Photo gallery", "Map integration", "Customer reviews", "All Basic features", "Save 17% with annual billing"]','Save 17% with annual billing',4,1,1778149041,1778149041);
INSERT INTO "plans" ("id","name","period","amount","sku_limit","max_images","max_videos","features","description","sort_order","active","created_at","updated_at") VALUES('max-monthly','Max','monthly',89,60,5,1,'["60 products/services", "5 images per product", "Dedicated support", "Featured placement", "Priority support", "Enhanced visibility", "All Pro features"]','For established businesses',5,1,1778149041,1778149041);
INSERT INTO "plans" ("id","name","period","amount","sku_limit","max_images","max_videos","features","description","sort_order","active","created_at","updated_at") VALUES('max-yearly','Max','yearly',890,60,5,1,'["60 products/services", "5 images per product", "Dedicated support", "Featured placement", "Priority support", "Enhanced visibility", "All Pro features", "Save 17% with annual billing"]','Save 17% with annual billing',6,1,1778149041,1778149041);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',1);
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);
CREATE INDEX `blog_posts_slug_idx` ON `blog_posts` (`slug`);
CREATE INDEX `blog_posts_author_idx` ON `blog_posts` (`author_id`);
CREATE INDEX `blog_posts_status_idx` ON `blog_posts` (`status`);
CREATE UNIQUE INDEX `business_pages_slug_unique` ON `business_pages` (`slug`);
CREATE INDEX `business_owner_idx` ON `business_pages` (`owner_id`);
CREATE INDEX `business_status_idx` ON `business_pages` (`status`);
CREATE INDEX `business_entity_type_idx` ON `business_pages` (`entity_type`);
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);
CREATE INDEX `orders_business_idx` ON `orders` (`business_page_id`);
CREATE INDEX `orders_user_idx` ON `orders` (`user_id`);
CREATE INDEX `products_business_idx` ON `products` (`business_page_id`);
CREATE INDEX `reviews_business_idx` ON `reviews` (`business_page_id`);
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);
CREATE UNIQUE INDEX `site_settings_key_unique` ON `site_settings` (`key`);
CREATE INDEX business_likes_idx ON business_pages (likes DESC);
CREATE INDEX business_category_idx ON business_pages (category_id);
CREATE INDEX business_status_likes_idx ON business_pages (status, likes DESC);
CREATE INDEX product_images_product_idx ON 'product_images' ('product_id');
CREATE INDEX product_images_media_idx ON 'product_images' ('media_id');
CREATE INDEX ad_banners_active_idx ON 'ad_banners' ('is_active');
CREATE INDEX ad_banners_date_range_idx ON 'ad_banners' ('start_date', 'end_date');
CREATE INDEX categories_parent_idx ON 'categories' ('parent_id');
CREATE INDEX categories_entity_type_idx ON 'categories' ('entity_type');
CREATE INDEX media_business_idx ON 'media' ('business_id');
CREATE INDEX media_creator_idx ON 'media' ('created_by_id');
CREATE INDEX orders_status_idx ON 'orders' ('status');
CREATE INDEX users_role_idx ON 'users' ('role');
CREATE INDEX sessions_user_idx ON 'sessions' ('user_id');
CREATE INDEX accounts_user_idx ON 'accounts' ('user_id');
CREATE INDEX verifications_expires_idx ON 'verifications' ('expires_at');
CREATE INDEX blog_posts_cover_idx ON 'blog_posts' ('cover_image_id');
CREATE INDEX blog_posts_published_idx ON 'blog_posts' ('published_at');
CREATE INDEX plans_sort_order_idx ON plans(sort_order);
CREATE INDEX plans_active_idx ON plans(active);
