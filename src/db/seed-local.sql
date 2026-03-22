-- Seed data for timorbiz (SQLite compatible)
-- Based on original tmbiz project data

-- Insert categories (from original tmbiz)
INSERT INTO categories (id, name, slug, description, icon) VALUES
('cat-1', 'Food & Beverage', 'food-beverage', 'Restaurants, cafes, and food services', '🍽️'),
('cat-2', 'Technology', 'technology', 'IT services, software, and tech companies', '💻'),
('cat-3', 'Retail', 'retail', 'Shops and retail stores', '🛒'),
('cat-4', 'Services', 'services', 'Professional and personal services', '💼'),
('cat-5', 'News', 'news', 'News and media outlets', '📰'),
('cat-6', 'Finance', 'finance', 'Banks, accounting, and financial services', '🏦'),
('cat-7', 'Design', 'design', 'Graphic design and creative services', '🎨'),
('cat-8', 'Software', 'software', 'Software development companies', '📱'),
('cat-9', 'Engineering', 'engineering', 'Engineering and construction', '🏗️'),
('cat-10', 'Travel & Tourism', 'travel-tourism', 'Hotels, travel agencies, tourism', '✈️'),
('cat-11', 'Arts & Crafts', 'arts-crafts', 'Handicrafts and artistic products', '🎭'),
('cat-12', 'Automotive', 'automotive', 'Car dealers, repair shops', '🚗');

-- Insert users
INSERT INTO users (id, email, name, role, avatar_url) VALUES
('user-1', 'john@example.com', 'John Smith', 'user', 'https://i.pravatar.cc/150?u=john'),
('user-2', 'maria@example.com', 'Maria Santos', 'user', 'https://i.pravatar.cc/150?u=maria'),
('user-3', 'carlos@example.com', 'Carlos Oliveira', 'user', 'https://i.pravatar.cc/150?u=carlos'),
('user-4', 'ana@example.com', 'Ana Pereira', 'user', 'https://i.pravatar.cc/150?u=ana'),
('user-5', 'jose@example.com', 'Jose da Silva', 'user', 'https://i.pravatar.cc/150?u=jose'),
('user-6', 'sofia@example.com', 'Dr. Sofia Belo', 'user', 'https://i.pravatar.cc/150?u=sofia'),
('user-7', 'manuel@example.com', 'Manuel Soares', 'user', 'https://i.pravatar.cc/150?u=manuel'),
('user-8', 'rita@example.com', 'Rita da Costa', 'user', 'https://i.pravatar.cc/150?u=rita'),
('user-9', 'fernando@example.com', 'Fernando Lima', 'user', 'https://i.pravatar.cc/150?u=fernando'),
('user-10', 'clara@example.com', 'Clara Mendes', 'user', 'https://i.pravatar.cc/150?u=clara'),
('user-11', 'pedro@example.com', 'Pedro Santos', 'user', 'https://i.pravatar.cc/150?u=pedro'),
('user-12', 'teresa@example.com', 'Teresa da Silva', 'user', 'https://i.pravatar.cc/150?u=teresa');

-- Insert business pages (from original tmbiz + expanded)
INSERT INTO business_pages (id, title, slug, owner_id, category_id, status, contact_name, contact_number, country_code, email, address, location_lat, location_lng, opening_hours, about_us, tags, likes, saves, rating_average, rating_count, views, plan_type) VALUES
-- Original tmbiz businesses
('biz-1', 'Dili Coffee House', 'dili-coffee-house', 'user-1', 'cat-1', 'live', 'João Silva', '77001234', '+670', 'info@dilicoffee.tl', 'Avenida de绍兴, Dili', -8.5569, 125.5603, '{"monday":{"open":"07:00","close":"22:00"},"tuesday":{"open":"07:00","close":"22:00"},"wednesday":{"open":"07:00","close":"22:00"},"thursday":{"open":"07:00","close":"22:00"},"friday":{"open":"07:00","close":"23:00"},"saturday":{"open":"08:00","close":"23:00"},"sunday":{"open":"08:00","close":"20:00"}}', 'The best coffee in Dili! Fresh roasted Timor-Leste coffee beans, artisan pastries, and a cozy atmosphere perfect for work or relaxation.', '["coffee","cafe","wifi","pastries"]', 156, 42, 4.5, 28, 1250, 'pro'),

('biz-2', 'Timor Tech Solutions', 'timor-tech-solutions', 'user-2', 'cat-8', 'live', 'Carlos Almeida', '77009999', '+670', 'carlos@timortech.tl', 'Building Trade, Dili', -8.5569, 125.5603, '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"17:00"},"saturday":{"open":"09:00","close":"13:00"},"sunday":{"open":"closed","close":"closed"}}', 'Professional IT consulting and software development services. We build modern websites, e-commerce platforms, and custom software for businesses in Timor-Leste.', '["it","consulting","web development","software","seo"]', 87, 23, 4.2, 15, 890, 'pro'),

('biz-3', 'Baucau Beach Resort', 'baucau-beach-resort', 'user-3', 'cat-10', 'live', 'Maria Reis', '77005678', '+670', 'reservations@baucauresort.tl', 'Baucau Beach, Timor-Leste', -8.4500, 126.4500, '{"monday":{"open":"00:00","close":"00:00"},"tuesday":{"open":"00:00","close":"00:00"},"wednesday":{"open":"00:00","close":"00:00"},"thursday":{"open":"00:00","close":"00:00"},"friday":{"open":"00:00","close":"00:00"},"saturday":{"open":"00:00","close":"00:00"},"sunday":{"open":"00:00","close":"00:00"}}', 'Beautiful beachfront resort with stunning ocean views. Perfect for families and couples seeking a relaxing getaway. Beach activities, restaurant, and bar available.', '["resort","beach","pool","restaurant","honeymoon"]', 234, 56, 4.7, 38, 1890, 'pro'),

('biz-4', 'Suai Garden Market', 'suai-garden-market', 'user-4', 'cat-3', 'live', 'Ana Pereira', '77005555', '+670', 'ana@suaimarket.tl', 'Suai, Covalima', -9.3500, 125.2500, '{"monday":{"open":"08:00","close":"18:00"},"tuesday":{"open":"08:00","close":"18:00"},"wednesday":{"open":"08:00","close":"18:00"},"thursday":{"open":"08:00","close":"18:00"},"friday":{"open":"08:00","close":"18:00"},"saturday":{"open":"08:00","close":"17:00"},"sunday":{"open":"09:00","close":"14:00"}}', 'Fresh local produce, vegetables, and fruits from surrounding farms. Supporting local farmers and providing quality produce to the community.', '["market","fresh produce","vegetables","fruits","local"]', 89, 28, 4.3, 12, 456, 'basic'),

('biz-5', 'Maubisse Mountain Lodge', 'maubisse-mountain-lodge', 'user-5', 'cat-10', 'live', 'Jose dos Santos', '77006666', '+670', 'jose@maubisselodge.tl', 'Maubisse, Aileu', -8.7500, 125.6000, '{"monday":{"open":"00:00","close":"00:00"},"tuesday":{"open":"00:00","close":"00:00"},"wednesday":{"open":"00:00","close":"00:00"},"thursday":{"open":"00:00","close":"00:00"},"friday":{"open":"00:00","close":"00:00"},"saturday":{"open":"00:00","close":"00:00"},"sunday":{"open":"00:00","close":"00:00"}}', 'Mountain retreat in the cool highlands of Maubisse. Experience traditional Timorese hospitality with modern amenities. Hiking, photography, and cultural experiences.', '["lodge","mountain","nature","hiking","cultural"]', 167, 45, 4.8, 32, 1450, 'pro'),

('biz-6', 'Liquica Beach Bar & Grill', 'liquica-beach-bar-grill', 'user-6', 'cat-1', 'live', 'Manuel Soares', '77004444', '+670', 'info@liquicabar.tl', 'Liquica Beach, Timor-Leste', -8.4500, 125.4500, '{"monday":{"open":"10:00","close":"22:00"},"tuesday":{"open":"10:00","close":"22:00"},"wednesday":{"open":"10:00","close":"22:00"},"thursday":{"open":"10:00","close":"22:00"},"friday":{"open":"10:00","close":"00:00"},"saturday":{"open":"10:00","close":"00:00"},"sunday":{"open":"10:00","close":"21:00"}}', 'Fresh seafood with ocean views. Best sunset spot in Liquica! Live music on weekends. Fresh fish, prawns, crabs, and traditional Timorese dishes.', '["restaurant","seafood","beach front","music","sunset"]', 234, 56, 4.7, 38, 1890, 'pro'),

('biz-7', 'Aileu Handicrafts Cooperative', 'aileu-handicrafts-cooperative', 'user-7', 'cat-11', 'live', 'Teresa da Silva', '77007777', '+670', 'teresa@aileuhandicrafts.tl', 'Aileu, Timor-Leste', -8.7500, 125.6000, '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"17:00"},"saturday":{"open":"09:00","close":"14:00"},"sunday":{"open":"closed","close":"closed"}}', 'Traditional Timorese handicrafts including Tais weaving, wood carvings, beaded jewelry, and pottery. Supporting local artisans and preserving cultural heritage.', '["handicrafts","tais","weaving","wood carving","jewelry"]', 189, 48, 4.9, 42, 2100, 'pro'),

('biz-8', 'Oecusse Auto Repair', 'oecusse-auto-repair', 'user-8', 'cat-12', 'live', 'Rui Martins', '77008888', '+670', 'rui@oecusseauto.tl', 'Oecusse, Timor-Leste', -9.3500, 124.3000, '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"17:00"},"saturday":{"open":"09:00","close":"12:00"},"sunday":{"open":"closed","close":"closed"}}', 'Professional auto repair services in Oecusse. Oil changes, brake service, tire rotation, and general maintenance. Authorized service for major brands.', '["auto repair","mechanic","car service","tires","batteries"]', 67, 15, 4.3, 12, 567, 'basic'),

-- Additional businesses for richer content
('biz-9', 'Dili Dental Clinic', 'dili-dental-clinic', 'user-9', 'cat-4', 'live', 'Dr. Sofia Belo', '77003333', '+670', 'dr.belo@timordental.tl', 'Medical Center, Dili', -8.5569, 125.5603, '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"15:00"},"saturday":{"open":"closed","close":"closed"},"sunday":{"open":"closed","close":"closed"}}', 'Professional dental care for the whole family. Comprehensive services including preventive care, cosmetic dentistry, orthodontics, and emergency treatments.', '["dentist","dental","health","medical","orthodontics"]', 123, 34, 4.9, 41, 2100, 'pro'),

('biz-10', 'Timor Coffee Exports', 'timor-coffee-exports', 'user-10', 'cat-1', 'live', 'Fernando Lima', '77009999', '+670', 'export@timorcoffee.tl', 'Aileu, Timor-Leste', -8.7500, 125.6000, '{"monday":{"open":"08:00","close":"17:00"},"tuesday":{"open":"08:00","close":"17:00"},"wednesday":{"open":"08:00","close":"17:00"},"thursday":{"open":"08:00","close":"17:00"},"friday":{"open":"08:00","close":"17:00"},"saturday":{"open":"09:00","close":"12:00"},"sunday":{"open":"closed","close":"closed"}}', 'Premium Timor-Leste coffee beans exported worldwide. Direct trade with highland farmers. Organic and fair trade certified. Bulk orders and private labeling.', '["coffee","exports","organic","fair trade","beans"]', 178, 45, 4.8, 35, 2100, 'max'),

('biz-11', 'Dili Photography Studio', 'dili-photography-studio', 'user-11', 'cat-7', 'live', 'Clara Mendes', '77001111', '+670', 'clara@diliphoto.tl', 'Downtown Dili', -8.5569, 125.5603, '{"monday":{"open":"09:00","close":"18:00"},"tuesday":{"open":"09:00","close":"18:00"},"wednesday":{"open":"09:00","close":"18:00"},"thursday":{"open":"09:00","close":"18:00"},"friday":{"open":"09:00","close":"18:00"},"saturday":{"open":"10:00","close":"16:00"},"sunday":{"open":"closed","close":"closed"}}', 'Professional photography for weddings, events, portraits, and commercial work. State-of-the-art equipment and experienced photographers. Studio and on-location available.', '["photography","wedding","portrait","events","commercial"]', 156, 38, 4.9, 42, 1680, 'pro'),

('biz-12', 'Timor Construction Corp', 'timor-construction-corp', 'user-12', 'cat-9', 'live', 'Pedro Santos', '77002222', '+670', 'pedro@timorconstruct.tl', 'Industrial Zone, Dili', -8.5700, 125.5800, '{"monday":{"open":"07:00","close":"17:00"},"tuesday":{"open":"07:00","close":"17:00"},"wednesday":{"open":"07:00","close":"17:00"},"thursday":{"open":"07:00","close":"17:00"},"friday":{"open":"07:00","close":"17:00"},"saturday":{"open":"08:00","close":"12:00"},"sunday":{"open":"closed","close":"closed"}}', 'Leading construction company in Timor-Leste. Residential, commercial, and infrastructure projects. Quality results on time and within budget.', '["construction","architecture","renovation","engineering","commercial"]', 234, 67, 4.5, 28, 1450, 'max'),

('biz-13', 'Hotel Timor', 'hotel-timor', 'user-1', 'cat-10', 'live', 'Reception', '77005555', '+670', 'reservations@hoteltimor.tl', 'Beach Road, Dili', -8.4833, 125.5856, '{"monday":{"open":"00:00","close":"00:00"},"tuesday":{"open":"00:00","close":"00:00"},"wednesday":{"open":"00:00","close":"00:00"},"thursday":{"open":"00:00","close":"00:00"},"friday":{"open":"00:00","close":"00:00"},"saturday":{"open":"00:00","close":"00:00"},"sunday":{"open":"00:00","close":"00:00"}}', 'Luxury hotel in Dili with stunning ocean views. Rooftop pool, spa, fitness center, and multiple dining options. Perfect for business and leisure.', '["hotel","luxury","pool","wifi","restaurant","spa"]', 289, 78, 4.8, 52, 3420, 'max'),

('biz-14', 'Dili Fitness Center', 'dili-fitness-center', 'user-2', 'cat-4', 'live', 'Carlos Almeida', '77006666', '+670', 'info@dilifitness.tl', 'CBD Dili', -8.5569, 125.5650, '{"monday":{"open":"05:00","close":"22:00"},"tuesday":{"open":"05:00","close":"22:00"},"wednesday":{"open":"05:00","close":"22:00"},"thursday":{"open":"05:00","close":"22:00"},"friday":{"open":"05:00","close":"22:00"},"saturday":{"open":"06:00","close":"20:00"},"sunday":{"open":"06:00","close":"18:00"}}', 'State-of-the-art gym with modern equipment, group fitness classes, personal training, and sauna. Free trial for new members.', '["gym","fitness","personal training","yoga","classes"]', 312, 89, 4.4, 48, 2340, 'pro'),

('biz-15', 'Beach Shop Dili', 'beach-shop-dili', 'user-3', 'cat-3', 'live', 'Ana Pereira', '77007777', '+670', 'ana@beachshop.tl', 'Coastal Road, Dili', -8.4833, 125.5856, '{"monday":{"open":"09:00","close":"18:00"},"tuesday":{"open":"09:00","close":"18:00"},"wednesday":{"open":"09:00","close":"18:00"},"thursday":{"open":"09:00","close":"18:00"},"friday":{"open":"09:00","close":"18:00"},"saturday":{"open":"09:00","close":"17:00"},"sunday":{"open":"10:00","close":"14:00"}}', 'Beachwear, surfboards, and vacation essentials. Top brands for surfing and beach activities. Expert advice on gear and local conditions.', '["beachwear","surf","swimwear","souvenirs","surfboard"]', 45, 12, 4.0, 8, 456, 'basic'),

('biz-16', 'Kids Academy', 'kids-academy', 'user-4', 'cat-4', 'live', 'Maria da Costa', '77008888', '+670', 'admissions@kidsacademy.tl', 'Comoro, Dili', -8.5400, 125.5500, '{"monday":{"open":"07:00","close":"17:00"},"tuesday":{"open":"07:00","close":"17:00"},"wednesday":{"open":"07:00","close":"17:00"},"thursday":{"open":"07:00","close":"17:00"},"friday":{"open":"07:00","close":"17:00"},"saturday":{"open":"closed","close":"closed"},"sunday":{"open":"closed","close":"closed"}}', 'Quality education for children aged 3-12. Bilingual curriculum (English & Portuguese). STEM, arts, and physical education. Nurturing environment.', '["school","education","kindergarten","bilingual","stem"]', 89, 28, 4.6, 22, 980, 'pro');

-- Insert products with SKU (from original tmbiz + expanded)
INSERT INTO products (id, title, price, description, business_page_id) VALUES
-- Aileu Handicrafts Cooperative products
('prod-1', 'Traditional Tais Textile', '$45.00', 'Hand-woven traditional Tais textile, authentic Timorese design', 'biz-7'),
('prod-2', 'Wood Carving - Small', '$25.00', 'Hand-carved wooden sculpture, traditional motif', 'biz-7'),
('prod-3', 'Beaded Jewelry Set', '$35.00', 'Traditional beaded necklace and earrings set', 'biz-7'),
('prod-4', 'Tais Table Runner', '$55.00', 'Decorative Tais table runner, perfect for home decor', 'biz-7'),
('prod-5', 'Pottery Vase', '$30.00', 'Handmade clay vase with traditional patterns', 'biz-7'),

-- Oecusse Auto Repair products
('prod-6', 'Oil Change Service', '$30.00', 'Full synthetic oil change with filter replacement', 'biz-8'),
('prod-7', 'Brake Pad Replacement', '$50.00', 'Front or rear brake pad replacement', 'biz-8'),
('prod-8', 'Tire Rotation & Balance', '$25.00', 'Rotate and balance all four tires', 'biz-8'),
('prod-9', 'Battery Replacement', '$65.00', 'New battery with installation', 'biz-8'),
('prod-10', 'Full Service', '$120.00', 'Complete vehicle service including all fluids', 'biz-8'),

-- Liquica Beach Bar products
('prod-11', 'Fresh Seafood Platter', '$25.00', 'Assorted grilled seafood for 2 persons', 'biz-6'),
('prod-12', 'Grilled Fish Special', '$18.00', 'Fresh local fish with vegetables and rice', 'biz-6'),
('prod-13', 'Tropical Fruit Smoothie', '$6.00', 'Mixed tropical fruits smoothie', 'biz-6'),
('prod-14', 'Coconut Drink', '$5.00', 'Fresh coconut water from local coconuts', 'biz-6'),
('prod-15', 'Sunset Dinner Package', '$45.00', 'Dinner with ocean view and live music', 'biz-6'),
('prod-16', 'Grilled Prawns', '$22.00', 'Large grilled prawns with garlic butter', 'biz-6'),

-- Dili Coffee House products
('prod-17', 'Timor Gold Coffee', '$4.00', 'Signature single-origin espresso', 'biz-1'),
('prod-18', 'Cappuccino', '$5.00', 'Classic cappuccino with steamed milk', 'biz-1'),
('prod-19', 'Cold Brew Coffee', '$6.00', 'Smooth cold brew served over ice', 'biz-1'),
('prod-20', 'Croissant', '$3.50', 'Freshly baked butter croissant', 'biz-1'),
('prod-21', 'Avocado Toast', '$8.00', 'Sourdough with avocado and poached egg', 'biz-1'),
('prod-22', 'Coffee Beans 250g', '$15.00', 'Whole bean Timor-Leste coffee', 'biz-1'),

-- Timor Tech Solutions products
('prod-23', 'Website Development', '$500+', 'Custom responsive website', 'biz-2'),
('prod-24', 'E-commerce Store', '$800+', 'Online store with payment integration', 'biz-2'),
('prod-25', 'SEO Optimization', '$300', 'Improve your Google ranking', 'biz-2'),
('prod-26', 'IT Consultation', '$50/hour', 'Expert IT advice session', 'biz-2'),
('prod-27', 'Domain & Hosting', '$20/month', 'Annual domain and hosting package', 'biz-2'),

-- Baucau Beach Resort products
('prod-28', 'Deluxe Room', '$80/night', 'Ocean view room with breakfast', 'biz-3'),
('prod-29', 'Family Suite', '$120/night', 'Spacious suite for families', 'biz-3'),
('prod-30', 'Honeymoon Package', '$200/night', 'Romantic package with dinner & spa', 'biz-3'),
('prod-31', 'Day Pass', '$25', 'Beach access with lunch included', 'biz-3'),
('prod-32', 'Snorkeling Trip', '$35', 'Guided snorkeling excursion', 'biz-3'),

-- Dili Dental Clinic products
('prod-33', 'Dental Checkup', '$30', 'Complete dental examination', 'biz-9'),
('prod-34', 'Teeth Cleaning', '$45', 'Professional cleaning', 'biz-9'),
('prod-35', 'Teeth Whitening', '$150', 'Professional whitening treatment', 'biz-9'),
('prod-36', 'Dental Filling', '$50', 'Composite white filling', 'biz-9'),
('prod-37', 'Root Canal', '$200', 'Endodontic treatment', 'biz-9'),

-- Timor Coffee Exports products
('prod-38', 'Coffee Beans 1kg', '$25', 'Premium roasted beans', 'biz-10'),
('prod-39', 'Coffee Beans 500g', '$15', 'Premium roasted beans', 'biz-10'),
('prod-40', 'Gift Box Set', '$45', 'Assorted coffee varieties', 'biz-10'),
('prod-41', 'Organic Coffee 1kg', '$35', 'Certified organic beans', 'biz-10'),
('prod-42', 'Coffee Sampler Pack', '$30', '4 varieties x 250g', 'biz-10'),

-- Dili Photography Studio products
('prod-43', 'Portrait Session', '$75', '1 hour professional portrait', 'biz-11'),
('prod-44', 'Wedding Coverage', '$500+', 'Full day wedding photography', 'biz-11'),
('prod-45', 'Event Photography', '$200/hour', 'Corporate event coverage', 'biz-11'),
('prod-46', 'Product Photography', '$50/item', 'E-commerce product shots', 'biz-11'),
('prod-47', 'Photo Print 8x10', '$15', 'Professional print', 'biz-11'),

-- Hotel Timor products
('prod-48', 'Standard Room', '$90/night', 'Comfortable room with city view', 'biz-13'),
('prod-49', 'Deluxe Suite', '$150/night', 'Ocean view suite with breakfast', 'biz-13'),
('prod-50', 'Executive Suite', '$250/night', 'Luxury suite with spa access', 'biz-13'),
('prod-51', 'Buffet Breakfast', '$15/person', 'International breakfast spread', 'biz-13'),
('prod-52', 'Spa Treatment', '$60', '60-minute massage', 'biz-13'),

-- Dili Fitness Center products
('prod-53', 'Monthly Membership', '$50/month', 'Full gym access', 'biz-14'),
('prod-54', 'Day Pass', '$15', 'Single day access', 'biz-14'),
('prod-55', 'Personal Training', '$40/hour', 'One-on-one session', 'biz-14'),
('prod-56', 'Yoga Class', '$12/class', 'Group yoga session', 'biz-14'),
('prod-57', 'Annual Membership', '$450/year', 'Full year unlimited access', 'biz-14'),

-- Beach Shop Dili products
('prod-58', 'Surfboard Rental', '$20/day', 'Quality surfboard rental', 'biz-15'),
('prod-59', 'Beach Towel', '$15', 'Quick-dry microfiber', 'biz-15'),
('prod-60', 'Sunscreen SPF50', '$12', 'Reef-safe sunscreen', 'biz-15'),
('prod-61', 'Surf Wax', '$8', 'Tropical temperature wax', 'biz-15'),
('prod-62', 'Beach Bag', '$25', 'Canvas beach tote bag', 'biz-15'),

-- Kids Academy products
('prod-63', 'Full-time Tuition', '$150/month', 'Full-time enrollment', 'biz-16'),
('prod-64', 'Part-time Program', '$80/month', 'Morning or afternoon only', 'biz-16'),
('prod-65', 'Summer Camp', '$200/week', 'Interactive activities', 'biz-16'),
('prod-66', 'After School Care', '$100/month', 'Extended afternoon care', 'biz-16'),
('prod-67', 'Registration Fee', '$50', 'One-time enrollment fee', 'biz-16');

-- Insert reviews
INSERT INTO reviews (id, business_page_id, user_id, rating, comment) VALUES
('rev-1', 'biz-3', 'user-4', 5, 'Amazing beach resort with perfect sunset views! The staff was incredibly friendly and the rooms were spotless. Will definitely return.'),
('rev-2', 'biz-1', 'user-2', 5, 'Best coffee in Dili! Love the atmosphere and the pastries are delicious. My go-to spot for work meetings.'),
('rev-3', 'biz-1', 'user-3', 4, 'Great coffee but can get crowded on weekends. Try their cold brew!'),
('rev-4', 'biz-2', 'user-1', 4, 'Very professional team. Helped us modernize our business with a great website.'),
('rev-5', 'biz-6', 'user-2', 5, 'Best seafood in Timor! The sunset views are incredible. Live music on weekends is a bonus.'),
('rev-6', 'biz-6', 'user-3', 4, 'Great atmosphere and fresh seafood. Perfect spot for date night.'),
('rev-7', 'biz-7', 'user-1', 5, 'Beautiful authentic handicrafts. Bought a Tais table runner as a souvenir.'),
('rev-8', 'biz-7', 'user-4', 5, 'Supporting local artisans while getting unique, quality products. Highly recommend!'),
('rev-9', 'biz-9', 'user-1', 5, 'Dr. Belo is fantastic! Painless procedure and very professional clinic.'),
('rev-10', 'biz-10', 'user-2', 5, 'Excellent coffee beans. The organic variety is amazing!'),
('rev-11', 'biz-11', 'user-3', 5, 'Professional photographers with great equipment. Our wedding photos are beautiful!'),
('rev-12', 'biz-12', 'user-4', 4, 'Quality construction work. Completed our office building on time.'),
('rev-13', 'biz-13', 'user-5', 5, 'Luxury hotel with excellent service. The ocean view from our room was stunning.'),
('rev-14', 'biz-14', 'user-6', 4, 'Great gym equipment and classes. Personal trainers are very knowledgeable.'),
('rev-15', 'biz-15', 'user-7', 4, 'Good surf shop with friendly staff. Rented a board for the whole week.'),
('rev-16', 'biz-16', 'user-8', 5, 'My kids love this school! Great bilingual curriculum and caring teachers.');
