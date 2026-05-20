-- Listing Renewals - All listings have same limits: 6 images, 1 video
INSERT OR REPLACE INTO service_packages (id, name, slug, type, category, description, variants, is_active, sort_order) VALUES
('sp-7days', '7-Day Listing', '7-day-listing', 'listing_renewal', 'listing', '7-day listing visibility', '[{"name":"7 Days","price":5,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["7-day listing visibility"]}]', 1, 1);

INSERT OR REPLACE INTO service_packages (id, name, slug, type, category, description, variants, is_active, sort_order) VALUES
('sp-30days', '30-Day Listing', '30-day-listing', 'listing_renewal', 'listing', '30-day listing visibility', '[{"name":"30 Days","price":15,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["30-day listing visibility"]}]', 1, 2);

INSERT OR REPLACE INTO service_packages (id, name, slug, type, category, description, variants, is_active, sort_order) VALUES
('sp-365days', '365-Day Listing', '365-day-listing', 'listing_renewal', 'listing', '365-day listing visibility', '[{"name":"365 Days","price":100,"currency":"USD","durationValue":365,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["365-day listing visibility"]}]', 1, 3);
