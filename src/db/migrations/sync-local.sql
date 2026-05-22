-- Sync local D1 schema - 最小化操作
-- TimorUp 2026-05-21

-- Media: 添加 entity 列
ALTER TABLE media ADD COLUMN entity_type TEXT;
ALTER TABLE media ADD COLUMN entity_id TEXT;
ALTER TABLE media ADD COLUMN purpose TEXT;

-- 添加索引
CREATE UNIQUE INDEX IF NOT EXISTS media_entity_purpose_idx ON media(entity_type, entity_id, purpose);
CREATE INDEX IF NOT EXISTS reviews_replied_by_idx ON reviews(replied_by);