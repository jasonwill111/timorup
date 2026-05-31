PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE users (id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, created_at INTEGER);
CREATE TABLE accounts (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at INTEGER,
    refresh_token_expires_at INTEGER,
    scope TEXT,
    password TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE verifications (
    id TEXT PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER
  );
CREATE TABLE business_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE non_profit_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE public_sector_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE listing_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE media (
    id TEXT PRIMARY KEY NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    purpose TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    alt TEXT,
    hash TEXT UNIQUE,
    created_by_id TEXT,
    created_at INTEGER,
    deleted_at INTEGER
  );
CREATE TABLE businesses (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    banner_image_id TEXT,
    profile_image_id TEXT,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    year_of_establishment INTEGER,
    email TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    opening_hours TEXT,
    about_us TEXT,
    latest_updates TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    rating_average REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    plan_type TEXT,
    publish_date INTEGER,
    expiry_date INTEGER,
    subscription_status TEXT DEFAULT 'none',
    subscription_expires_at INTEGER,
    grace_period_end_date INTEGER,
    limits TEXT,
    plan_slug TEXT,
    verified_badge INTEGER DEFAULT 0,
    social_links TEXT,
    photo_gallery TEXT,
    organization_type TEXT,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  );
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-001','Cafe Timor','cafe-timor-dili','user-admin','cat-food','published',NULL,NULL,'Maria Soares','77012345','+670',NULL,'info@cafetimor.tl','Avenida de Portugal, Dili, Timor-Leste',-8.5562,125.5603,'Mon-Sat: 7:00 AM - 9:00 PM','Dili''s oldest continuously operating cafe since 1983. Famous for local coffee and traditional Timorese breakfast. We source all our coffee beans from the highlands of Aileu and Ermera municipalities.',NULL,'cafe,coffee,local,traditional',89,45,1245,0,0,0,'professional',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":30}',NULL,0,NULL,NULL,'local_business',NULL,1771682108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-002','Dive Timor Lorosae','dive-timor-lorosae','user-admin','cat-tourism','published',NULL,NULL,'Joao Santos','77123456','+670',NULL,'dive@timorlorosae.com','Cristo Rei Beach, Dili',-8.5821,125.4478,'Daily: 8:00 AM - 5:00 PM','Professional scuba diving and snorkeling services. We offer PADI certified courses and guided dives to the famous Dive Timor lorosae coral reefs. Our team includes locally trained dive masters who know the best spots.',NULL,'diving,snorkeling,marine,tourism',156,98,2341,0,0,0,'professional',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":30}',NULL,0,NULL,NULL,'tourism',NULL,1769090108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-003','Baucau Leather Works','baucau-leather-works','user-admin','cat-handcrafts','published',NULL,NULL,'Francisco Ximenes','77234567','+670',NULL,'leather@baucau.tl','Rua Principal, Baucau City',-8.4765,126.4532,'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 12:00 PM','Traditional leather craftsman from Baucau. We create authentic Timorese leather bags, wallets, and belts using traditional techniques passed down through three generations. All materials are locally sourced.',NULL,'leather,crafts,traditional,handmade',34,22,567,0,0,0,'starter',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":10}',NULL,0,NULL,NULL,'local_business',NULL,1774274108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-004','Timor Tech Solutions','timor-tech-solutions','user-admin','cat-technology','published',NULL,NULL,'Pedro Almeida','77345678','+670',NULL,'info@timortech.tl','Level 2, Delta Center, Dili',-8.5589,125.5734,'Mon-Fri: 9:00 AM - 6:00 PM','Leading IT services company in Timor-Leste. We provide web development, network solutions, and IT consulting to businesses and government agencies. Our team consists of certified IT professionals.',NULL,'it,services,technology,consulting',112,67,1892,0,0,0,'enterprise',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":60}',NULL,0,NULL,NULL,'tech_company',NULL,1763906108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-005','Lospalos Rice Mills','lospalos-rice-mills','user-admin','cat-agriculture','published',NULL,NULL,'Tomas da Costa','77456789','+670',NULL,'rice@lospalos.tl','Lospalos Town, Lautem Municipality',-8.7866,127.0192,'Mon-Sat: 6:00 AM - 6:00 PM','Primary rice processing facility in the Lautem region. We mill and package locally grown rice from the rice terraces of the region. Our rice is known for its quality and is supplied to markets throughout Timor-Leste.',NULL,'rice,agriculture,milling,food',28,15,456,0,0,0,'starter',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":10}',NULL,0,NULL,NULL,'agribusiness',NULL,1775570108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-006','Aileu Coffee Cooperative','aileu-coffee-cooperative','user-admin','cat-agriculture','published',NULL,NULL,'Ana Maria Fernandes','77567890','+670',NULL,'coffee@aileu.co.tl','Aileu Village, Aileu Municipality',-8.7299,125.5662,'Daily: 7:00 AM - 4:00 PM','Fair-trade coffee cooperative representing over 200 coffee farmers from Aileu. We produce premium organic coffee beans exported to specialty coffee roasters worldwide. Certified organic since 2018.',NULL,'coffee,organic,fair-trade,cooperative',134,89,1678,0,0,0,'professional',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":30}',NULL,0,NULL,NULL,'cooperative',NULL,1766498108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-007','Dili Medical Center','dili-medical-center','user-admin','cat-healthcare','published',NULL,NULL,'Dr. Luis Gomes','77678901','+670',NULL,'appointments@dilimedical.tl','Rua 25 de Abril, Dili',-8.5512,125.5789,'24/7 Emergency, Outpatient: Mon-Sat 8:00 AM - 8:00 PM','Private medical facility offering comprehensive healthcare services. Our team includes general practitioners, specialists, and nursing staff. We accept international health insurance.',NULL,'medical,healthcare,hospital,clinic',245,178,3456,0,0,0,'enterprise',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":60}',NULL,0,NULL,NULL,'healthcare',NULL,1762178108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-008','Oecusse Furniture','oecusse-furniture','user-admin','cat-home-furniture','published',NULL,NULL,'Rui Lobo','77789012','+670',NULL,'furniture@oecusse.tl','Pante Macassar, Oecusse',-9.2011,124.3654,'Mon-Sat: 8:00 AM - 5:00 PM','Custom furniture workshop in Oecusse. We create traditional Timorese furniture using locally sourced timber. Each piece is handcrafted by skilled artisans from the region.',NULL,'furniture,woodwork,custom,local',45,33,678,0,0,0,'starter',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":10}',NULL,0,NULL,NULL,'local_business',NULL,1774706108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-009','Tais Market','tais-market-dili','user-admin','cat-shopping','published',NULL,NULL,'Jesuina Bere','77890123','+670',NULL,'info@taismarket.tl','Comoro Market, Dili',-8.5432,125.5123,'Daily: 6:00 AM - 6:00 PM','Authentic Timorese weaving and textiles. We sell traditional tais fabrics, scarves, and table runners. All products are hand-woven by women''s cooperatives across Timor-Leste.',NULL,'tais,textiles,handicraft,traditional',189,134,2134,0,0,0,'professional',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":30}',NULL,0,NULL,NULL,'cooperative',NULL,1770818108114,1779458108114);
INSERT INTO "businesses" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","rating_average","rating_count","shares","plan_type","publish_date","expiry_date","subscription_status","subscription_expires_at","grace_period_end_date","limits","plan_slug","verified_badge","social_links","photo_gallery","organization_type","deleted_at","created_at","updated_at") VALUES('biz-010','Aqua Timor Water','aqua-timor-water','user-admin','cat-food','published',NULL,NULL,'Carlos Pereira','77901234','+670',NULL,'sales@aquatimor.tl','Hera Industrial Zone, Dili',-8.5345,125.6234,'Mon-Fri: 7:00 AM - 5:00 PM','Local bottled water company providing clean drinking water across Timor-Leste. We source from protected spring water in the mountains and use eco-friendly packaging.',NULL,'water,beverage,local,clean',56,34,892,0,0,0,'professional',NULL,NULL,'active',1810994108114,NULL,'{"skuLimit":30}',NULL,0,NULL,NULL,'manufacturing',NULL,1772546108114,1779458108114);
CREATE TABLE non_profits (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    banner_image_id TEXT,
    profile_image_id TEXT,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    year_of_establishment INTEGER,
    email TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    opening_hours TEXT,
    about_us TEXT,
    latest_updates TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    photo_gallery TEXT,
    latest_update TEXT,
    latest_update_images TEXT,
    latest_update_date INTEGER,
    registration_url TEXT,
    verified_badge INTEGER DEFAULT 0,
    social_links TEXT,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  );
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-001','Fundasaun Alola','fundasaun-alola','user-admin','cat-ngo','published',NULL,NULL,'Assunta Madeira','77000001','+670',NULL,'info@alola.tl','Bidau Santana, Dili',-8.5456,125.5678,'Mon-Fri: 8:00 AM - 5:00 PM','Leading Timor-Leste women and children organization. We focus on education, health, and economic empowerment for women and children throughout Timor-Leste.',NULL,'women,children,education,health',189,134,2345,0,NULL,NULL,NULL,NULL,'https://alola.tl',0,NULL,NULL,1753537959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-002','Caritas Timor-Leste','caritas-timor-leste','user-admin','cat-ngo','published',NULL,NULL,'Fr. Martinho da Silva','77000002','+670',NULL,'info@caritas.tl','Liquica Town',-8.4123,125.3456,'Mon-Fri: 8:00 AM - 5:00 PM','Caritas Timor-Leste is the Catholic Church development and humanitarian agency. We work for justice and the integral development of all people, especially the poor.',NULL,'catholic,development,poverty,community',145,98,1890,0,NULL,NULL,NULL,NULL,'https://caritas-tl.org',0,NULL,NULL,1744897959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-003','Ba Futuru','ba-futuru','user-admin','cat-ngo','published',NULL,NULL,'Anabela Soares','77000003','+670',NULL,'info@bafuturu.org','Comoro, Dili',-8.5432,125.5234,'Mon-Fri: 8:00 AM - 5:00 PM','Ba Futuru (Going to the Future) is a youth-focused organization working on peacebuilding, leadership development, and community engagement for young Timorese.',NULL,'youth,peacebuilding,leadership',123,89,1567,0,NULL,NULL,NULL,NULL,'https://bafuturu.org',0,NULL,NULL,1757857959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-004','Migrant Workers Center','migrant-workers-center','user-admin','cat-labor','published',NULL,NULL,'Jose da Costa','77000004','+670',NULL,'mwc@migrante.tl','Lahane, Dili',-8.5567,125.5789,'Mon-Sat: 9:00 AM - 5:00 PM','Support center for Timorese migrant workers. We provide legal assistance, counseling, and repatriation services for overseas workers and their families.',NULL,'migrant,labor,workers,support',78,56,987,0,NULL,NULL,NULL,NULL,'https://migrantworkers.tl',0,NULL,NULL,1763905959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-005','East Timor Disable Association','east-timor-disable-association','user-admin','cat-disability','published',NULL,NULL,'Vitor Maia','77000005','+670',NULL,'info@etda.tl','Becora, Dili',-8.5234,125.5567,'Mon-Fri: 8:00 AM - 5:00 PM','ETDA advocates for the rights and inclusion of people with disabilities in Timor-Leste. We provide rehabilitation services, education support, and disability awareness programs.',NULL,'disability,rights,inclusion,rehabilitation',98,67,1234,0,NULL,NULL,NULL,NULL,'https://etda.tl',0,NULL,NULL,1760449959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-006','Youth for Christ Timor-Leste','youth-for-christ-tl','user-admin','cat-youth','published',NULL,NULL,'Benedito Belo','77000006','+670',NULL,'yfc@ymail.tl','Cruz弄, Dili',-8.5501,125.5623,'Daily: 9:00 AM - 9:00 PM','Christian youth organization providing spiritual guidance, education support, and recreational activities for young people across Timor-Leste.',NULL,'youth,christian,spiritual,education',67,45,876,0,NULL,NULL,NULL,NULL,'https://yfc-tl.org',0,NULL,NULL,1766497959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-007','Environmental Conservation Timor','enviro-timor','user-admin','cat-environment','published',NULL,NULL,'Filomena Gusmao','77000007','+670',NULL,'green@environ.tl','Campus UNTL, Dili',-8.5612,125.5812,'Mon-Fri: 8:00 AM - 4:00 PM','Environmental conservation organization focused on protecting Timor-Leste natural resources. We run tree planting, marine conservation, and environmental education programs.',NULL,'environment,conservation,marine,tree-planting',112,78,1456,0,NULL,NULL,NULL,NULL,'https://enviro-timor.org',0,NULL,NULL,1763041959342,1779457959342);
INSERT INTO "non_profits" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('np-008','Timor-Leste Farmers Union','farmers-union-tl','user-admin','cat-agriculture','published',NULL,NULL,'Antonio Soares','77000008','+670',NULL,'farmers@union.tl','Aileu Town',-8.7299,125.5662,'Mon-Fri: 7:00 AM - 4:00 PM','The official farmers union representing agricultural producers across Timor-Leste. We provide training, market access, and advocacy for farmers rights.',NULL,'farmers,agriculture,union,training',89,56,1098,0,NULL,NULL,NULL,NULL,'https://farmersunion.tl',0,NULL,NULL,1755265959342,1779457959342);
CREATE TABLE public_sectors (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    banner_image_id TEXT,
    profile_image_id TEXT,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    year_of_establishment INTEGER,
    email TEXT,
    address TEXT,
    location_lat REAL,
    location_lng REAL,
    opening_hours TEXT,
    about_us TEXT,
    latest_updates TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    photo_gallery TEXT,
    latest_update TEXT,
    latest_update_images TEXT,
    latest_update_date INTEGER,
    government_data TEXT,
    registration_url TEXT,
    verified_badge INTEGER DEFAULT 0,
    social_links TEXT,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  );
INSERT INTO "public_sectors" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","government_data","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('ps-001','Ministerio da Saude','ministerio-da-saude','user-admin','cat-ministry','published',NULL,NULL,'Dr. Odete Viegas','77000010','+670',NULL,'info@saude.gov.tl','Ministerio da Saude, Dili',-8.5598,125.5756,'Mon-Fri: 8:00 AM - 5:00 PM','Ministry of Health is responsible for public health policy, healthcare services, and disease prevention programs throughout Timor-Leste.',NULL,'health,ministry,government,healthcare',234,189,3456,0,NULL,NULL,NULL,NULL,'{"ministryCode":"MOH","established":"2002","budget":"200M USD","employees":5000}','https://www.saúde.gov.tl',0,NULL,NULL,1736257959342,1779457959342);
INSERT INTO "public_sectors" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","government_data","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('ps-002','Ministerio da Educacao','ministerio-da-educacao','user-admin','cat-ministry','published',NULL,NULL,'Armando dos Santos','77000011','+670',NULL,'info@educacao.gov.tl','Avenida dos Direitos Humanos, Dili',-8.5534,125.5689,'Mon-Fri: 8:00 AM - 5:00 PM','Ministry of Education oversees all education levels from pre-school to higher education. We ensure access to quality education for all Timorese citizens.',NULL,'education,ministry,government,schools',198,145,2890,0,NULL,NULL,NULL,NULL,'{"ministryCode":"MOE","established":"2002","budget":"150M USD","schools":1500}','https://www.educacao.gov.tl',0,NULL,NULL,1736257959342,1779457959342);
INSERT INTO "public_sectors" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","government_data","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('ps-003','Servico de Immigration','servico-de-immigration','user-admin','cat-immigration','published',NULL,NULL,'Inspector Joao Belo','77000012','+670',NULL,'immigration@timor-leste.gov.tl','Avenida do Aeroporto, Dili',-8.5467,125.5245,'Mon-Sat: 8:00 AM - 4:00 PM','Immigration Department manages border control, visa processing, and residence permits for foreigners entering and staying in Timor-Leste.',NULL,'immigration,visa,border,passport',345,234,4567,0,NULL,NULL,NULL,NULL,'{"department":"Immigration","services":["Visa","Passport","Residence Permit"]}','https://immigration.gov.tl',0,NULL,NULL,1740577959342,1779457959342);
INSERT INTO "public_sectors" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","government_data","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('ps-004','Polisia Nacional de Timor-Leste','polisia-nasional','user-admin','cat-police','published',NULL,NULL,'Comandante Inspector Geral','77000013','+670',NULL,'info@police.gov.tl',' headquarters, Dili',-8.5512,125.5701,'24/7 Emergency','National Police of Timor-Leste (PNTL) maintains law and order, public safety, and enforces laws throughout the country.',NULL,'police,security,law,emergency',456,345,5678,0,NULL,NULL,NULL,NULL,'{"established":"2000","officers":3000,"stations":42}','https://www.pntl.gov.tl',0,NULL,NULL,1731937959342,1779457959342);
INSERT INTO "public_sectors" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","government_data","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('ps-005','Universidade Nacional de Timor-Leste','untl-university','user-admin','cat-university','published',NULL,NULL,'Prof. Dr. Francisco do Amaral','77000014','+670',NULL,'reitoria@untl.edu.tl','Campus Principal, Dili',-8.5612,125.5812,'Mon-Fri: 7:00 AM - 5:00 PM','National University of Timor-Leste is the premier public university. We offer undergraduate and graduate programs across medicine, engineering, social sciences, and humanities.',NULL,'university,education,higher-learning,research',567,456,6789,0,NULL,NULL,NULL,NULL,'{"established":"1985","students":15000,"faculties":10}','https://untl.edu.tl',0,NULL,NULL,1727617959342,1779457959342);
INSERT INTO "public_sectors" ("id","title","slug","owner_id","category_id","status","banner_image_id","profile_image_id","contact_name","contact_number","country_code","year_of_establishment","email","address","location_lat","location_lng","opening_hours","about_us","latest_updates","tags","likes","saves","views","shares","photo_gallery","latest_update","latest_update_images","latest_update_date","government_data","registration_url","verified_badge","social_links","deleted_at","created_at","updated_at") VALUES('ps-006','Bancos de Desenvolvimento de Timor-Leste','bd-timor','user-admin','cat-bank','published',NULL,NULL,'Director Geral','77000015','+670',NULL,'info@bd.tl','Edificio BNU, Dili',-8.5589,125.5734,'Mon-Fri: 8:30 AM - 4:30 PM','Development Bank of Timor-Leste provides financing for infrastructure, agriculture, and small business development. We support economic growth throughout the country.',NULL,'bank,finance,development,loans',178,123,2345,0,NULL,NULL,NULL,NULL,'{"established":"2003","capital":"100M USD","loans":5000}','https://bd.tl',0,NULL,NULL,1744897959342,1779457959342);
CREATE TABLE listings (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id TEXT NOT NULL,
    category_id TEXT,
    status TEXT DEFAULT 'draft',
    listing_type TEXT NOT NULL DEFAULT 'product',
    description TEXT NOT NULL,
    price TEXT,
    condition TEXT,
    location TEXT,
    location_lat REAL,
    location_lng REAL,
    contact_name TEXT,
    contact_number TEXT,
    country_code TEXT DEFAULT '+670',
    email TEXT,
    image_ids TEXT,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    last_renewed_at INTEGER,
    featured INTEGER DEFAULT 0,
    featured_until INTEGER,
    extra_data TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-001','Toyota Hilux 2019','toyota-hilux-2019-dili','user-admin','cat-vehicles','published','product','Well-maintained Toyota Hilux 4x4 pickup. Single owner, full service history. Perfect for Timor-Leste roads.','25000','Used - Good','Dili',-8.5562,125.5603,'Paulo Fernandes','77111111','+670',NULL,NULL,'vehicle,toyota,4x4,pickup',34,28,567,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-002','MacBook Pro 14-inch M3','macbook-pro-14-m3-tl','user-admin','cat-electronics','published','product','Apple MacBook Pro 14-inch with M3 chip, 18GB RAM, 512GB SSD. Excellent condition with original box and charger.','1800','Used - Like New','Dili',-8.5589,125.5734,'Maria Guterres','77111112','+670',NULL,NULL,'laptop,apple,macbook,electronics',23,19,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-003','2 Bedroom Apartment Near Beach','apartment-cristo-rei','user-admin','cat-property','published','rental','Modern 2 bedroom apartment in Cristo Rei. Fully furnished, air conditioning, 24/7 security. Walking distance to beach.','600',NULL,'Cristo Rei, Dili',-8.5821,125.4478,'Joao Soares','77111113','+670',NULL,NULL,'apartment,rental,beach,furnished',45,38,456,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-004','Kingston 32GB USB Drive Box (50 pcs)','usb-drive-box-50-pcs','user-admin','cat-electronics','published','product','Bulk sale: Kingston 32GB USB 3.0 drives in original packaging. Wholesale pricing for bulk orders.','350','New','Dili',-8.5562,125.5603,'Carlos Almeida','77111114','+670',NULL,NULL,'usb,electronics,bulk,wholesale',8,5,123,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-005','Honda Civic 2022','honda-civic-2022-dili','user-admin','cat-vehicles','published','product','Brand new Honda Civic, white color, automatic transmission. Full warranty included. Free delivery in Dili.','35000','New','Dili',-8.5598,125.5756,'Antonio da Costa','77111115','+670',NULL,NULL,'vehicle,honda,civic,new',56,45,678,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-006','Professional DSLR Camera Kit','canon-dslr-kit-dili','user-admin','cat-electronics','published','product','Canon EOS 90D with 18-135mm lens, 2 extra batteries, camera bag, 128GB SD card. Perfect for photography enthusiasts.','1400','Used - Good','Dili',-8.5545,125.5689,'Pedro Belo','77111116','+670',NULL,NULL,'camera,canon,dslr,photography',19,15,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-007','Office Space for Rent 80m2','office-space-rent-dili','user-admin','cat-property','published','rental','Prime location office space near Centro Comercial. Air conditioned, parking included. Long term lease preferred.','1200',NULL,'Dili CBD',-8.5589,125.5734,'Susana Gusmao','77111117','+670',NULL,NULL,'office,rental,commercial,cbd',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-008','Commercial Building in Dili Center','commercial-building-dili-center','user-admin','cat-property','published','rental','Three-story commercial building in prime Dili location. Ground floor retail, upper floors offices. Perfect for business.','5000',NULL,'Dili Center',-8.5562,125.5603,'Francisco Ximenes','77111118','+670',NULL,NULL,'building,commercial,rental,center',45,38,567,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-009','Tractor John Deere 5075E','tractor-john-deere-tl','user-admin','cat-agriculture','published','product','John Deere 5075E tractor, 75HP. Low hours, well maintained. Includes front loader. Ideal for rice farming.','45000','Used - Good','Suai',-9.3045,125.2567,'Tomas da Silva','77111119','+670',NULL,NULL,'tractor,agriculture,john-deere,farming',18,14,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-010','Fresh Arabica Coffee Beans 10kg','fresh-arabica-coffee-tl','user-admin','cat-food','published','product','Freshly roasted Arabica coffee beans from Aileu. Medium roast, 10kg bags. Perfect for cafes and restaurants.','180','New','Aileu',-8.7299,125.5662,'Maria Fernandes','77111120','+670',NULL,NULL,'coffee,arabica,fresh,roasted',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-011','Professional Photography Services','event-photography-dili','user-admin','cat-services','published','service','Professional photography for weddings, events, corporate functions. All edited photos delivered within 1 week.','300',NULL,'Dili',-8.5562,125.5603,'Rui Belo','77111121','+670',NULL,NULL,'photography,events,wedding,professional',19,15,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-012','House Construction Services','house-construction-tl','user-admin','cat-services','published','service','Complete house construction from foundation to finish. Licensed contractor with 10 years experience. Free quotes.','800',NULL,'Timor-Leste',-8.5562,125.5603,'Joaquim da Costa','77111122','+670',NULL,NULL,'construction,house,contractor,building',45,38,567,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-013','English Tutoring for Students','english-tutoring-dili','user-admin','cat-services','published','service','Experienced English teacher offers tutoring for students of all levels. Preparation for TOEFL and IELTS.','25',NULL,'Dili',-8.5598,125.5756,'Sarah Smith','77111123','+670',NULL,NULL,'english,tutoring,education,toefl',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-014','AC Installation and Repair','ac-installation-repair','user-admin','cat-services','published','service','Professional AC installation, repair, and maintenance services. All brands. Emergency service available.','50',NULL,'Dili',-8.5562,125.5603,'Pedro dos Santos','77111124','+670',NULL,NULL,'ac,installation,repair,maintenance',34,28,456,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-015','Mobile App Development Service','mobile-app-development','user-admin','cat-technology','published','service','Custom mobile app development for iOS and Android. Business apps, e-commerce, booking systems. Free consultation.','5000',NULL,'Remote/Dili',-8.5589,125.5734,'Miguel Soares','77111125','+670',NULL,NULL,'app,development,mobile,ios,android',19,15,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-016','Sofa Set 3+2+1 Seater','sofa-set-3-2-1-dili','user-admin','cat-home-furniture','published','product','Comfortable fabric sofa set with 3-seater, 2-seater, and single chair. Dark grey color. Excellent condition.','800','Used - Good','Dili',-8.5545,125.5689,'Ana Almeida','77111126','+670',NULL,NULL,'sofa,furniture,living-room,fabric',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-017','4-Channel Security Camera System','security-camera-system-tl','user-admin','cat-electronics','published','product','Complete 4-camera CCTV system with DVR, night vision, and remote viewing. Easy DIY installation.','450','New','Dili',-8.5562,125.5603,'Carlos Pereira','77111127','+670',NULL,NULL,'security,camera,cctv,surveillance',34,28,456,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-018','Generator 10kVA Honda','generator-10kva-honda','user-admin','cat-electronics','published','product','Reliable Honda 10kVA generator. Perfect backup power for homes and businesses. Low fuel consumption.','3500','Used - Good','Dili',-8.5598,125.5756,'Jose da Silva','77111128','+670',NULL,NULL,'generator,honda,power,backup',18,14,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-019','Queen Size Bed with Mattress','queen-bed-mattress-dili','user-admin','cat-home-furniture','published','product','Complete queen size bed with quality mattress. Wooden frame, modern design. Like new condition.','450','Used - Like New','Dili',-8.5545,125.5689,'Maria Gusmao','77111129','+670',NULL,NULL,'bed,mattress,furniture,queen',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-020','Motorcycle Yamaha NMAX 2023','yamaha-nmax-2023-tl','user-admin','cat-vehicles','published','product','Low mileage Yamaha NMAX ABS. Automatic scooter, perfect for Dili traffic. Full service history.','5500','Used - Excellent','Dili',-8.5589,125.5734,'Francisco Belo','77111130','+670',NULL,NULL,'motorcycle,yamaha,scooter,nmax',45,38,567,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-021','Traditional Tais Fabric 3 meters','traditional-tais-fabric','user-admin','cat-shopping','published','product','Authentic hand-woven Timorese tais fabric. 3 meters length, vibrant traditional colors. Perfect for traditional dress.','150','New','Suai',-9.3045,125.2567,'Jesuina Bere','77111131','+670',NULL,NULL,'tais,fabric,traditional,handwoven',56,45,678,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-022','Samsung 55 inch Smart TV','samsung-55-smart-tv','user-admin','cat-electronics','published','product','Samsung 55-inch 4K Smart TV with HDR. Built-in Netflix, YouTube, and streaming apps. Wall mount included.','650','Used - Good','Dili',-8.5562,125.5603,'Paulo Soares','77111132','+670',NULL,NULL,'tv,samsung,smart,4k,television',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-023','Stainless Steel Commercial Kitchen Equipment','commercial-kitchen-equipment','user-admin','cat-business-equipment','published','product','Complete set of commercial kitchen equipment: 6-burner stove, oven, exhaust hood, prep table, 3-door fridge. Restaurant grade.','8000','Used - Good','Dili',-8.5598,125.5756,'Antonio Fernandes','77111133','+670',NULL,NULL,'kitchen,commercial,equipment,restaurant',19,15,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-024','Landscaping and Garden Services','landscaping-garden-services','user-admin','cat-services','published','service','Professional landscaping and garden maintenance services. Design, installation, and regular maintenance. Commercial and residential.','100',NULL,'Dili',-8.5562,125.5603,'Manuel da Costa','77111134','+670',NULL,NULL,'landscaping,garden,maintenance,outdoor',18,14,234,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
INSERT INTO "listings" ("id","title","slug","owner_id","category_id","status","listing_type","description","price","condition","location","location_lat","location_lng","contact_name","contact_number","country_code","email","image_ids","tags","likes","saves","views","shares","last_renewed_at","featured","featured_until","extra_data","created_at","updated_at") VALUES('list-025','Bicycle Mountain Bike Full Suspension','mountain-bike-full-suspension','user-admin','cat-sports','published','product','Trek Fuel EX 8 mountain bike. Full suspension, 29er wheels. Perfect for Timor-Leste trails. Recently serviced.','1800','Used - Good','Aileu',-8.7299,125.5662,'Hugo Belo','77111135','+670',NULL,NULL,'bicycle,mountain-bike,trek,sports',28,22,345,0,NULL,0,NULL,NULL,1779458108114,1779458108114);
CREATE TABLE latest_updates (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    type_id TEXT NOT NULL,
    content TEXT NOT NULL,
    image_ids TEXT,
    video_id TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE product_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    form_fields TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE products (
    id TEXT PRIMARY KEY NOT NULL,
    business_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    product_type TEXT DEFAULT 'product',
    price_fields TEXT,
    specifications TEXT,
    images TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    deleted_at INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  );
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-001','biz-001','cat-food','Timor Blend Coffee','timor-blend-coffee','Our signature blend from Aileu and Ermera highlands. Medium roast with chocolate and nutty notes.','product','[{"label":"250g bag","value":"8","unit":"USD"},{"label":"500g bag","value":"15","unit":"USD"},{"label":"1kg bag","value":"28","unit":"USD"}]','[{"name":"Origin","value":"Aileu, Timor-Leste"},{"name":"Roast","value":"Medium"},{"name":"Process","value":"Washed"}]','[]',0,1,1,234,18,12,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-002','biz-001','cat-food','Traditional Breakfast Set','traditional-breakfast-set','Traditional Timorese breakfast with corn porridge, cassava leaves, and fried egg. Includes coffee.','product','[{"label":"Single serving","value":"5","unit":"USD"}]','[]','[]',0,1,2,189,15,8,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-003','biz-001','cat-food','Organic Honey','organic-honey-cafe','Local wild honey from the mountains of Timor. Pure and unprocessed.','product','[{"label":"250ml jar","value":"12","unit":"USD"}]','[{"name":"Type","value":"Wildflower"},{"name":"Origin","value":"Aileu Highlands"}]','[]',0,1,3,145,12,9,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-004','biz-001','cat-food','Coffee Bean Tasting Pack','coffee-bean-tasting-pack','Sample pack with beans from 3 different regions of Timor-Leste.','product','[{"label":"100g x 3","value":"25","unit":"USD"}]','[]','[]',0,1,4,198,21,14,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-005','biz-002','cat-tourism','Discover Scuba Diving','discover-scuba-diving','First time diving experience. Perfect for beginners. Equipment included.','service','[{"label":"2 hour session","value":"75","unit":"USD"}]','[{"name":"Duration","value":"2 hours"},{"name":"Max depth","value":"6 meters"},{"name":"Equipment","value":"Included"}]','[]',0,1,1,456,34,28,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-006','biz-002','cat-tourism','Full Day Diving Trip','full-day-diving-trip','Two tank dive trip to the best dive sites. Lunch and drinks included.','service','[{"label":"Per person","value":"150","unit":"USD"}]','[{"name":"Tanks","value":"2"},{"name":"Duration","value":"Full day"},{"name":"Lunch","value":"Included"}]','[]',0,1,2,389,29,23,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-007','biz-002','cat-tourism','PADI Open Water Course','padi-open-water-course','Complete certification course. 4 days, includes all materials and certification.','service','[{"label":"Full course","value":"550","unit":"USD"}]','[{"name":"Duration","value":"4 days"},{"name":"Certification","value":"PADI Open Water"},{"name":"Max depth","value":"18 meters"}]','[]',0,1,3,567,45,38,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-008','biz-002','cat-tourism','Snorkeling Tour','snorkeling-tour','Guided snorkeling tour to coral reefs. Equipment and boat transport included.','service','[{"label":"Half day","value":"45","unit":"USD"}]','[{"name":"Duration","value":"4 hours"},{"name":"Equipment","value":"Included"}]','[]',0,1,4,298,22,17,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-009','biz-003','cat-handcrafts','Traditional Timorese Wallet','traditional-timorese-wallet','Hand-stitched leather wallet with traditional Timorese patterns.','product','[{"label":"Standard","value":"25","unit":"USD"}]','[{"name":"Material","value":"Buffalo leather"},{"name":"Size","value":"10cm x 12cm"},{"name":"Origin","value":"Handmade in Baucau"}]','[]',0,1,1,123,18,11,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-010','biz-003','cat-handcrafts','Leather Messenger Bag','leather-messenger-bag','Spacious messenger bag perfect for daily use. Adjustable strap.','product','[{"label":"Medium","value":"85","unit":"USD"},{"label":"Large","value":"110","unit":"USD"}]','[{"name":"Material","value":"Full grain leather"},{"name":"Origin","value":"Handcrafted"}]','[]',0,1,2,234,19,14,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-011','biz-003','cat-handcrafts','Leather Belt','leather-belt-timor','Classic leather belt with brass buckle. Available in various sizes.','product','[{"label":"Standard","value":"20","unit":"USD"}]','[{"name":"Material","value":"Cowhide"},{"name":"Width","value":"3.5cm"}]','[]',0,1,3,156,12,8,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-012','biz-004','cat-technology','Website Development','website-development-timor','Professional website development for businesses. Includes hosting and maintenance.','service','[{"label":"Basic 5-page site","value":"500","unit":"USD"},{"label":"E-commerce site","value":"1200","unit":"USD"}]','[{"name":"Delivery","value":"2-4 weeks"},{"name":"Hosting","value":"1 year included"},{"name":"Support","value":"3 months"}]','[]',0,1,1,345,28,21,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-013','biz-004','cat-technology','Network Setup Service','network-setup-service','Complete office network setup. Router, switches, and access points included.','service','[{"label":"Small office (up to 10 devices)","value":"800","unit":"USD"},{"label":"Medium office (up to 30 devices)","value":"1500","unit":"USD"}]','[{"name":"Equipment","value":"Included"},{"name":"Warranty","value":"1 year"}]','[]',0,1,2,289,22,16,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-014','biz-004','cat-technology','IT Consultation','it-consultation','Hourly IT consulting for your business technology needs.','service','[{"label":"Per hour","value":"50","unit":"USD"},{"label":"Per day","value":"350","unit":"USD"}]','[{"name":"Remote","value":"Available"},{"name":"On-site","value":"Dili area"}]','[]',0,1,3,198,15,11,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-015','biz-005','cat-agriculture','Premium Rice 5kg','premium-rice-5kg','Premium quality local rice from Lospalos. Clean and polished.','product','[{"label":"5kg bag","value":"12","unit":"USD"}]','[{"name":"Origin","value":"Lospalos"},{"name":"Type","value":"Jasmine rice"}]','[]',0,1,1,234,19,12,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-016','biz-005','cat-agriculture','Premium Rice 25kg','premium-rice-25kg','Bulk rice for retailers and restaurants.','product','[{"label":"25kg bag","value":"50","unit":"USD"}]','[{"name":"Origin","value":"Lospalos"},{"name":"Type","value":"Jasmine rice"}]','[]',0,1,2,189,14,9,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-017','biz-006','cat-agriculture','Aileu Organic Coffee 250g','aileu-organic-coffee-250g','Single origin organic coffee from Aileu municipality. Light roast with floral notes.','product','[{"label":"250g","value":"10","unit":"USD"},{"label":"500g","value":"18","unit":"USD"},{"label":"1kg","value":"32","unit":"USD"}]','[{"name":"Origin","value":"Aileu, Timor-Leste"},{"name":"Certification","value":"Organic"},{"name":"Altitude","value":"1200-1600m"}]','[]',0,1,1,456,38,27,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-018','biz-006','cat-agriculture','Coffee Gift Box','coffee-gift-box','Beautiful gift box with 3 varieties of Timorese coffee. Perfect for gifts.','product','[{"label":"Gift box","value":"45","unit":"USD"}]','[{"name":"Includes","value":"3 x 100g bags"},{"name":"Packaging","value":"Gift box"}]','[]',0,1,2,289,24,18,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-019','biz-006','cat-agriculture','Coffee Equipment Set','coffee-equipment-set','Starter kit for brewing quality coffee at home. Includes dripper, kettle, and beans.','product','[{"label":"Starter set","value":"65","unit":"USD"}]','[{"name":"Includes","value":"Dripper, kettle, beans"},{"name":"Beans","value":"250g included"}]','[]',0,1,3,178,15,12,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-020','biz-007','cat-healthcare','General Health Checkup','general-health-checkup','Comprehensive health checkup including blood tests, ECG, and consultation.','service','[{"label":"Full checkup","value":"120","unit":"USD"}]','[{"name":"Duration","value":"2-3 hours"},{"name":"Report","value":"Same day"}]','[]',0,1,1,567,42,35,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-021','biz-007','cat-healthcare','Dental Checkup','dental-checkup','Complete dental examination and cleaning.','service','[{"label":"Checkup and cleaning","value":"45","unit":"USD"}]','[{"name":"Duration","value":"30 minutes"}]','[]',0,1,2,345,28,22,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-022','biz-007','cat-healthcare','Eye Examination','eye-examination','Complete eye test with prescription for glasses if needed.','service','[{"label":"Full examination","value":"35","unit":"USD"}]','[{"name":"Duration","value":"45 minutes"}]','[]',0,1,3,289,21,16,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-023','biz-008','cat-home-furniture','Timorese Dining Table','timorese-dining-table','Handcrafted wooden dining table. Seats 6 comfortably.','product','[{"label":"Standard (6 seater)","value":"450","unit":"USD"}]','[{"name":"Material","value":"Local hardwood"},{"name":"Size","value":"150cm x 90cm"},{"name":"Origin","value":"Handmade in Oecusse"}]','[]',0,1,1,234,19,14,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-024','biz-008','cat-home-furniture','Wooden Bed Frame','wooden-bed-frame','Traditional style wooden bed frame. Queen size.','product','[{"label":"Queen size","value":"380","unit":"USD"},{"label":"King size","value":"450","unit":"USD"}]','[{"name":"Material","value":"Local timber"},{"name":"Finish","value":"Natural wood"}]','[]',0,1,2,198,16,12,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-025','biz-008','cat-home-furniture','Wooden Wardrobe','wooden-wardrobe','Spacious wardrobe with 2 doors and internal shelving.','product','[{"label":"Standard","value":"320","unit":"USD"}]','[{"name":"Material","value":"Local timber"},{"name":"Size","value":"120cm x 60cm x 180cm"}]','[]',0,1,3,167,13,10,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-026','biz-009','cat-shopping','Traditional Tais Table Runner','traditional-tais-table-runner','Authentic hand-woven tais table runner. Each piece is unique.','product','[{"label":"Small (30x120cm)","value":"35","unit":"USD"},{"label":"Large (40x180cm)","value":"55","unit":"USD"}]','[{"name":"Material","value":"100% cotton"},{"name":"Origin","value":"Hand-woven in Timor-Leste"}]','[]',0,1,1,456,38,29,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-027','biz-009','cat-shopping','Tais Scarf','tais-scarf','Beautiful tais scarf. Perfect for traditional occasions or home decor.','product','[{"label":"Standard","value":"45","unit":"USD"}]','[{"name":"Material","value":"Cotton and silk blend"},{"name":"Size","value":"30cm x 200cm"}]','[]',0,1,2,389,32,24,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-028','biz-009','cat-shopping','Tais Wall Hanging','tais-wall-hanging','Large tais wall hanging. Authentic craftsmanship by local cooperatives.','product','[{"label":"Large (60x120cm)","value":"120","unit":"USD"}]','[{"name":"Material","value":"Cotton"},{"name":"Origin","value":"Local cooperatives"}]','[]',0,1,3,298,25,19,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-029','biz-010','cat-food','Spring Water 500ml','spring-water-500ml','Pure spring water from Timorese mountains. 500ml bottle.','product','[{"label":"Single bottle","value":"0.50","unit":"USD"},{"label":"Pack of 12","value":"5","unit":"USD"}]','[{"name":"Source","value":"Mountain spring"},{"name":"Size","value":"500ml"}]','[]',0,1,1,234,12,7,0,NULL,1779458108114,1779458108114);
INSERT INTO "products" ("id","business_id","category_id","title","slug","description","product_type","price_fields","specifications","images","featured","active","sort_order","views","likes","saves","shares","deleted_at","created_at","updated_at") VALUES('prod-030','biz-010','cat-food','Spring Water 1.5L','spring-water-1-5l','Family size spring water. 1.5 liter bottle.','product','[{"label":"Single bottle","value":"0.80","unit":"USD"}]','[{"name":"Source","value":"Mountain spring"},{"name":"Size","value":"1.5L"}]','[]',0,1,2,189,9,5,0,NULL,1779458108114,1779458108114);
CREATE TABLE reviews (
    id TEXT PRIMARY KEY NOT NULL,
    business_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    reply TEXT,
    replied_at INTEGER,
    replied_by TEXT,
    status TEXT DEFAULT 'pending',
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE orders (
    id TEXT PRIMARY KEY NOT NULL,
    service_package_id TEXT,
    variant_snapshot TEXT NOT NULL,
    type TEXT NOT NULL,
    type_id TEXT,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    paid_date INTEGER,
    expires_at INTEGER,
    admin_notes TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE service_packages (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    service_type TEXT NOT NULL,
    service_relation_to TEXT,
    description TEXT,
    variants TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  );
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-7days','7-Day Listing Renewal','7-day-listing','listing','listing_page','Extend your listing visibility for 7 days','[{"name":"7 Days","price":5,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"maxImages":4,"maxVideos":1},"features":["7-day listing visibility","Up to 4 images","1 video"]}]',1,1,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-30days','30-Day Listing Renewal','30-day-listing','listing','listing_page','Monthly listing with better visibility','[{"name":"30 Days","price":15,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["30-day listing visibility","Up to 6 images","1 video","Basic stats"]}]',1,2,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-365days','365-Day Listing Renewal','365-day-listing','listing','listing_page','Full year listing with maximum exposure','[{"name":"365 Days","price":100,"currency":"USD","durationValue":365,"durationUnit":"days","limits":{"maxImages":8,"maxVideos":1},"features":["365-day listing visibility","Up to 8 images","1 video","Full stats","Priority support"]}]',1,3,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-business-starter','Starter Business Plan','starter-monthly','business_page','business_page','For small businesses starting out','[{"name":"Starter Monthly","price":29,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":10},"features":["Up to 10 products/services"]},{"name":"Starter Annual","price":290,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":10},"features":["Up to 10 products/services","Save 20%"]}]',1,11,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-business-professional','Professional Business Plan','professional-monthly','business_page','business_page','For growing businesses with advanced features','[{"name":"Professional Monthly","price":49,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":30},"features":["Up to 30 products/services"]},{"name":"Professional Annual","price":440,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":30},"features":["Up to 30 products/services","Save 25%"]}]',1,20,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-business-enterprise','Enterprise Business Plan','enterprise-monthly','business_page','business_page','For established businesses with full features','[{"name":"Enterprise Monthly","price":99,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":60},"features":["Up to 60 products/services"]},{"name":"Enterprise Annual","price":990,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":60},"features":["Up to 60 products/services","Save 20%"]}]',1,30,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-featured-listing','Featured Listing Promotion','featured-listing','listing','listing_page','Boost your listing visibility with featured placement','[{"name":"7 Days Featured","price":10,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Featured in category listing","Priority placement","Badge highlight"]},{"name":"30 Days Featured","price":30,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{},"features":["Featured in category listing","Priority placement","Badge highlight"]}]',1,100,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-homepage-featured','Homepage Featured','homepage-featured','business_page','business_page','Appear on the homepage featured section','[{"name":"7 Days Homepage","price":25,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Homepage featured section","Large banner display","Priority over regular featured"]},{"name":"14 Days Homepage","price":45,"currency":"USD","durationValue":14,"durationUnit":"days","limits":{},"features":["Homepage featured section","Large banner display","Priority over regular featured"]}]',1,101,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-addon-extra-images','Extra Images Addon','extra-images','business_page','business_product_page','Purchase additional image slots for your business','[{"name":"+4 Images","price":5,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"extraImages":4},"features":["Add 4 images to your business gallery","Valid for 1 month"]}]',1,200,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-addon-extra-videos','Extra Videos Addon','extra-videos','business_page','business_product_page','Purchase additional video slots for your business','[{"name":"+1 Video","price":10,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"extraVideos":1},"features":["Add 1 video to your business gallery","Valid for 1 month"]}]',1,201,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-banner-homepage','Homepage Banner Ad','banner-homepage','ad_banner','business_page','Premium banner ad on the homepage','[{"name":"7 Days Homepage","price":50,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Homepage banner position","High visibility placement","Click tracking"]},{"name":"30 Days Homepage","price":150,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{},"features":["Homepage banner position","High visibility placement","Click tracking","Save 25%"]}]',1,300,1779457473440,1779457473440);
INSERT INTO "service_packages" ("id","name","slug","service_type","service_relation_to","description","variants","is_active","sort_order","created_at","updated_at") VALUES('sp-banner-category','Category Page Banner Ad','banner-category','ad_banner','listing_page','Banner ad on business/listings category pages','[{"name":"7 Days Category","price":30,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Business or Listings category pages","Moderate visibility","Click tracking"]},{"name":"30 Days Category","price":80,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{},"features":["Business or Listings category pages","Moderate visibility","Click tracking","Save 20%"]}]',1,301,1779457473440,1779457473440);
CREATE TABLE saved_items (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    created_at INTEGER
  );
CREATE TABLE ad_banners (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_id TEXT,
    link_url TEXT,
    link_type TEXT NOT NULL,
    position TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    order_id TEXT,
    is_active INTEGER DEFAULT 1,
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE blog_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image_id TEXT,
    author_id TEXT,
    author_name TEXT,
    status TEXT DEFAULT 'draft',
    tags TEXT,
    published_at INTEGER,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    created_at INTEGER,
    updated_at INTEGER
  );
CREATE TABLE site_settings (
    id TEXT PRIMARY KEY NOT NULL,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    type TEXT DEFAULT 'string',
    description TEXT,
    is_public INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  );
DELETE FROM sqlite_sequence;
