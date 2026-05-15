-- Seed service_packages for business subscription plans
-- Updated: 2026-05-15

INSERT OR REPLACE INTO service_packages (id, name, slug, type, category, description, variants, is_active, sort_order) VALUES
(
  'sp-basic-monthly',
  'Basic Monthly',
  'basic-monthly',
  'subscription',
  'business',
  'Essential features for small businesses',
  '[{"name":"Basic Monthly","price":29,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":10,"maxImages":5,"maxVideos":1,"maxBusinessImages":12,"maxBusinessVideos":1},"features":["Up to 10 products/services","Up to 5 images per product","12 business images","Featured in category (7 days/month)","Basic analytics"]},{"name":"Basic Annual","price":180,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":10,"maxImages":5,"maxVideos":1,"maxBusinessImages":12,"maxBusinessVideos":1},"features":["Up to 10 products/services","Up to 5 images per product","12 business images","Featured in category (7 days/month)","Basic analytics","Save 20%"]}]',
  true,
  10
),
(
  'sp-professional-monthly',
  'Professional Monthly',
  'professional-monthly',
  'subscription',
  'business',
  'For growing businesses with advanced features',
  '[{"name":"Professional Monthly","price":49,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":30,"maxImages":8,"maxVideos":1,"maxBusinessImages":24,"maxBusinessVideos":2},"features":["Up to 30 products/services","Up to 8 images per product","24 business images","Featured in category (15 days/month)","Homepage featured (7 days/month)","Advanced analytics","Priority support","Verified badge"]},{"name":"Professional Annual","price":440,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":30,"maxImages":8,"maxVideos":1,"maxBusinessImages":24,"maxBusinessVideos":2},"features":["Up to 30 products/services","Up to 8 images per product","24 business images","Featured in category (15 days/month)","Homepage featured (7 days/month)","Advanced analytics","Priority support","Verified badge","Save 20%"]}]',
  true,
  20
),
(
  'sp-max-monthly',
  'Max Monthly',
  'max-monthly',
  'subscription',
  'business',
  'Ultimate features for enterprise businesses',
  '[{"name":"Max Monthly","price":99,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":60,"maxImages":10,"maxVideos":2,"maxBusinessImages":60,"maxBusinessVideos":4},"features":["Up to 60 products/services","Up to 10 images per product","60 business images","Featured in category (30 days/month)","Homepage featured (15 days/month)","Advanced analytics","Priority support","Verified badge","Custom branding"]},{"name":"Max Annual","price":900,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":60,"maxImages":10,"maxVideos":2,"maxBusinessImages":60,"maxBusinessVideos":4},"features":["Up to 60 products/services","Up to 10 images per product","60 business images","Featured in category (30 days/month)","Homepage featured (15 days/month)","Advanced analytics","Priority support","Verified badge","Custom branding","Save 20%"]}]',
  true,
  30
);
