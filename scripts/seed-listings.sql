-- Seed data for Listings (classified ads)
-- Run: npx wrangler d1 execute timorup-db --local --file=scripts/seed-listings.sql

-- ============================================================================
-- LISTINGS - Classified Ads
-- ============================================================================

-- Jobs (listingType = 'job') - category: lc-004 (Jobs)
INSERT OR IGNORE INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, condition, location, contact_name, contact_number, email, tags, likes, saves, views, created_at, expires_at) VALUES
('job-001', 'Restaurant Manager Wanted', 'restaurant-manager-wanted', 'user-1', 'lc-004', 'job', 'live', 'Looking for an experienced restaurant manager to join our team. Must have 3+ years experience in hospitality management.', '$800-1200/month', NULL, 'Dili', 'Maria Santos', '+670 77001234', 'jobs@timorup.com', '["restaurant","manager","hospitality"]', 15, 8, 120, 1778077474, 1778335474),
('job-002', 'English Teacher Required', 'english-teacher-required', 'user-2', 'lc-004', 'job', 'live', 'International school seeks qualified English teacher. BA in Education required.', '$1500-2000/month', NULL, 'Dili', 'John Smith', '+670 77005678', 'jobs@school.tl', '["english","teacher","education"]', 23, 12, 200, 1778077475, 1778335475),
('job-003', 'Software Developer', 'software-developer-timor', 'user-3', 'lc-004', 'job', 'live', 'Tech company seeking full-stack developer. React/Node experience preferred.', '$1500-2500/month', NULL, 'Dili', 'Carlos Oliveira', '+670 77009999', 'careers@tech.tl', '["developer","software","tech"]', 45, 20, 350, 1778077476, 1778335476);

-- Products (listingType = 'product')
-- category: lc-001-1 (Electronics), lc-001-2 (Furniture), lc-002 (Vehicles)
INSERT OR IGNORE INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, condition, location, contact_name, contact_number, email, tags, likes, saves, views, created_at, expires_at) VALUES
('prod-001', 'iPhone 14 Pro Max', 'iphone-14-pro-max-sale', 'user-1', 'lc-001-1', 'product', 'live', 'Like new iPhone 14 Pro Max 256GB. Includes original box and charger. Battery health 95%.', '$850', 'like-new', 'Dili', 'Ana Pereira', '+670 77005555', 'ana@email.tl', '["iphone","apple","phone"]', 30, 25, 500, 1778077477, 1778335477),
('prod-002', 'Toyota Hilux 2019', 'toyota-hilux-2019', 'user-2', 'lc-002', 'product', 'live', 'Well maintained Toyota Hilux. 4x4, low mileage 45,000km. Full service history.', '$25000', 'good', 'Dili', 'Jose Fatima', '+670 77003333', 'jose@email.tl', '["toyota","hilux","vehicle","4x4"]', 50, 35, 800, 1778077478, 1778335478),
('prod-003', 'Office Desk and Chair Set', 'office-desk-chair-set', 'user-3', 'lc-001-2', 'product', 'live', 'Ergonomic office desk with adjustable chair. Used for 6 months. Perfect condition.', '$350', 'like-new', 'Dili', 'Luis Costa', '+670 77004444', 'luis@email.tl', '["furniture","office","desk"]', 10, 15, 200, 1778077479, 1778335479),
('prod-004', 'MacBook Pro 2021', 'macbook-pro-2021-sale', 'user-1', 'lc-001-1', 'product', 'live', 'MacBook Pro 14 inch M1 Pro. 16GB RAM, 512GB SSD. Apple Care until 2025.', '$1800', 'good', 'Dili', 'Maria Reis', '+670 77006666', 'maria@email.tl', '["macbook","apple","laptop"]', 40, 30, 600, 1778077480, 1778335480);

-- Services (listingType = 'service') - category: lc-005 (Services)
INSERT OR IGNORE INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, condition, location, contact_name, contact_number, email, tags, likes, saves, views, created_at, expires_at) VALUES
('svc-001', 'Professional Photography', 'professional-photography-dili', 'user-2', 'lc-005', 'service', 'live', 'Wedding, event, and portrait photography services. Experienced photographer with professional equipment.', '$200-500/session', NULL, 'Dili', 'Rosa Santos', '+670 77007777', 'rosa@photo.tl', '["photography","wedding","event"]', 25, 18, 300, 1778077481, 1778335481),
('svc-002', 'Home Cleaning Service', 'home-cleaning-service', 'user-3', 'lc-005', 'service', 'live', 'Professional home cleaning service. Weekly, bi-weekly, or monthly options available.', '$50-100/session', NULL, 'Dili', 'Fernanda Lima', '+670 77008888', 'clean@service.tl', '["cleaning","home","service"]', 15, 22, 250, 1778077482, 1778335482);

-- Property (listingType = 'property') - category: lc-003-1 (Apartments), lc-003-2 (Houses)
INSERT OR IGNORE INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, condition, location, contact_name, contact_number, email, tags, likes, saves, views, created_at, expires_at) VALUES
('prop-001', 'Apartment for Rent', 'apartment-for-rent-dili', 'user-1', 'lc-003-1', 'property', 'live', '2 bedroom apartment near beach. Fully furnished, AC in all rooms, parking included.', '$600/month', NULL, 'Dili, Beach Area', 'Pedro Almeida', '+670 77009900', 'rentals@timor.tl', '["apartment","rent","furnished"]', 35, 28, 450, 1778077483, 1778335483),
('prop-002', 'House for Sale', 'house-for-sale-comoro', 'user-2', 'lc-003-2', 'property', 'live', '3 bedroom house in Comoro. Land area 500m2, building 200m2. Good condition.', '$85000', NULL, 'Comoro, Dili', 'Antonio Soares', '+670 77009911', 'realty@timor.tl', '["house","sale","comoro","property"]', 42, 35, 550, 1778077484, 1778335484);

-- Vehicles (listingType = 'vehicle') - category: lc-002 (Vehicles)
INSERT OR IGNORE INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, condition, location, contact_name, contact_number, email, tags, likes, saves, views, created_at, expires_at) VALUES
('veh-001', 'Honda Scoopy 2020', 'honda-scoopy-2020', 'user-3', 'lc-002', 'vehicle', 'live', 'Low mileage motorbike. Great for city riding. New tires, full service just done.', '$2500', 'good', 'Dili', 'Rui Fernandes', '+670 77009922', 'rui@email.tl', '["honda","scoopy","motorbike"]', 20, 15, 280, 1778077485, 1778335485);

-- Wanted (listingType = 'wanted') - category: lc-006 (Community)
INSERT OR IGNORE INTO listings (id, title, slug, owner_id, category_id, listing_type, status, description, price, condition, location, contact_name, contact_number, email, tags, likes, saves, views, created_at, expires_at) VALUES
('want-001', 'Room Wanted in Dili', 'room-wanted-dili', 'user-1', 'lc-006', 'wanted', 'live', 'Professional expat looking for a room to rent. Budget $300-500. Clean and quiet.', '$400/month', NULL, 'Dili', 'Sarah Miller', '+670 77009933', 'sarah@email.tl', '["room","rent","wanted","flatmate"]', 12, 8, 180, 1778077486, 1778335486);

-- Verify counts
SELECT listing_type, COUNT(*) as cnt FROM listings GROUP BY listing_type;
