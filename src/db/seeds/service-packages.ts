/**
 * Service Packages Seed Data
 * TimorUp - Plans/Packages
 *
 * Schema:
 * - service_type: 'subscription' | 'listing_renewal' | 'ad_banner'
 * - service_relation_to: 'business' | 'listing' | 'business_product' | 'homepage'
 *
 * Ad Banners by position:
 * - homepage: 链接到 business | listing | business_product
 * - businesses/listings/products-services: 只能链接到各自类型
 */

export const servicePackages = [
  // ========================
  // BUSINESS PAGE PLANS (订阅制)
  // ========================
  {
    id: 'sp-business-basic',
    service_type: 'subscription',
    service_relation_to: 'business',
    name: 'Basic Business Plan',
    slug: 'basic-monthly',
    description: 'For small businesses starting out',
    variants: JSON.stringify([
      {
        name: 'Basic Monthly',
        price: 39,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: { skuLimit: 10 },
        features: ['Up to 10 products/services', 'Business profile', 'Reviews & ratings']
      },
      {
        name: 'Basic Annual',
        price: 390,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        limits: { skuLimit: 10 },
        features: ['Up to 10 products/services', 'Business profile', 'Reviews & ratings', 'Save 17%']
      }
    ]),
    isActive: 1,
    sortOrder: 10
  },
  {
    id: 'sp-business-pro',
    service_type: 'subscription',
    service_relation_to: 'business',
    name: 'Pro Business Plan',
    slug: 'pro-monthly',
    description: 'For growing businesses',
    variants: JSON.stringify([
      {
        name: 'Pro Monthly',
        price: 69,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: { skuLimit: 30 },
        features: ['Up to 30 products/services', 'Featured placement', 'Analytics dashboard']
      },
      {
        name: 'Pro Annual',
        price: 690,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        limits: { skuLimit: 30 },
        features: ['Up to 30 products/services', 'Featured placement', 'Analytics dashboard', 'Save 17%']
      }
    ]),
    isActive: 1,
    sortOrder: 20
  },
  {
    id: 'sp-business-max',
    service_type: 'subscription',
    service_relation_to: 'business',
    name: 'Max Business Plan',
    slug: 'max-monthly',
    description: 'For established businesses',
    variants: JSON.stringify([
      {
        name: 'Max Monthly',
        price: 99,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        limits: { skuLimit: 60 },
        features: ['Up to 60 products/services', 'Top placement', 'Full analytics', 'Priority support']
      },
      {
        name: 'Max Annual',
        price: 990,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        limits: { skuLimit: 60 },
        features: ['Up to 60 products/services', 'Top placement', 'Full analytics', 'Priority support', 'Save 17%']
      }
    ]),
    isActive: 1,
    sortOrder: 30
  },

  // ========================
  // LISTING PLANS (续费制)
  // ========================
  {
    id: 'sp-listing-7days',
    service_type: 'listing_renewal',
    service_relation_to: 'listing',
    name: '7-Day Listing Renewal',
    slug: '7-day-listing',
    description: '7 days listing visibility',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 8,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { maxImages: 4, maxVideos: 1 },
        features: ['7-day visibility', 'Up to 4 images', '1 video']
      }
    ]),
    isActive: 1,
    sortOrder: 100
  },
  {
    id: 'sp-listing-30days',
    service_type: 'listing_renewal',
    service_relation_to: 'listing',
    name: '30-Day Listing Renewal',
    slug: '30-day-listing',
    description: '30 days listing visibility',
    variants: JSON.stringify([
      {
        name: '30 Days',
        price: 15,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { maxImages: 6, maxVideos: 1 },
        features: ['30-day visibility', 'Up to 6 images', '1 video', 'Basic stats']
      }
    ]),
    isActive: 1,
    sortOrder: 110
  },
  {
    id: 'sp-listing-365days',
    service_type: 'listing_renewal',
    service_relation_to: 'listing',
    name: '365-Day Listing Renewal',
    slug: '365-day-listing',
    description: 'Full year listing visibility',
    variants: JSON.stringify([
      {
        name: '365 Days',
        price: 120,
        currency: 'USD',
        durationValue: 365,
        durationUnit: 'days',
        limits: { maxImages: 8, maxVideos: 1 },
        features: ['365-day visibility', 'Up to 8 images', '1 video', 'Full stats', 'Priority support']
      }
    ]),
    isActive: 1,
    sortOrder: 120
  },

  // ========================
  // AD BANNERS
  // Position: homepage | businesses | listings | products-services
  // Link target: business | listing | business_product
  // ========================

  // Homepage Banner - 可链接到任意类型
  {
    id: 'sp-banner-homepage-business',
    service_type: 'ad_banner',
    service_relation_to: 'homepage',
    name: 'Homepage Banner (Business)',
    slug: 'banner-homepage-business',
    description: 'Banner on homepage linking to a business',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 50,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { linkTarget: 'business' },
        features: ['Homepage banner', 'Link to business page', 'High visibility']
      },
      {
        name: '30 Days',
        price: 150,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { linkTarget: 'business' },
        features: ['Homepage banner', 'Link to business page', 'Save 25%']
      }
    ]),
    isActive: 1,
    sortOrder: 200
  },
  {
    id: 'sp-banner-homepage-listing',
    service_type: 'ad_banner',
    service_relation_to: 'homepage',
    name: 'Homepage Banner (Listing)',
    slug: 'banner-homepage-listing',
    description: 'Banner on homepage linking to a listing',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 50,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { linkTarget: 'listing' },
        features: ['Homepage banner', 'Link to listing', 'High visibility']
      },
      {
        name: '30 Days',
        price: 150,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { linkTarget: 'listing' },
        features: ['Homepage banner', 'Link to listing', 'Save 25%']
      }
    ]),
    isActive: 1,
    sortOrder: 201
  },
  {
    id: 'sp-banner-homepage-product',
    service_type: 'ad_banner',
    service_relation_to: 'homepage',
    name: 'Homepage Banner (Product)',
    slug: 'banner-homepage-product',
    description: 'Banner on homepage linking to a product',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 50,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { linkTarget: 'business_product' },
        features: ['Homepage banner', 'Link to product', 'High visibility']
      },
      {
        name: '30 Days',
        price: 150,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { linkTarget: 'business_product' },
        features: ['Homepage banner', 'Link to product', 'Save 25%']
      }
    ]),
    isActive: 1,
    sortOrder: 202
  },

  // Businesses 列表页 Banner - 只链接到 business
  {
    id: 'sp-banner-businesses',
    service_type: 'ad_banner',
    service_relation_to: 'business',
    name: 'Businesses Page Banner',
    slug: 'banner-businesses',
    description: 'Banner on businesses listing page',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 30,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { linkTarget: 'business' },
        features: ['Businesses page banner', 'Link to business', 'Moderate visibility']
      },
      {
        name: '30 Days',
        price: 80,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { linkTarget: 'business' },
        features: ['Businesses page banner', 'Link to business', 'Save 20%']
      }
    ]),
    isActive: 1,
    sortOrder: 210
  },

  // Listings 列表页 Banner - 只链接到 listing
  {
    id: 'sp-banner-listings',
    service_type: 'ad_banner',
    service_relation_to: 'listing',
    name: 'Listings Page Banner',
    slug: 'banner-listings',
    description: 'Banner on listings listing page',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 30,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { linkTarget: 'listing' },
        features: ['Listings page banner', 'Link to listing', 'Moderate visibility']
      },
      {
        name: '30 Days',
        price: 80,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { linkTarget: 'listing' },
        features: ['Listings page banner', 'Link to listing', 'Save 20%']
      }
    ]),
    isActive: 1,
    sortOrder: 220
  },

  // Products/Services 页 Banner - 只链接到 business_product
  {
    id: 'sp-banner-products',
    service_type: 'ad_banner',
    service_relation_to: 'business_product',
    name: 'Products Page Banner',
    slug: 'banner-products',
    description: 'Banner on products/services page',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 30,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        limits: { linkTarget: 'business_product' },
        features: ['Products page banner', 'Link to product', 'Moderate visibility']
      },
      {
        name: '30 Days',
        price: 80,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        limits: { linkTarget: 'business_product' },
        features: ['Products page banner', 'Link to product', 'Save 20%']
      }
    ]),
    isActive: 1,
    sortOrder: 230
  }
];

// SQL generator for seeding
export const insertServicePackagesSQL = servicePackages.map(pkg => `
  INSERT OR REPLACE INTO service_packages (id, name, slug, service_type, service_relation_to, description, variants, is_active, sort_order, created_at, updated_at)
  VALUES (
    '${pkg.id}',
    '${pkg.name.replace(/'/g, "''")}',
    '${pkg.slug}',
    '${pkg.service_type}',
    '${pkg.service_relation_to}',
    '${pkg.description?.replace(/'/g, "''") ?? ''}',
    '${pkg.variants.replace(/'/g, "''")}',
    ${pkg.isActive ? 1 : 0},
    ${pkg.sortOrder},
    ${Date.now()},
    ${Date.now()}
  );
`).join('\n');

export default servicePackages;