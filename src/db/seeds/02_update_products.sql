-- ========================================
-- PRODUCTS - Update with full data
-- ========================================

-- Products for biz-1 (Café Timor)
UPDATE products SET 
  price_fields = '{"price":"3.50","unit":"cup"}',
  price = '3.50',
  price_unit = 'cup',
  service_type = 'product',
  featured = 1
WHERE id = 'prod-1';

UPDATE products SET 
  title = 'Espresso Shot',
  description = 'Rich double shot espresso made from premium Timor beans',
  price_fields = '{"price":"2.00","unit":"cup"}',
  price = '2.00',
  price_unit = 'cup',
  service_type = 'product'
WHERE id = 'prod-2';

-- Add more products for biz-1
INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-cafe-1', 'Latte', 'Creamy latte with Timor coffee', 'biz-1', 'biz-1', '{"price":"4.00","unit":"cup"}', '4.00', 'cup', 'product', 1778427500, 1778427500, 1, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-cafe-2', 'Timor Blend Cold Brew', 'Refreshing cold brew coffee, perfect for hot days', 'biz-1', 'biz-1', '{"price":"4.50","unit":"bottle"}', '4.50', 'bottle', 'product', 1778427500, 1778427500, 1, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-cafe-3', 'Breakfast Combo', 'Coffee + Toast + Eggs', 'biz-1', 'biz-1', '{"price":"8.00","unit":"set"}', '8.00', 'set', 'product', 1778427500, 1778427500, 0, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-cafe-4', 'Timor Coffee Beans (500g)', 'Premium roasted beans for home brewing', 'biz-1', 'biz-1', '{"price":"15.00","unit":"pack"}', '15.00', 'pack', 'product', 1778427500, 1778427500, 0, 1);

-- Products for biz-2 (Hotel Timor)
INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-hotel-1', 'Standard Room', 'Comfortable room with AC and WiFi', 'biz-2', 'biz-2', '{"price":"45","unit":"night"}', '45', 'night', 'accommodation', 1778427500, 1778427500, 1, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-hotel-2', 'Deluxe Suite', 'Ocean view suite with breakfast included', 'biz-2', 'biz-2', '{"price":"85","unit":"night"}', '85', 'night', 'accommodation', 1778427500, 1778427500, 1, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-hotel-3', 'Presidential Suite', 'Luxury suite with panoramic ocean views', 'biz-2', 'biz-2', '{"price":"150","unit":"night"}', '150', 'night', 'accommodation', 1778427500, 1778427500, 0, 1);

-- Products for biz-3 (Timor Tech Solutions)
INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-tech-1', 'Website Development', 'Custom responsive website design and development', 'biz-3', 'biz-3', '{"price":"500","unit":"project"}', '500', 'project', 'service', 1778427400, 1778427400, 1, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-tech-2', 'IT Consulting', 'Hourly IT consulting and support', 'biz-3', 'biz-3', '{"price":"50","unit":"hour"}', '50', 'hour', 'service', 1778427400, 1778427400, 0, 1);

INSERT OR REPLACE INTO products (id, title, description, business_page_id, business_id, price_fields, price, price_unit, service_type, created_at, updated_at, featured, active)
VALUES ('prod-tech-3', 'Cloud Hosting (Monthly)', 'Reliable cloud hosting for your business', 'biz-3', 'biz-3', '{"price":"30","unit":"month"}', '30', 'month', 'service', 1778427400, 1778427400, 0, 1);

