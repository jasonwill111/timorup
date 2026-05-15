-- ========================================
-- Seed ALL Service Packages
-- Generated from src/db/seeds/service-packages.ts
-- Updated: 2026-05-15
-- ========================================

-- ========================
-- LISTING RENEWALS
-- ========================
INSERT OR REPLACE INTO service_packages (id, name, slug, type, category, description, variants, is_active, sort_order) VALUES
(
  'sp-7days',
  '7-Day Listing Renewal',
  '7-day-listing',
  'listing_renewal',
  'listing',
  'Extend your listing visibility for 7 days',
  '[{"name":"7 Days","price":5,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{"maxImages":4,"maxVideos":1},"features":["7-day listing visibility","Up to 4 images","1 video"]}]',
  1, 1
),
(
  'sp-30days',
  '30-Day Listing Renewal',
  '30-day-listing',
  'listing_renewal',
  'listing',
  'Monthly listing with better visibility',
  '[{"name":"30 Days","price":15,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{"maxImages":6,"maxVideos":1},"features":["30-day listing visibility","Up to 6 images","1 video","Basic stats"]}]',
  1, 2
),
(
  'sp-365days',
  '365-Day Listing Renewal',
  '365-day-listing',
  'listing_renewal',
  'listing',
  'Full year listing with maximum exposure',
  '[{"name":"365 Days","price":100,"currency":"USD","durationValue":365,"durationUnit":"days","limits":{"maxImages":8,"maxVideos":1},"features":["365-day listing visibility","Up to 8 images","1 video","Full stats","Priority support"]}]',
  1, 3
),

-- ========================
-- BUSINESS SUBSCRIPTIONS
-- ========================
(
  'sp-business-free',
  'Free Business Plan',
  'free',
  'subscription',
  'business',
  'Get started with basic business listing',
  '[{"name":"Free","price":0,"currency":"USD","durationValue":3,"durationUnit":"days","limits":{"skuLimit":0,"maxImages":4,"maxVideos":1,"maxBusinessImages":4,"maxBusinessVideos":1},"features":["Basic listing for 3 days","Up to 4 images","1 video","Category selection"]}]',
  1, 10
),
(
  'sp-business-starter',
  'Starter Business Plan',
  'starter-monthly',
  'subscription',
  'business',
  'For small businesses starting out',
  '[{"name":"Starter Monthly","price":19,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":10,"maxImages":5,"maxVideos":1,"maxBusinessImages":12,"maxBusinessVideos":1},"features":["Up to 10 products/services","Up to 5 images per product","12 business images","Featured in category (7 days/month)","Basic analytics"]},{"name":"Starter Annual","price":180,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":10,"maxImages":5,"maxVideos":1,"maxBusinessImages":12,"maxBusinessVideos":1},"features":["Up to 10 products/services","Up to 5 images per product","12 business images","Featured in category (7 days/month)","Basic analytics","Save 20%"]}]',
  1, 11
),
(
  'sp-business-professional',
  'Professional Business Plan',
  'professional-monthly',
  'subscription',
  'business',
  'For growing businesses with advanced features',
  '[{"name":"Professional Monthly","price":49,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":30,"maxImages":8,"maxVideos":1,"maxBusinessImages":24,"maxBusinessVideos":2},"features":["Up to 30 products/services","Up to 8 images per product","24 business images","Featured in category (15 days/month)","Homepage featured (7 days/month)","Advanced analytics","Priority support","Verified badge"]},{"name":"Professional Annual","price":440,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":30,"maxImages":8,"maxVideos":1,"maxBusinessImages":24,"maxBusinessVideos":2},"features":["Up to 30 products/services","Up to 8 images per product","24 business images","Featured in category (15 days/month)","Homepage featured (7 days/month)","Advanced analytics","Priority support","Verified badge","Save 25%"]}]',
  1, 20
),
(
  'sp-business-enterprise',
  'Enterprise Business Plan',
  'enterprise-monthly',
  'subscription',
  'business',
  'For established businesses with full features',
  '[{"name":"Enterprise Monthly","price":99,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"skuLimit":60,"maxImages":10,"maxVideos":2,"maxBusinessImages":32,"maxBusinessVideos":3},"features":["Up to 60 products/services","Up to 10 images per product","2 videos per product","32 business images","3 business videos","Featured in category (30 days/month)","Homepage featured (14 days/month)","Premium analytics","24/7 priority support","Verified badge","Custom branding"]},{"name":"Enterprise Annual","price":990,"currency":"USD","durationValue":12,"durationUnit":"months","limits":{"skuLimit":60,"maxImages":10,"maxVideos":2,"maxBusinessImages":32,"maxBusinessVideos":3},"features":["Up to 60 products/services","Up to 10 images per product","2 videos per product","32 business images","3 business videos","Featured in category (30 days/month)","Homepage featured (14 days/month)","Premium analytics","24/7 priority support","Verified badge","Custom branding","Save 20%"]}]',
  1, 30
),

-- ========================
-- FEATURED PROMOTIONS
-- ========================
(
  'sp-featured-listing',
  'Featured Listing Promotion',
  'featured-listing',
  'featured',
  'listing',
  'Boost your listing visibility with featured placement',
  '[{"name":"7 Days Featured","price":10,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Featured in category listing","Priority placement","Badge highlight"]},{"name":"30 Days Featured","price":30,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{},"features":["Featured in category listing","Priority placement","Badge highlight"]}]',
  1, 100
),
(
  'sp-homepage-featured',
  'Homepage Featured',
  'homepage-featured',
  'featured',
  'business',
  'Appear on the homepage featured section',
  '[{"name":"7 Days Homepage","price":25,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Homepage featured section","Large banner display","Priority over regular featured"]},{"name":"14 Days Homepage","price":45,"currency":"USD","durationValue":14,"durationUnit":"days","limits":{},"features":["Homepage featured section","Large banner display","Priority over regular featured"]}]',
  1, 101
),

-- ========================
-- ADDONS
-- ========================
(
  'sp-addon-extra-images',
  'Extra Images Addon',
  'extra-images',
  'addon',
  'business',
  'Purchase additional image slots for your business',
  '[{"name":"+4 Images","price":5,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"extraImages":4},"features":["Add 4 images to your business gallery","Valid for 1 month"]}]',
  1, 200
),
(
  'sp-addon-extra-videos',
  'Extra Videos Addon',
  'extra-videos',
  'addon',
  'business',
  'Purchase additional video slots for your business',
  '[{"name":"+1 Video","price":10,"currency":"USD","durationValue":1,"durationUnit":"month","limits":{"extraVideos":1},"features":["Add 1 video to your business gallery","Valid for 1 month"]}]',
  1, 201
),

-- ========================
-- AD BANNERS
-- ========================
(
  'sp-banner-homepage',
  'Homepage Banner Ad',
  'banner-homepage',
  'featured',
  'other',
  'Premium banner ad on the homepage',
  '[{"name":"7 Days Homepage","price":50,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Homepage banner position","High visibility placement","Click tracking"]},{"name":"30 Days Homepage","price":150,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{},"features":["Homepage banner position","High visibility placement","Click tracking","Save 25%"]}]',
  1, 300
),
(
  'sp-banner-category',
  'Category Page Banner Ad',
  'banner-category',
  'featured',
  'other',
  'Banner ad on business/listings category pages',
  '[{"name":"7 Days Category","price":30,"currency":"USD","durationValue":7,"durationUnit":"days","limits":{},"features":["Business or Listings category pages","Moderate visibility","Click tracking"]},{"name":"30 Days Category","price":80,"currency":"USD","durationValue":30,"durationUnit":"days","limits":{},"features":["Business or Listings category pages","Moderate visibility","Click tracking","Save 20%"]}]',
  1, 301
);
