-- Seed data for timorlist (D1 compatible - camelCase columns)

-- Insert categories
INSERT OR IGNORE INTO categories (id, name, slug, description, icon) VALUES
('cat-1', 'Restaurants & Cafes', 'restaurants-cafes', 'Food and beverage establishments', 'emoji:🍽️'),
('cat-2', 'Hotels & Accommodation', 'hotels-accommodation', 'Hotels, hostels, and lodging', 'emoji:🏨'),
('cat-3', 'Shopping', 'shopping', 'Retail stores and shops', 'emoji:🛍️'),
('cat-4', 'Health & Beauty', 'health-beauty', 'Healthcare and beauty services', 'emoji:💆'),
('cat-5', 'Automotive', 'automotive', 'Car dealers, repair shops', 'emoji:🚗'),
('cat-6', 'Professional Services', 'professional-services', 'Legal, accounting, consulting', 'emoji:💼'),
('cat-7', 'Education', 'education', 'Schools, tutoring, training', 'emoji:📚'),
('cat-8', 'Entertainment', 'entertainment', 'Bars, clubs, venues', 'emoji:🎭');

-- Insert users
INSERT OR IGNORE INTO users (id, email, name, role) VALUES
('user-1', 'john@example.com', 'John Smith', 'user'),
('user-2', 'maria@example.com', 'Maria Santos', 'user'),
('user-3', 'carlos@example.com', 'Carlos Oliveira', 'user');

-- Insert business pages
INSERT OR IGNORE INTO business_pages (
  id, title, slug, ownerId, categoryId, status,
  contactName, contactNumber, countryCode, email, address,
  locationLat, locationLng, openingHours, aboutUs, tags,
  likes, saves, ratingAverage, ratingCount, views, planType
) VALUES
(
  'biz-1', 'Café Timor', 'cafe-timor', 'user-1', 'cat-1', 'live',
  'João Silva', '77001234', '+670', 'info@cafetimor.tl', 'Avenida de绍兴, Dili',
  -8.5569, 125.5603,
  '{"monday":{"open":"07:00","close":"22:00"},"tuesday":{"open":"07:00","close":"22:00"},"wednesday":{"open":"07:00","close":"22:00"},"thursday":{"open":"07:00","close":"22:00"},"friday":{"open":"07:00","close":"23:00"},"saturday":{"open":"08:00","close":"23:00"},"sunday":{"open":"08:00","close":"20:00"}}',
  'Café Timor is the premier coffee destination in Dili, serving the finest Timor-Leste coffee beans since 2010.',
  '["coffee","cafe","wifi","meeting place"]',
  156, 42, 4.5, 28, 1250, 'pro'
),
(
  'biz-2', 'Hotel Timor', 'hotel-timor', 'user-2', 'cat-2', 'live',
  'Maria Reis', '77005678', '+670', 'reservations@hoteltimor.tl', 'Beach Road, Dili',
  -8.4833, 125.5856,
  '{"monday":{"open":"00:00","close":"00:00"},"tuesday":{"open":"00:00","close":"00:00"},"wednesday":{"open":"00:00","close":"00:00"},"thursday":{"open":"00:00","close":"00:00"},"friday":{"open":"00:00","close":"00:00"},"saturday":{"open":"00:00","close":"00:00"},"sunday":{"open":"00:00","close":"00:00"}}',
  'Hotel Timor offers luxury accommodation with stunning ocean views.',
  '["hotel","luxury","pool","wifi","restaurant"]',
  289, 78, 4.8, 52, 3420, 'max'
),
(
  'biz-3', 'Timor Tech Solutions', 'timor-tech-solutions', 'user-3', 'cat-6', 'live',
  'Carlos Almeida', '77009999', '+670', 'carlos@timortech.tl', 'Building Trade, Dili',
  -8.5569, 125.5603,
  '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"17:00"},"saturday":{"open":"09:00","close":"13:00"},"sunday":{"open":"closed","close":"closed"}}',
  'Timor Tech Solutions provides IT consulting and web development services.',
  '["it","consulting","web development","software"]',
  87, 23, 4.2, 15, 890, 'pro'
),
(
  'biz-4', 'Beach Shop Dili', 'beach-shop-dili', 'user-1', 'cat-3', 'live',
  'Ana Pereira', '77005555', '+670', 'ana@beachshop.tl', 'Coastal Road, Dili',
  -8.4833, 125.5856,
  '{"monday":{"open":"09:00","close":"18:00"},"tuesday":{"open":"09:00","close":"18:00"},"wednesday":{"open":"09:00","close":"18:00"},"thursday":{"open":"09:00","close":"18:00"},"friday":{"open":"09:00","close":"18:00"},"saturday":{"open":"09:00","close":"17:00"},"sunday":{"open":"10:00","close":"14:00"}}',
  'Your one-stop shop for beachwear, surfboards, and vacation essentials.',
  '["beachwear","surf","swimwear","souvenirs"]',
  45, 12, 4.0, 8, 456, 'basic'
),
(
  'biz-5', 'Timor Dental Clinic', 'timor-dental-clinic', 'user-2', 'cat-4', 'live',
  'Dr. Sofia Belo', '77003333', '+670', 'dr.belo@timordental.tl', 'Medical Center, Dili',
  -8.5569, 125.5603,
  '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"15:00"},"saturday":{"open":"closed","close":"closed"},"sunday":{"open":"closed","close":"closed"}}',
  'Professional dental care for the whole family.',
  '["dentist","dental","health","medical"]',
  123, 34, 4.9, 41, 2100, 'pro'
);

-- Insert products
INSERT OR IGNORE INTO products (id, title, price, description, businessPageId) VALUES
('prod-1', 'Timor Gold Coffee', '$15.00', 'Premium roasted coffee beans, 500g', 'biz-1'),
('prod-2', 'Espresso Special', '$4.00', 'Double shot espresso with Timor beans', 'biz-1'),
('prod-3', 'Deluxe Suite', '$150/night', 'Ocean view suite with breakfast included', 'biz-2'),
('prod-4', 'Standard Room', '$80/night', 'Comfortable room with city view', 'biz-2'),
('prod-5', 'Website Development', '$500+', 'Custom website with responsive design', 'biz-3'),
('prod-6', 'IT Consultation', '$50/hour', 'Expert IT advice for your business', 'biz-3'),
('prod-7', 'Surfboard Rental', '$20/day', 'Quality surfboards for all levels', 'biz-4'),
('prod-8', 'Dental Checkup', '$30', 'Complete dental examination and cleaning', 'biz-5');

-- Insert reviews
INSERT OR IGNORE INTO reviews (id, businessPageId, userId, rating, comment) VALUES
('rev-1', 'biz-1', 'user-2', 5, 'Best coffee in Dili! Love the atmosphere.'),
('rev-2', 'biz-1', 'user-3', 4, 'Great coffee, but can get crowded on weekends.'),
('rev-3', 'biz-2', 'user-1', 5, 'Amazing views and excellent service!'),
('rev-4', 'biz-2', 'user-3', 5, 'Best hotel in Timor. Will definitely return.'),
('rev-5', 'biz-3', 'user-1', 4, 'Very professional team. Helped us modernize our business.'),
('rev-6', 'biz-5', 'user-1', 5, 'Dr. Belo is fantastic! Painless procedure.');
