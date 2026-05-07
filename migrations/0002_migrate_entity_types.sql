-- Migration: Update entityType from 'government'/'organization' to 'nonprofit'
-- and move organization type to organizationType field

-- Step 1: Update government entities
UPDATE business_pages
SET
  entityType = 'nonprofit',
  organizationType = 'government'
WHERE entityType = 'government';

-- Step 2: Update organization entities (if any exist)
UPDATE business_pages
SET
  entityType = 'nonprofit'
WHERE entityType = 'organization'
  AND (organizationType IS NULL OR organizationType = '');

-- Verify the changes
SELECT
  entityType,
  organizationType,
  COUNT(*) as count
FROM business_pages
GROUP BY entityType, organizationType;
