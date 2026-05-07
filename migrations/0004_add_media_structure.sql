-- Migration: Add media structure and deduplication
-- Adds fields for structured R2 storage and SHA256 deduplication

-- Add new columns to media table
ALTER TABLE media ADD COLUMN hash TEXT;
ALTER TABLE media ADD COLUMN entity_type TEXT;
ALTER TABLE media ADD COLUMN entity_id TEXT;
ALTER TABLE media ADD COLUMN category TEXT;
ALTER TABLE media ADD COLUMN r2_key TEXT;

-- Create unique index for hash deduplication
CREATE UNIQUE INDEX IF NOT EXISTS media_hash_idx ON media(hash) WHERE hash IS NOT NULL;

-- Create composite index for entity queries
CREATE INDEX IF NOT EXISTS media_entity_idx ON media(entity_type, entity_id) WHERE entity_type IS NOT NULL;
