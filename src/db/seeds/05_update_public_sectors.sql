-- ========================================
-- PUBLIC SECTORS - Update with full data
-- ========================================

UPDATE public_sectors SET 
  about_us = 'Ministry of Finance is responsible for fiscal policy, state budget management, taxation, and public financial management. We ensure transparent and efficient use of public resources.',
  contact_name = 'Sara til',
  contact_number = '77020001',
  country_code = '+670',
  email = 'mfinancas@gov.tl',
  address = 'Government Palace, Dili',
  location_lat = -8.5569,
  location_lng = 125.5603,
  opening_hours = '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"17:00"}}',
  tags = '["government","finance","budget","taxation"]',
  likes = 50,
  saves = 15,
  views = 500,
  verified_badge = 1,
  photo_gallery = '["gov-fin-1"]',
  latest_update = 'New online tax filing portal now available!',
  latest_update_date = 1778427500
WHERE id = 'gov-001';

UPDATE public_sectors SET 
  about_us = 'Policia Nasional Timor-Leste (PNTL) maintains law and order, protects citizens, and ensures public safety. Operating 24/7 across all municipalities.',
  contact_name = 'Komandante til',
  contact_number = '77020002',
  country_code = '+670',
  email = 'pntl@gov.tl',
  address = 'Avenida Independencia, Dili',
  location_lat = -8.5569,
  location_lng = 125.5550,
  opening_hours = '{"monday":{"open":"00:00","close":"23:59"},"tuesday":{"open":"00:00","close":"23:59"}}',
  tags = '["police","security","law","public safety"]',
  likes = 100,
  saves = 25,
  views = 800,
  verified_badge = 1,
  photo_gallery = '["gov-pntl-1"]',
  latest_update = 'Emergency hotline: 112',
  latest_update_date = 1778427400
WHERE id = 'gov-002';

UPDATE public_sectors SET 
  about_us = 'Ministry of Health provides healthcare services, manages hospitals and health centers, and develops health policies for the well-being of all Timorese people.',
  contact_name = 'Dr. Tilman',
  contact_number = '77020003',
  country_code = '+670',
  email = 'msaude@gov.tl',
  address = 'Avenida de Lisboa, Dili',
  location_lat = -8.5500,
  location_lng = 125.5650,
  opening_hours = '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"}}',
  tags = '["health","medical","hospital","healthcare"]',
  likes = 80,
  saves = 20,
  views = 600,
  verified_badge = 1,
  photo_gallery = '["gov-saude-1"]',
  latest_update = 'Free vaccination program for children under 5.',
  latest_update_date = 1778427300
WHERE id = 'gov-003';

UPDATE public_sectors SET 
  about_us = 'Ministry of Education promotes quality education for all, from early childhood to higher education. We oversee schools, teacher training, and curriculum development.',
  contact_name = 'Dr. til',
  contact_number = '77020004',
  country_code = '+670',
  email = 'meduc@gov.tl',
  address = 'Avenida Xavier, Dili',
  location_lat = -8.5450,
  location_lng = 125.5700,
  opening_hours = '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"}}',
  tags = '["education","school","university","training"]',
  likes = 60,
  saves = 18,
  views = 400,
  verified_badge = 1,
  photo_gallery = '["gov-educ-1"]'
WHERE id = 'gov-004';

UPDATE public_sectors SET 
  about_us = 'Secretaria de Estado da Reforma e Emprego - State Secretary for Reform and Employment. Responsible for labor policies, employment services, and workforce development.',
  contact_name = 'Sekretariu',
  contact_number = '77020005',
  country_code = '+670',
  email = 'sre@gov.tl',
  address = 'Avenida de Portugal, Dili',
  location_lat = -8.5569,
  location_lng = 125.5603,
  opening_hours = '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"}}',
  tags = '["employment","labor","reform","workforce"]',
  likes = 40,
  saves = 12,
  views = 300,
  verified_badge = 1,
  photo_gallery = '["gov-sre-1"]',
  latest_update = 'Job fair scheduled for June 2026. Register now!',
  latest_update_date = 1778427200
WHERE id = 'gov-005';

