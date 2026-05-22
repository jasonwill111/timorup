-- ========================================
-- NON_PROFITS - Update with full data
-- ========================================

UPDATE non_profits SET 
  about_us = 'CARE International has been working in Timor-Leste since 1999, focusing on women's empowerment, food security, and emergency response. We work with local communities to create lasting change.',
  contact_name = 'Maria Fatima',
  contact_number = '77010001',
  country_code = '+670',
  email = 'info@care-tl.org',
  address = 'Bairro Pite, Dili',
  location_lat = -8.5500,
  location_lng = 125.5700,
  tags = '["women empowerment","food security","education","emergency relief"]',
  likes = 234,
  saves = 56,
  views = 2340,
  verified_badge = 1,
  photo_gallery = '["ngo-care-1","ngo-care-2"]',
  latest_update = 'New program launched: Digital literacy training for women in rural areas.',
  latest_update_date = 1778427500
WHERE id = 'ngo-001';

UPDATE non_profits SET 
  about_us = 'World Vision Timor-Leste focuses on child well-being, working through area development programs in 6 municipalities. Our programs include education, health, and economic development.',
  contact_name = 'Joaquim Soares',
  contact_number = '77010002',
  country_code = '+670',
  email = 'info@worldvision.tl',
  address = 'Lahane, Dili',
  location_lat = -8.5400,
  location_lng = 125.5800,
  tags = '["children","education","health","development"]',
  likes = 189,
  saves = 45,
  views = 1890,
  verified_badge = 1,
  photo_gallery = '["ngo-wv-1","ngo-wv-2"]',
  latest_update = 'Celebrating 25 years of service to children in Timor-Leste!',
  latest_update_date = 1778427400
WHERE id = 'ngo-002';

UPDATE non_profits SET 
  about_us = 'Plan International Timor-Leste operates in 8 municipalities, focusing on child protection, youth empowerment, and disaster risk reduction. We ensure children, especially girls, have access to quality education.',
  contact_name = 'Ana til',
  contact_number = '77010003',
  country_code = '+670',
  email = 'info@plan-tl.org',
  address = 'Metiaut, Dili',
  location_lat = -8.5300,
  location_lng = 125.5900,
  tags = '["youth","education","child protection","girls empowerment"]',
  likes = 156,
  saves = 38,
  views = 1560,
  verified_badge = 1,
  photo_gallery = '["ngo-plan-1"]'
WHERE id = 'ngo-003';

UPDATE non_profits SET 
  about_us = 'Cruz Vermelha Timor-Leste (Timor-Leste Red Cross) provides humanitarian assistance, disaster response, and blood donation services. We are part of the world\'s largest humanitarian network.',
  contact_name = 'Dr. João Belo',
  contact_number = '77010004',
  country_code = '+670',
  email = 'cruzvermelha@cv.tl',
  address = 'Avenida dos Heroes, Dili',
  location_lat = -8.5569,
  location_lng = 125.5603,
  tags = '["red cross","humanitarian","disaster response","blood donation"]',
  likes = 178,
  saves = 42,
  views = 1780,
  verified_badge = 1,
  photo_gallery = '["ngo-redcross-1"]'
WHERE id = 'ngo-004';

-- Add more non-profits
INSERT OR REPLACE INTO non_profits (id, title, slug, owner_id, category_id, status, about_us, contact_name, contact_number, country_code, email, address, location_lat, location_lng, tags, likes, saves, views, verified_badge, created_at, updated_at)
VALUES ('npo-001', 'Fundasaun Alola', 'fundasaun-alola', 'admin', NULL, 'published', 'Fundasaun Alola promotes women and children welfare through education, health, and economic programs. Named after Queen Alola, the mother of the nation.', 'Fernanda til', '77010010', '+670', 'info@alola.tl', 'Caicoli, Dili', -8.5500, 125.5650, '["women","children","education","health"]', 89, 23, 890, 1, 1778427500, 1778427500);

INSERT OR REPLACE INTO non_profits (id, title, slug, owner_id, category_id, status, about_us, contact_name, contact_number, country_code, email, address, location_lat, location_lng, tags, likes, saves, views, verified_badge, created_at, updated_at)
VALUES ('npo-002', 'Shine Timor', 'shine-timor', 'admin', NULL, 'published', 'Shine Timor provides shelter and support for victims of domestic violence. We offer counseling, legal aid, and reintegration programs.', 'Maria til', '77010011', '+670', 'info@shinetimor.tl', 'Bairro Formosa, Dili', -8.5400, 125.5750, '["women","domestic violence","shelter","counseling"]', 67, 18, 670, 1, 1778427500, 1778427500);

INSERT OR REPLACE INTO non_profits (id, title, slug, owner_id, category_id, status, about_us, contact_name, contact_number, country_code, email, address, location_lat, location_lng, tags, likes, saves, views, verified_badge, created_at, updated_at)
VALUES ('npo-003', 'PrOtect Earth Timor', 'protect-earth-timor', 'admin', NULL, 'published', 'Environmental conservation organization working on reforestation, marine protection, and climate change awareness in Timor-Leste.', 'Carlos til', '77010012', '+670', 'info@protectearth.tl', 'Bidau, Dili', -8.5550, 125.5550, '["environment","conservation","reforestation","climate"]', 45, 12, 450, 1, 1778427500, 1778427500);

INSERT OR REPLACE INTO non_profits (id, title, slug, owner_id, category_id, status, about_us, contact_name, contact_number, country_code, email, address, location_lat, location_lng, tags, likes, saves, views, verified_badge, created_at, updated_at)
VALUES ('npo-004', 'Asosiasaun Feto Timor-Leste', 'asosiasaun-feto-tl', 'admin', NULL, 'published', 'National women\'s organization advocating for gender equality, women\'s rights, and political participation. Established 2000.', 'Anabella til', '77010013', '+670', 'info@afeto.tl', 'Lahane, Dili', -8.5450, 125.5850, '["women rights","gender equality","advocacy","politics"]', 78, 21, 780, 1, 1778427500, 1778427500);

INSERT OR REPLACE INTO non_profits (id, title, slug, owner_id, category_id, status, about_us, contact_name, contact_number, country_code, email, address, location_lat, location_lng, tags, likes, saves, views, verified_badge, created_at, updated_at)
VALUES ('npo-005', 'Habitat Timor-Leste', 'habitat-tl', 'admin', NULL, 'published', 'Building homes, hope, and communities. Habitat TL provides affordable housing solutions and home improvement loans for low-income families.', 'Jose til', '77010014', '+670', 'info@habitat.tl', 'Comoro, Dili', -8.5350, 125.5950, '["housing","community","affordable","construction"]', 56, 15, 560, 1, 1778427500, 1778427500);

INSERT OR REPLACE INTO non_profits (id, title, slug, owner_id, category_id, status, about_us, contact_name, contact_number, country_code, email, address, location_lat, location_lng, tags, likes, saves, views, verified_badge, created_at, updated_at)
VALUES ('npo-006', 'Fundasaun Chea Timor', 'fundasaun-chea-timor', 'admin', NULL, 'published', 'Indigenous knowledge preservation and community development. Working with rural communities to document and protect traditional practices.', 'Tia til', '77010015', '+670', 'info@cheatimor.tl', 'Same, Manufahi', -8.4200, 125.7500, '["culture","indigenous","community","tradition"]', 34, 9, 340, 1, 1778427500, 1778427500);

