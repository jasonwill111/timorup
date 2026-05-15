-- Remove entity_type from businesses table
-- Updated: 2026-05-15

-- Update existing data: set null/incorrect values to 'business'
UPDATE businesses SET entity_type = 'business' WHERE entity_type IS NULL OR entity_type NOT IN ('business');

-- Remove the column
ALTER TABLE businesses DROP COLUMN entity_type;
