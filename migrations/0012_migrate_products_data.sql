-- Migration: Add new product columns + migrate data
-- Date: 2026-05-14
-- Add: business_id, category_id, product_type, images
-- Migrate: business_page_id → business_id, service_type → product_type, price/price_unit → priceFields

-- 1. Add new columns if not exist
ALTER TABLE products ADD COLUMN business_id TEXT;
ALTER TABLE products ADD COLUMN category_id TEXT;
ALTER TABLE products ADD COLUMN product_type TEXT DEFAULT 'product';
ALTER TABLE products ADD COLUMN images TEXT;

-- 2. Copy data from old columns
UPDATE products SET business_id = business_page_id WHERE business_id IS NULL;
UPDATE products SET product_type = service_type WHERE product_type IS NULL;

-- 3. Create priceFields from price + price_unit
UPDATE products SET price_fields = '{"price":"' || COALESCE(price, '') || '","unit":"' || COALESCE(price_unit, '') || '"}' WHERE price_fields IS NULL;

-- 4. Add index
CREATE INDEX IF NOT EXISTS products_business_idx ON products(business_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_active_idx ON products(active);