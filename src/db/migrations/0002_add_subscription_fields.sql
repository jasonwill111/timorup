-- Add subscription status fields to business_pages
ALTER TABLE business_pages ADD COLUMN subscription_status TEXT DEFAULT 'none';
ALTER TABLE business_pages ADD COLUMN grace_period_end_date INTEGER;
