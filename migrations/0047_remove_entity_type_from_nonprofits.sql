-- Remove entity_type from non_profits table
-- Updated: 2026-05-15

-- Remove the column (nonprofits only have 'nonprofit' value)
ALTER TABLE non_profits DROP COLUMN entity_type;
