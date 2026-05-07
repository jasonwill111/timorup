-- Seed data for Timor-Leste businesses and non-profits
-- Run: npx wrangler d1 execute timorlist-db --remote --file=scripts/seed-timor-data.sql

-- First, ensure the organization_type column exists
ALTER TABLE business_pages ADD COLUMN organization_type text;

-- ============================================================================
-- BUSINESSES (8 businesses with various industries)
-- ============================================================================

-- 1. Hotel Timor (Accommodation)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng, ratingAverage_calc, profileImageId_calc) VALUES (
  'biz-001', 'Hotel Timor', 'hotel-timor', 'system',
  'business', 'accommodation.hotels',
  'live', 'Avenida de Portugal, Dili, Timor-Leste', '+670 331 1234', 'info@hoteltimor.tl',
  4.2, 156, 234,
  'Timor-Leste premier hotel offering modern amenities and traditional hospitality since 2002. Located in the heart of Dili with stunning bay views.',
  -8.5569, 125.5603,
  4.2, NULL
);

-- 2. Cafe Brisa Serena (Food & Dining)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-002', 'Cafe Brisa Serena', 'cafe-brisa-serena', 'system',
  'business', 'food.cafes',
  'live', 'Rua de Caminho, Dili, Timor-Leste', '+670 7723 1234', 'hello@brisaserena.tl',
  4.5, 203, 445,
  'Popular waterfront cafe known for fresh coffee, pastries, and breathtaking sunset views over the Timor Sea.',
  -8.5541, 125.5735
);

-- 3. Timor Plaza (Retail)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-003', 'Timor Plaza', 'timor-plaza', 'system',
  'business', 'retail.shopping_malls',
  'live', 'Avenida President Nicolas Lobato, Dili, Timor-Leste', '+670 331 5678', 'info@timorplaza.tl',
  4.0, 89, 167,
  'Timor-Leste largest shopping center featuring international brands, local crafts, restaurants, and entertainment.',
  -8.5578, 125.5789
);

-- 4. Hosanna Supermarket (Retail)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-004', 'Hosanna Supermarket', 'hosanna-supermarket', 'system',
  'business', 'retail.grocery',
  'live', 'Bidau Santana, Dili, Timor-Leste', '+670 331 9012', 'contact@hosanna.tl',
  4.1, 134, 89,
  'Your one-stop shop for fresh produce, imported goods, and everyday essentials. Serving Dili families since 2005.',
  -8.5389, 125.5812
);

-- 5. Kokui Indonesian Restaurant (Food)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-005', 'Kokui Indonesian Restaurant', 'kokui-restaurant', 'system',
  'business', 'food.restaurants',
  'live', 'Lacluta, Dili, Timor-Leste', '+670 7721 4567', 'reservasi@kokui.tl',
  4.3, 178, 234,
  'Authentic Indonesian cuisine with fresh ingredients. Specializing in seafood, satay, and traditional recipes from Java and Bali.',
  -8.5512, 125.5698
);

-- 6. Lita Bakery & Cafe (Food)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-006', 'Lita Bakery & Cafe', 'lita-bakery', 'system',
  'business', 'food.bakeries',
  'live', 'Comoro, Dili, Timor-Leste', '+670 331 3456', 'orders@litabakery.tl',
  4.4, 212, 567,
  'Fresh bread, pastries, and cakes baked daily. Timor-Leste favorite since 1998. Try our famous bolo and traditional pão pão.',
  -8.5423, 125.5545
);

-- 7. Ready M8 Auto Service (Automotive)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-007', 'Ready M8 Auto Service', 'ready-m8-auto', 'system',
  'business', 'automotive.repair',
  'live', 'Lelogu, Dili, Timor-Leste', '+670 7723 7890', 'service@readym8.tl',
  4.6, 98, 345,
  'Professional automotive repair and maintenance. Expert mechanics, genuine parts, and reliable service for all vehicle makes.',
  -8.5489, 125.5489
);

-- 8. Timor Language Center (Education)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, industry, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'biz-008', 'Timor Language Center', 'timor-language-center', 'system',
  'business', 'education.language',
  'live', 'Farol, Dili, Timor-Leste', '+670 331 7890', 'info@timorlc.tl',
  4.7, 156, 123,
  'Premier language school offering Tetum, Portuguese, English, and Indonesian courses. Certified teachers and small class sizes.',
  -8.5556, 125.5612
);

-- ============================================================================
-- NON-PROFITS - NGOs (4 organizations)
-- ============================================================================

-- 9. CARE International Timor-Leste
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'ngo-001', 'CARE International Timor-Leste', 'care-timor-leste', 'system',
  'nonprofit', 'ngo',
  'live', 'Rua的概率 Malik, Fatumas Hel', 'info@careintl.tl', '+670 331 2100',
  4.8, 67, 234,
  'International humanitarian organization fighting poverty and social injustice. Focus areas: gender equality, food security, water, and education.',
  -8.5523, 125.5689
);

-- 10. World Vision Timor-Leste
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'ngo-002', 'World Vision Timor-Leste', 'world-vision-timor', 'system',
  'nonprofit', 'ngo',
  'live', 'Campo, Dili, Timor-Leste', '+670 331 3456', 'info@wvi.org',
  4.7, 89, 189,
  'Christian humanitarian organization dedicated to the well-being of children. Programs in health, education, child protection, and community development.',
  -8.5498, 125.5634
);

-- 11. Plan International Timor-Leste
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'ngo-003', 'Plan International Timor-Leste', 'plan-international-tl', 'system',
  'nonprofit', 'ngo',
  'live', 'Motael, Dili, Timor-Leste', '+670 331 4567', 'info.tl@plan-international.org',
  4.6, 45, 156,
  'Development organization advancing children rights and equality for girls. Focus on education, health, and economic empowerment.',
  -8.5567, 125.5656
);

-- 12. Cruz Vermelha Timor-Leste (Red Cross)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'ngo-004', 'Cruz Vermelha Timor-Leste', 'cruz-vermelha-tl', 'system',
  'nonprofit', 'ngo',
  'live', 'Bairro Pite, Dili, Timor-Leste', '+670 331 2345', 'cvtl@cvtimor.tl',
  4.5, 34, 98,
  'National Red Cross Society of Timor-Leste. Humanitarian aid, disaster response, first aid training, and blood donation programs.',
  -8.5512, 125.5534
);

-- ============================================================================
-- NON-PROFITS - Government (3 agencies)
-- ============================================================================

-- 13. STAE - Electoral Administration
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'gov-001', 'STAE - Secretariado Técnico de Administração Eleitoral', 'stae-eleitoral', 'system',
  'nonprofit', 'government',
  'live', 'Palácio do Gov', 'info@stae.tl', '+670 331 1234',
  4.2, 23, 67,
  'Technical Secretariat for Electoral Administration. Manages elections, voter registration, and democratic processes in Timor-Leste.',
  -8.5534, 125.5601
);

-- 14. Ministério da Saúde (Ministry of Health)
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'gov-002', 'Ministério da Saúde - Ministry of Health', 'ministerio-saude', 'system',
  'nonprofit', 'government',
  'live', 'Avenida do Museu, Dili, Timor-Leste', '+670 331 4567', 'geral@ms.gov.tl',
  4.4, 56, 134,
  'Government ministry responsible for public health policy, healthcare services, and medical infrastructure across Timor-Leste.',
  -8.5545, 125.5589
);

-- 15. PMDTL - Proteção Civil de Timor-Leste
INSERT INTO business_pages (id, title, slug, ownerId, entityType, organizationType, status, address, contactNumber, email, ratingAverage, ratingCount, likes, aboutUs, locationLat, locationLng) VALUES (
  'gov-003', 'PMDTL - Proteção Civil de Timor-Leste', 'pmdtl-civil-protection', 'system',
  'nonprofit', 'government',
  'live', 'Fatumeta, Dili, Timor-Leste', '+670 331 7890', 'protecao.civil@pmdtl.tl',
  4.3, 19, 45,
  'Civil Protection Service of Timor-Leste. Disaster management, emergency response, and community safety programs.',
  -8.5489, 125.5567
);

-- ============================================================================
-- PRODUCTS/SKUs for businesses (20 products across 5 businesses)
-- ============================================================================

-- Products for Hotel Timor (biz-001)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-001', 'Standard Room', 'biz-001', 'accommodation', '45', 'USD/night', NULL, '{"roomType":"double","maxGuests":2,"bedType":"double","checkInTime":"14:00","checkOutTime":"12:00","amenities":["wifi","ac","tv","hot_water"]}', 1, 1),
('prod-002', 'Deluxe Suite', 'biz-001', 'accommodation', '85', 'USD/night', NULL, '{"roomType":"suite","maxGuests":3,"bedType":"king","checkInTime":"14:00","checkOutTime":"12:00","amenities":["wifi","ac","tv","hot_water","minibar","ocean_view"]}', 1, 1),
('prod-003', 'Meeting Room Rental', 'biz-001', 'event', '150', 'USD/day', NULL, '{"eventType":"conference","coverage":"Dili","minBooking":"4 hours","teamIncluded":0}', 0, 1);

-- Products for Cafe Brisa Serena (biz-002)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-004', 'Timor Blend Coffee', 'biz-002', 'food', '3', 'USD', NULL, '{"mealType":"all_day","priceRange":"$"}', 1, 1),
('prod-005', 'Sunset Set Lunch', 'biz-002', 'food', '12', 'USD', NULL, '{"mealType":"lunch","priceRange":"$$","reservation":true}', 1, 1),
('prod-006', 'Pastry Combo', 'biz-002', 'food', '8', 'USD', NULL, '{"mealType":"all_day","priceRange":"$"}', 0, 1);

-- Products for Kokui Restaurant (biz-005)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-007', 'Nasi Goreng Spesial', 'biz-005', 'food', '8', 'USD', NULL, '{"cuisine":["Indonesian"],"mealType":"all_day","priceRange":"$$","reservation":true}', 1, 1),
('prod-008', 'Seafood Platter', 'biz-005', 'food', '25', 'USD', NULL, '{"cuisine":["Indonesian","Seafood"],"mealType":"dinner","priceRange":"$$$","reservation":true}', 1, 1),
('prod-009', 'Satay Set', 'biz-005', 'food', '10', 'USD', NULL, '{"cuisine":["Indonesian"],"dietaryOptions":["Halal"],"mealType":"all_day","priceRange":"$$"}', 0, 1),
('prod-010', 'Soto Ayam', 'biz-005', 'food', '6', 'USD', NULL, '{"cuisine":["Indonesian"],"dietaryOptions":["Halal"],"mealType":"all_day","priceRange":"$"}', 0, 1);

-- Products for Ready M8 Auto (biz-007)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-011', 'Oil Change Service', 'biz-007', 'automotive', '25', 'USD', NULL, '{"vehicleType":"sedan","serviceCategory":"repair","responseTime":"same_day","warranty":"3 months"}', 1, 1),
('prod-012', 'Full Service Inspection', 'biz-007', 'automotive', '75', 'USD', NULL, '{"serviceCategory":"repair","coverage":"Dili area","responseTime":"1 day","warranty":"6 months"}', 0, 1),
('prod-013', 'Tire Replacement', 'biz-007', 'automotive', '15', 'USD each', NULL, '{"serviceCategory":"repair","responseTime":"same_day","warranty":"1 year"}', 0, 1);

-- Products for Timor Language Center (biz-008)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-014', 'Tetum Language Course', 'biz-008', 'education', '120', 'USD/month', NULL, '{"courseType":"language","subject":"Tetum","duration":"4 weeks","schedule":"weekday","level":"beginner","certificate":true,"classSize":12,"language":"Mixed"}', 1, 1),
('prod-015', 'English Intensive Course', 'biz-008', 'education', '150', 'USD/month', NULL, '{"courseType":"language","subject":"English","duration":"4 weeks","schedule":"flexible","level":"intermediate","certificate":true,"classSize":10,"language":"English"}', 1, 1),
('prod-016', 'Portuguese for Beginners', 'biz-008', 'education', '100', 'USD/month', NULL, '{"courseType":"language","subject":"Portuguese","duration":"4 weeks","schedule":"evening","level":"beginner","certificate":true,"classSize":15,"language":"Portuguese"}', 0, 1);

-- Products for Lita Bakery (biz-006)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-017', 'Fresh Bread Loaf', 'biz-006', 'food', '2.5', 'USD', NULL, '{"mealType":"all_day","priceRange":"$","takeaway":true}', 1, 1),
('prod-018', 'Birthday Cake (Custom)', 'biz-006', 'food', '25', 'USD', NULL, '{"mealType":"all_day","priceRange":"$$$","takeaway":true,"reservation":true}', 1, 1),
('prod-019', 'Croissant Box (6 pcs)', 'biz-006', 'food', '8', 'USD', NULL, '{"mealType":"all_day","priceRange":"$","takeaway":true}', 0, 1);

-- Products for Hosanna Supermarket (biz-004)
INSERT INTO products (id, title, businessPageId, serviceType, price, priceUnit, priceFields, specifications, featured, active) VALUES
('prod-020', 'Fresh Fruit Basket', 'biz-004', 'product', '15', 'USD', NULL, NULL, 1, 1);

-- Verify counts
SELECT entityType, organizationType, COUNT(*) as cnt FROM business_pages GROUP BY entityType, organizationType;
