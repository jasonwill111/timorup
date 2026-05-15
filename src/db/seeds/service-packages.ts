/**
 * Service Packages Seed Data
 * TimorLIST - Plans/Packages for Businesses
 *
 * Schema (2026-05-14):
 * - type: 'subscription' | 'listing_renewal' | 'featured' | 'addon'
 * - category: 'business' | 'listing' | 'other'
 * - variants: JSON array with [{ name, price, currency, durationValue, durationUnit, limits, features }]
 */

export const servicePackages = [
  // ========================
  // LISTING RENEWALS
  // ========================
  {
    id: 'sp-7days',
    type: 'listing_renewal',
    category: 'listing',
    name: '7-Day Listing Renewal',
    slug: '7-day-listing',
    description: 'Extend your listing visibility for 7 days',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 5,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: {
          maxImages: 4,
          maxVideos: 1
        },
        features: ['7-day listing visibility', 'Up to 4 images', '1 video']
      }
    ]),
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'sp-30days',
    type: 'listing_renewal',
    category: 'listing',
    name: '30-Day Listing Renewal',
    slug: '30-day-listing',
    description: 'Monthly listing with better visibility',
    variants: JSON.stringify([
      {
        name: '30 Days',
        price: 15,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: {
          maxImages: 6,
          maxVideos: 1
        },
        features: ['30-day listing visibility', 'Up to 6 images', '1 video', 'Basic stats']
      }
    ]),
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'sp-365days',
    type: 'listing_renewal',
    category: 'listing',
    name: '365-Day Listing Renewal',
    slug: '365-day-listing',
    description: 'Full year listing with maximum exposure',
    variants: JSON.stringify([
      {
        name: '365 Days',
        price: 100,
        currency: 'USD',
        durationValue: 365,
        durationUnit: 'days',
        limits: {
          maxImages: 8,
          maxVideos: 1
        },
        features: ['365-day listing visibility', 'Up to 8 images', '1 video', 'Full stats', 'Priority support']
      }
    ]),
    isActive: true,
    sortOrder: 3
  },

  // ========================
  // BUSINESS SUBSCRIPTIONS
  // ========================
  {
    id: 'sp-business-free',
    type: 'subscription',
    category: 'business',
    name: 'Free Business Plan',
    slug: 'free',
    description: 'Get started with basic business listing',
    variants: JSON.stringify([
      {
        name: 'Free',
        price: 0,
        currency: 'USD',
        durationValue: 3,
        durationUnit: 'days',
        limits: {
          skuLimit: 0,
          maxImages: 4,
          maxVideos: 1,
          maxBusinessImages: 4,
          maxBusinessVideos: 1
        },
        features: ['Basic listing for 3 days', 'Up to 4 images', '1 video', 'Category selection']
      }
    ]),
    isActive: true,
    sortOrder: 10
  },
  {
    id: 'sp-business-starter',
    type: 'subscription',
    category: 'business',
    name: 'Starter Business Plan',
    slug: 'starter-monthly',
    description: 'For small businesses starting out',
    variants: JSON.stringify([
      {
        name: 'Starter Monthly',
        price: 19,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: {
          skuLimit: 10,
          maxImages: 5,
          maxVideos: 1,
          maxBusinessImages: 12,
          maxBusinessVideos: 1
        },
        features: ['Up to 10 products/services', 'Up to 5 images per product', '12 business images', 'Featured in category (7 days/month)', 'Basic analytics']
      },
      {
        name: 'Starter Annual',
        price: 180,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        limits: {
          skuLimit: 10,
          maxImages: 5,
          maxVideos: 1,
          maxBusinessImages: 12,
          maxBusinessVideos: 1
        },
        features: ['Up to 10 products/services', 'Up to 5 images per product', '12 business images', 'Featured in category (7 days/month)', 'Basic analytics', 'Save 20%']
      }
    ]),
    isActive: true,
    sortOrder: 11
  },
  {
    id: 'sp-business-professional',
    type: 'subscription',
    category: 'business',
    name: 'Professional Business Plan',
    slug: 'professional-monthly',
    description: 'For growing businesses with advanced features',
    variants: JSON.stringify([
      {
        name: 'Professional Monthly',
        price: 49,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: {
          skuLimit: 30,
          maxImages: 8,
          maxVideos: 1,
          maxBusinessImages: 24,
          maxBusinessVideos: 2
        },
        features: ['Up to 30 products/services', 'Up to 8 images per product', '24 business images', 'Featured in category (15 days/month)', 'Homepage featured (7 days/month)', 'Advanced analytics', 'Priority support', 'Verified badge']
      },
      {
        name: 'Professional Annual',
        price: 440,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        limits: {
          skuLimit: 30,
          maxImages: 8,
          maxVideos: 1,
          maxBusinessImages: 24,
          maxBusinessVideos: 2
        },
        features: ['Up to 30 products/services', 'Up to 8 images per product', '24 business images', 'Featured in category (15 days/month)', 'Homepage featured (7 days/month)', 'Advanced analytics', 'Priority support', 'Verified badge', 'Save 25%']
      }
    ]),
    isActive: true,
    sortOrder: 20
  },
  {
    id: 'sp-business-enterprise',
    type: 'subscription',
    category: 'business',
    name: 'Enterprise Business Plan',
    slug: 'enterprise-monthly',
    description: 'For established businesses with full features',
    variants: JSON.stringify([
      {
        name: 'Enterprise Monthly',
        price: 99,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: {
          skuLimit: 60,
          maxImages: 10,
          maxVideos: 2,
          maxBusinessImages: 32,
          maxBusinessVideos: 3
        },
        features: ['Up to 60 products/services', 'Up to 10 images per product', '2 videos per product', '32 business images', '3 business videos', 'Featured in category (30 days/month)', 'Homepage featured (14 days/month)', 'Premium analytics', '24/7 priority support', 'Verified badge', 'Custom branding']
      },
      {
        name: 'Enterprise Annual',
        price: 990,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        limits: {
          skuLimit: 60,
          maxImages: 10,
          maxVideos: 2,
          maxBusinessImages: 32,
          maxBusinessVideos: 3
        },
        features: ['Up to 60 products/services', 'Up to 10 images per product', '2 videos per product', '32 business images', '3 business videos', 'Featured in category (30 days/month)', 'Homepage featured (14 days/month)', 'Premium analytics', '24/7 priority support', 'Verified badge', 'Custom branding', 'Save 20%']
      }
    ]),
    isActive: true,
    sortOrder: 30
  },

  // ========================
  // FEATURED PROMOTIONS
  // ========================
  {
    id: 'sp-featured-listing',
    type: 'featured',
    category: 'listing',
    name: 'Featured Listing Promotion',
    slug: 'featured-listing',
    description: 'Boost your listing visibility with featured placement',
    variants: JSON.stringify([
      {
        name: '7 Days Featured',
        price: 10,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: {},
        features: ['Featured in category listing', 'Priority placement', 'Badge highlight']
      },
      {
        name: '30 Days Featured',
        price: 30,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: {},
        features: ['Featured in category listing', 'Priority placement', 'Badge highlight']
      }
    ]),
    isActive: true,
    sortOrder: 100
  },
  {
    id: 'sp-homepage-featured',
    type: 'featured',
    category: 'business',
    name: 'Homepage Featured',
    slug: 'homepage-featured',
    description: 'Appear on the homepage featured section',
    variants: JSON.stringify([
      {
        name: '7 Days Homepage',
        price: 25,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: {},
        features: ['Homepage featured section', 'Large banner display', 'Priority over regular featured']
      },
      {
        name: '14 Days Homepage',
        price: 45,
        currency: 'USD',
        durationValue: 14,
        durationUnit: 'days',
        limits: {},
        features: ['Homepage featured section', 'Large banner display', 'Priority over regular featured']
      }
    ]),
    isActive: true,
    sortOrder: 101
  },

  // ========================
  // ADDONS
  // ========================
  {
    id: 'sp-addon-extra-images',
    type: 'addon',
    category: 'business',
    name: 'Extra Images Addon',
    slug: 'extra-images',
    description: 'Purchase additional image slots for your business',
    variants: JSON.stringify([
      {
        name: '+4 Images',
        price: 5,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: {
          extraImages: 4
        },
        features: ['Add 4 images to your business gallery', 'Valid for 1 month']
      }
    ]),
    isActive: true,
    sortOrder: 200
  },
  {
    id: 'sp-addon-extra-videos',
    type: 'addon',
    category: 'business',
    name: 'Extra Videos Addon',
    slug: 'extra-videos',
    description: 'Purchase additional video slots for your business',
    variants: JSON.stringify([
      {
        name: '+1 Video',
        price: 10,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: {
          extraVideos: 1
        },
        features: ['Add 1 video to your business gallery', 'Valid for 1 month']
      }
    ]),
    isActive: true,
    sortOrder: 201
  },

  // ========================
  // AD BANNERS (Position: homepage | businesses | products-services | listings)
  // ========================
  {
    id: 'sp-banner-homepage',
    type: 'featured',
    category: 'other',
    name: 'Homepage Banner Ad',
    slug: 'banner-homepage',
    description: 'Premium banner ad on the homepage',
    variants: JSON.stringify([
      {
        name: '7 Days Homepage',
        price: 50,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: {},
        features: ['Homepage banner position', 'High visibility placement', 'Click tracking']
      },
      {
        name: '30 Days Homepage',
        price: 150,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: {},
        features: ['Homepage banner position', 'High visibility placement', 'Click tracking', 'Save 25%']
      }
    ]),
    isActive: true,
    sortOrder: 300
  },
  {
    id: 'sp-banner-category',
    type: 'featured',
    category: 'other',
    name: 'Category Page Banner Ad',
    slug: 'banner-category',
    description: 'Banner ad on business/listings category pages',
    variants: JSON.stringify([
      {
        name: '7 Days Category',
        price: 30,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: {},
        features: ['Business or Listings category pages', 'Moderate visibility', 'Click tracking']
      },
      {
        name: '30 Days Category',
        price: 80,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: {},
        features: ['Business or Listings category pages', 'Moderate visibility', 'Click tracking', 'Save 20%']
      }
    ]),
    isActive: true,
    sortOrder: 301
  }
];

// SQL generator for seeding
export const insertServicePackagesSQL = servicePackages.map(pkg => `
  INSERT OR REPLACE INTO service_packages (id, name, slug, type, category, description, variants, is_active, sort_order, created_at, updated_at)
  VALUES (
    '${pkg.id}',
    '${pkg.name.replace(/'/g, "''")}',
    '${pkg.slug}',
    '${pkg.type}',
    '${pkg.category}',
    '${pkg.description.replace(/'/g, "''")}',
    '${pkg.variants.replace(/'/g, "''")}',
    ${pkg.isActive ? 1 : 0},
    ${pkg.sortOrder},
    ${Date.now()},
    ${Date.now()}
  );
`).join('\n');

export default servicePackages;