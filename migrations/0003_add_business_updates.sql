-- Business Updates (News) table
CREATE TABLE IF NOT EXISTS business_updates (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  posted_date TEXT
);

CREATE INDEX IF NOT EXISTS updates_business_idx ON business_updates(business_id);
CREATE INDEX IF NOT EXISTS updates_created_idx ON business_updates(created_at DESC);
