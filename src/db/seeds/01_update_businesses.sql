-- ========================================
-- BUSINESSES - Update with full data
-- ========================================

-- biz-1: Café Timor
UPDATE businesses SET 
  industry = 'food.cafes',
  contact_name = 'João Silva',
  contact_number = '77001234',
  country_code = '+670',
  email = 'info@cafetimor.tl',
  address = 'Avenida de Portugal, Dili',
  location_lat = -8.5569,
  location_lng = 125.5603,
  opening_hours = '{"monday":{"open":"07:00","close":"22:00"},"tuesday":{"open":"07:00","close":"22:00"},"wednesday":{"open":"07:00","close":"22:00"},"thursday":{"open":"07:00","close":"22:00"},"friday":{"open":"07:00","close":"23:00"},"saturday":{"open":"08:00","close":"23:00"},"sunday":{"open":"08:00","close":"20:00"}}',
  about_us = 'Café Timor is the premier coffee destination in Dili, serving the finest Timor-Leste coffee beans since 2010. We offer a cozy atmosphere perfect for meetings, study sessions, or relaxing with friends.',
  tags = '["coffee","cafe","wifi","meeting place","breakfast","lunch"]',
  likes = 156,
  saves = 42,
  views = 1250,
  plan_type = 'pro',
  verified_badge = 1,
  photo_gallery = '["img-1","img-2","img-3"]',
  latest_update = 'New seasonal menu available! Try our new Timor Blend cold brew.',
  latest_update_date = 1778427500
WHERE id = 'biz-1';

-- biz-2: Hotel Timor
UPDATE businesses SET 
  industry = 'accommodation.hotels',
  contact_name = 'Maria Reis',
  contact_number = '77005678',
  country_code = '+670',
  email = 'reservations@hoteltimor.tl',
  address = 'Beach Road, Dili',
  location_lat = -8.4833,
  location_lng = 125.5856,
  opening_hours = '{"monday":{"open":"00:00","close":"23:59"},"tuesday":{"open":"00:00","close":"23:59"}}',
  about_us = 'Hotel Timor offers luxury accommodation with stunning ocean views. Located on Beach Road, we provide world-class amenities including a swimming pool, restaurant, and conference facilities.',
  tags = '["hotel","luxury","pool","wifi","restaurant","ocean view"]',
  likes = 289,
  saves = 78,
  views = 3420,
  plan_type = 'max',
  verified_badge = 1,
  photo_gallery = '["img-hotel-1","img-hotel-2","img-hotel-3"]',
  latest_update = 'Grand opening celebration this weekend! 20% off all rooms.',
  latest_update_date = 1778427500
WHERE id = 'biz-2';

-- biz-3: Timor Tech Solutions
UPDATE businesses SET 
  industry = 'technology.it-services',
  contact_name = 'Carlos Almeida',
  contact_number = '77009999',
  country_code = '+670',
  email = 'carlos@timortech.tl',
  address = 'Building Trade Tower, Level 3, Dili',
  location_lat = -8.5569,
  location_lng = 125.5603,
  opening_hours = '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"}}',
  about_us = 'Timor Tech Solutions provides professional IT consulting and web development services. We specialize in custom software development, website design, and IT support for businesses of all sizes.',
  tags = '["it","consulting","web development","software","tech support"]',
  likes = 87,
  saves = 23,
  views = 890,
  plan_type = 'basic',
  verified_badge = 1,
  photo_gallery = '["img-tech-1"]',
  latest_update = 'Now offering cloud hosting services for local businesses.',
  latest_update_date = 1778427400
WHERE id = 'biz-3';

-- biz-4: Beach Shop Dili
UPDATE businesses SET 
  industry = 'retail.souvenirs',
  contact_name = 'Ana Costa',
  contact_number = '77004567',
  country_code = '+670',
  email = 'shop@beachdili.tl',
  address = 'Coastal Road, Dili',
  location_lat = -8.4567,
  location_lng = 125.5734,
  about_us = 'Beach Shop offers souvenirs, swimwear, and beach essentials. We are the go-to destination for beach lovers and tourists looking for authentic Timor-Leste memorabilia.',
  tags = '["souvenirs","swimwear","beach","shopping","gifts"]',
  likes = 45,
  saves = 12,
  views = 456,
  plan_type = 'basic',
  verified_badge = 0,
  photo_gallery = '["img-beach-1","img-beach-2"]'
WHERE id = 'biz-4';

-- biz-5: Timor Dental Clinic
UPDATE businesses SET 
  industry = 'health.dental',
  contact_name = 'Dr. Pedro Santos',
  contact_number = '77007890',
  country_code = '+670',
  email = 'info@timordental.tl',
  address = 'Main Street, Dili',
  location_lat = -8.5569,
  location_lng = 125.5603,
  about_us = 'Professional dental services with modern equipment. Dr. Pedro Santos and team provide comprehensive dental care including check-ups, cleanings, fillings, and cosmetic dentistry.',
  tags = '["dental","health","medical","clinic","dentist"]',
  likes = 67,
  saves = 18,
  views = 789,
  plan_type = 'pro',
  verified_badge = 1,
  photo_gallery = '["img-dental-1","img-dental-2"]'
WHERE id = 'biz-5';

