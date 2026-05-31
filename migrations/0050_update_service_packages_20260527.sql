-- Update pricing for service_packages (2026-05-27)
-- Basic: $39/mo, $390/yr (10 products)
-- Pro: $69/mo, $690/yr (30 products)
-- Max: $99/mo, $990/yr (60 products)
-- Listing renewals: $8/7days, $15/30days, $120/365days

-- Delete old packages
DELETE FROM service_packages WHERE id IN ('sp-7days', 'sp-30days', 'sp-365days', 'sp-business-starter', 'sp-business-professional', 'sp-business-enterprise');

-- Insert new listing packages
INSERT INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
VALUES 
('sp-7days', '7-Day Listing Renewal', '7-day-listing', 'listing_renewal', 'listing', 'Extend your listing visibility for 7 days',
 '{"variants":[{"name":"7 Days","price":8,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"maxImages":4,"maxVideos":1},"features":["7-day listing visibility","Up to 4 images","1 video"]}]}',
 1, 1, 1758921600000, 1758921600000);

INSERT INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
VALUES 
('sp-30days', '30-Day Listing Renewal', '30-day-listing', 'listing_renewal', 'listing', 'Monthly listing with better visibility',
 '{"variants":[{"name":"30 Days","price":15,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["30-day listing visibility","Up to 6 images","1 video","Basic stats"]}]}',
 1, 2, 1758921600000, 1758921600000);

INSERT INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
VALUES 
('sp-365days', '365-Day Listing Renewal', '365-day-listing', 'listing_renewal', 'listing', 'Full year listing with maximum exposure',
 '{"variants":[{"name":"365 Days","price":120,"currency":"USD","durationValue":365,"durationUnit":"days","limits":{"maxImages":8,"maxVideos":1},"features":["365-day listing visibility","Up to 8 images","1 video","Full stats","Priority support"]}]}',
 1, 3, 1758921600000, 1758921600000);

-- Insert new business subscription packages
INSERT INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
VALUES 
('sp-business-basic', 'Basic Business Plan', 'basic-monthly', 'subscription', 'business', 'For small businesses starting out',
 '{"variants":[{"name":"Basic Monthly","price":39,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":10},"features":["Up to 10 products/services","Business profile","Reviews & ratings"]},{"name":"Basic Annual","price":390,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":10},"features":["Up to 10 products/services","Business profile","Reviews & ratings","Save 17%"]}]}',
 1, 11, 1758921600000, 1758921600000);

INSERT INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
VALUES 
('sp-business-pro', 'Pro Business Plan', 'pro-monthly', 'subscription', 'business', 'For growing businesses',
 '{"variants":[{"name":"Pro Monthly","price":69,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":30},"features":["Up to 30 products/services","Featured placement","Analytics dashboard"]},{"name":"Pro Annual","price":690,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":30},"features":["Up to 30 products/services","Featured placement","Analytics dashboard","Save 17%"]}]}',
 1, 20, 1758921600000, 1758921600000);

INSERT INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
VALUES 
('sp-business-max', 'Max Business Plan', 'max-monthly', 'subscription', 'business', 'For established businesses',
 '{"variants":[{"name":"Max Monthly","price":99,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":60},"features":["Up to 60 products/services","Top placement","Full analytics","Priority support"]},{"name":"Max Annual","price":990,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":60},"features":["Up to 60 products/services","Top placement","Full analytics","Priority support","Save 17%"]}]}',
 1, 30, 1758921600000, 1758921600000);
