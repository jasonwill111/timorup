-- Service Packages Seed Data for TimorUp
-- Run: npx wrangler d1 execute timorlist-db --remote --file ./migrations/seed-service-packages.sql

-- Business Plans (subscription)
INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-business-basic', 'Basic Business Plan', 'basic-monthly', 'subscription', 'business', 'For small businesses', '{"variants":[{"name":"Basic Monthly","price":39,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":10},"features":["Up to 10 products/services","Business profile","Reviews & ratings"]}]}', 1, 10, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-business-pro', 'Pro Business Plan', 'pro-monthly', 'subscription', 'business', 'For growing businesses', '{"variants":[{"name":"Pro Monthly","price":69,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":30},"features":["Up to 30 products/services","Featured placement","Analytics dashboard"]}]}', 1, 20, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-business-max', 'Max Business Plan', 'max-monthly', 'subscription', 'business', 'For established businesses', '{"variants":[{"name":"Max Monthly","price":99,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":60},"features":["Up to 60 products/services","Top placement","Full analytics","Priority support"]}]}', 1, 30, 1748370000000, 1748370000000);

-- Listing Renewals (listing_renewal)
INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-listing-7days', '7-Day Listing Renewal', '7-day-listing', 'listing_renewal', 'listing', '7 days listing visibility', '{"variants":[{"name":"7 Days","price":8,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"maxImages":4,"maxVideos":1},"features":["7-day visibility","Up to 4 images","1 video"]}]}', 1, 100, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-listing-30days', '30-Day Listing Renewal', '30-day-listing', 'listing_renewal', 'listing', '30 days listing visibility', '{"variants":[{"name":"30 Days","price":15,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["30-day visibility","Up to 6 images","1 video","Basic stats"]}]}', 1, 110, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-listing-365days', '365-Day Listing Renewal', '365-day-listing', 'listing_renewal', 'listing', 'Full year listing visibility', '{"variants":[{"name":"365 Days","price":120,"currency":"USD","durationValue":365,"durationUnit":"days","limits":{"maxImages":8,"maxVideos":1},"features":["365-day visibility","Up to 8 images","1 video","Full stats","Priority support"]}]}', 1, 120, 1748370000000, 1748370000000);

-- Ad Banners - Homepage (homepage position, can link to any type)
INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-banner-homepage-business', 'Homepage Banner (Business)', 'banner-homepage-business', 'ad_banner', 'homepage', 'Banner on homepage linking to a business', '{"variants":[{"name":"7 Days","price":50,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"linkTarget":"business"},"features":["Homepage banner","Link to business page","High visibility"]}]}', 1, 200, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-banner-homepage-listing', 'Homepage Banner (Listing)', 'banner-homepage-listing', 'ad_banner', 'homepage', 'Banner on homepage linking to a listing', '{"variants":[{"name":"7 Days","price":50,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"linkTarget":"listing"},"features":["Homepage banner","Link to listing","High visibility"]}]}', 1, 201, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-banner-homepage-product', 'Homepage Banner (Product)', 'banner-homepage-product', 'ad_banner', 'homepage', 'Banner on homepage linking to a product', '{"variants":[{"name":"7 Days","price":50,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"linkTarget":"business_product"},"features":["Homepage banner","Link to product","High visibility"]}]}', 1, 202, 1748370000000, 1748370000000);

-- Ad Banners - List Pages (can only link to corresponding type)
INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-banner-businesses', 'Businesses Page Banner', 'banner-businesses', 'ad_banner', 'business', 'Banner on businesses listing page', '{"variants":[{"name":"7 Days","price":30,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"linkTarget":"business"},"features":["Businesses page banner","Link to business"]}]}', 1, 210, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-banner-listings', 'Listings Page Banner', 'banner-listings', 'ad_banner', 'listing', 'Banner on listings listing page', '{"variants":[{"name":"7 Days","price":30,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"linkTarget":"listing"},"features":["Listings page banner","Link to listing"]}]}', 1, 220, 1748370000000, 1748370000000);

INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at) VALUES
('sp-banner-products', 'Products Page Banner', 'banner-products', 'ad_banner', 'business_product', 'Banner on products/services page', '{"variants":[{"name":"7 Days","price":30,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"linkTarget":"business_product"},"features":["Products page banner","Link to product"]}]}', 1, 230, 1748370000000, 1748370000000);