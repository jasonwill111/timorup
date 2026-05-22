/**
 * Fixed Media Limits
 * TimorUp (2026-05-21)
 *
 * These limits are FIXED per entity type - NOT stored in database.
 * Use these constants in code to validate uploads.
 */

export const MEDIA_LIMITS = {
  // Product/SKU
  product: {
    maxImages: 6,
    maxVideos: 1,
  },

  // Business Page Gallery
  businessPage: {
    maxImages: 12,
    maxVideos: 1,
  },

  // LatestUpdate section
  latestUpdate: {
    maxImages: 4,
    maxVideos: 1,
    maxContentLength: 104, // characters
  },

  // Listing
  listing: {
    maxImages: 6,
    maxVideos: 1,
  },
} as const;

export default MEDIA_LIMITS;
