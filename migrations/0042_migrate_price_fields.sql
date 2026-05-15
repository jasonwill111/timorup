-- Migration: Migrate price_fields from old format to new format
-- Old: {"price":"3.50","unit":"cup"}
-- New: [{"label":"","value":"3.50","unit":"cup"}]

-- This is a reference file - actual migration done via wrangler commands

-- For wrangler d1 execute, we need to manually update each row:
-- 1. Get all products
-- 2. Parse old format
-- 3. Convert to new format
-- 4. Update

-- Example of what the new format should look like:
-- UPDATE products SET price_fields = '[{"label":"","value":"3.50","unit":"cup"}]' WHERE id = 'prod-1';
