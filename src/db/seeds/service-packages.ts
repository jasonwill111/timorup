/**
 * Service Packages Seed Data
 * TimorUp (2026-05-21)
 *
 * Schema: type = 'business_page' | 'listing_renewal' | 'featured' | 'ad_banner'
 * Variants: [{ name, price, currency, durationValue, durationUnit, features }]
 *
 * SKU Limit (business_page): 描述在 features 里，如 "Up to 10 products"
 * Listing renewal: 无 SKU 限制
 *
 * FIXED Limits (per entity type - NOT in variants):
 *   - Product/SKU: 6 images, 1 video
 *   - Business Page Gallery: 12 images, 1 video
 *   - LatestUpdate: 4 images, 1 video
 *   - Listing: 6 images, 1 video
 */

export const servicePackages = [
  // ========================
  // BUSINESS PAGE PLANS
  // ========================
  {
    id: 'sp-basic',
    type: 'business_page',
    name: 'Basic Business Plan',
    slug: 'basic-monthly',
    description: 'For small businesses starting out',
    variants: JSON.stringify([
      {
        name: 'Monthly',
        price: 29,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        features: ['Up to 10 products/services', '12 business images', '1 video']
      },
      {
        name: 'Yearly',
        price: 290,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        features: ['Up to 10 products/services', '12 business images', '1 video', 'Save $58']
      }
    ]),
    isActive: 1,
    sortOrder: 10
  },
  {
    id: 'sp-pro',
    type: 'business_page',
    name: 'Pro Business Plan',
    slug: 'pro-monthly',
    description: 'For growing businesses',
    variants: JSON.stringify([
      {
        name: 'Monthly',
        price: 59,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        features: ['Up to 30 products/services', '12 business images', '1 video']
      },
      {
        name: 'Yearly',
        price: 590,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        features: ['Up to 30 products/services', '12 business images', '1 video', 'Save $118']
      }
    ]),
    isActive: 1,
    sortOrder: 20
  },
  {
    id: 'sp-max',
    type: 'business_page',
    name: 'Max Business Plan',
    slug: 'max-monthly',
    description: 'For established businesses with full features',
    variants: JSON.stringify([
      {
        name: 'Monthly',
        price: 89,
        currency: 'USD',
        durationValue: 1,
        durationUnit: 'month',
        features: ['Up to 60 products/services', '12 business images', '1 video']
      },
      {
        name: 'Yearly',
        price: 890,
        currency: 'USD',
        durationValue: 12,
        durationUnit: 'months',
        features: ['Up to 60 products/services', '12 business images', '1 video', 'Save $178']
      }
    ]),
    isActive: 1,
    sortOrder: 30
  },

  // ========================
  // LISTING RENEWALS
  // ========================
  {
    id: 'sp-listing-7days',
    type: 'listing_renewal',
    name: '7-Day Listing Renewal',
    slug: 'listing-7days',
    description: 'Extend your listing visibility for 7 days',
    variants: JSON.stringify([
      {
        name: '7 Days',
        price: 8,
        currency: 'USD',
        durationValue: 7,
        durationUnit: 'days',
        features: ['7-day listing visibility', 'Up to 6 images', '1 video']
      }
    ]),
    isActive: 1,
    sortOrder: 100
  },
  {
    id: 'sp-listing-30days',
    type: 'listing_renewal',
    name: '30-Day Listing Renewal',
    slug: 'listing-30days',
    description: 'Monthly listing with better visibility',
    variants: JSON.stringify([
      {
        name: '30 Days',
        price: 20,
        currency: 'USD',
        durationValue: 30,
        durationUnit: 'days',
        features: ['30-day listing visibility', 'Up to 6 images', '1 video']
      }
    ]),
    isActive: 1,
    sortOrder: 110
  },
  {
    id: 'sp-listing-365days',
    type: 'listing_renewal',
    name: '365-Day Listing Renewal',
    slug: 'listing-365days',
    description: 'Full year listing with maximum exposure',
    variants: JSON.stringify([
      {
        name: '365 Days',
        price: 200,
        currency: 'USD',
        durationValue: 365,
        durationUnit: 'days',
        features: ['365-day listing visibility', 'Up to 6 images', '1 video', 'Best value']
      }
    ]),
    isActive: 1,
    sortOrder: 120
  },
];

export default servicePackages;