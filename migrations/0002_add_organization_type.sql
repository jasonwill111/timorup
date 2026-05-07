-- Migration: Add organization_type column and migrate data
-- 1. Add organization_type column
ALTER TABLE business_pages ADD COLUMN organization_type text;

-- 2. Migrate government entities
UPDATE business_pages
SET
  entity_type = 'nonprofit',
  organization_type = 'government'
WHERE entity_type = 'government';

-- 3. Migrate organization entities (if any exist)
UPDATE business_pages
SET
  entity_type = 'nonprofit'
WHERE entity_type = 'organization'
  AND (organization_type IS NULL OR organization_type = '');

-- 4. Verify the changes
SELECT
  entity_type,
  organization_type,
  COUNT(*) as count
FROM business_pages
GROUP BY entity_type, organization_type;
