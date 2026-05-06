-- Migration number: 0001 	 2026-05-06T11:11:47.214Z
-- Adding missing indexes for performance optimization

-- productImages table indexes
CREATE INDEX IF NOT EXISTS product_images_product_idx ON 'product_images' ('product_id');
CREATE INDEX IF NOT EXISTS product_images_media_idx ON 'product_images' ('media_id');

-- adBanners table indexes
CREATE INDEX IF NOT EXISTS ad_banners_active_idx ON 'ad_banners' ('is_active');
CREATE INDEX IF NOT EXISTS ad_banners_date_range_idx ON 'ad_banners' ('start_date', 'end_date');

-- categories table indexes
CREATE INDEX IF NOT EXISTS categories_parent_idx ON 'categories' ('parent_id');
CREATE INDEX IF NOT EXISTS categories_entity_type_idx ON 'categories' ('entity_type');

-- media table indexes
CREATE INDEX IF NOT EXISTS media_business_idx ON 'media' ('business_id');
CREATE INDEX IF NOT EXISTS media_creator_idx ON 'media' ('created_by_id');

-- businessPages table indexes (add categoryIdx)
CREATE INDEX IF NOT EXISTS business_category_idx ON 'business_pages' ('category_id');

-- orders table indexes (add statusIdx)
CREATE INDEX IF NOT EXISTS orders_status_idx ON 'orders' ('status');

-- users table indexes (add roleIdx)
CREATE INDEX IF NOT EXISTS users_role_idx ON 'users' ('role');

-- auth table indexes
CREATE INDEX IF NOT EXISTS sessions_user_idx ON 'sessions' ('user_id');
CREATE INDEX IF NOT EXISTS accounts_user_idx ON 'accounts' ('user_id');
CREATE INDEX IF NOT EXISTS verifications_expires_idx ON 'verifications' ('expires_at');

-- blogPosts indexes
CREATE INDEX IF NOT EXISTS blog_posts_cover_idx ON 'blog_posts' ('cover_image_id');
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON 'blog_posts' ('published_at');