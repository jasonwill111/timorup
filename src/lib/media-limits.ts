/**
 * Media Upload Limits Configuration
 * Centralized limits for all entity types
 *
 * Updated: 2026-05-15
 * - All images: 2MB max
 * - All videos: 8MB max
 * - Blog: no limits (unlimited)
 * - Hero: 1 image only
 * - Updates: 4 images + 1 video
 * - Businesses: 12 images + 1 video (base), plan can override
 */

export interface MediaLimits {
  maxFileSize: number;        // bytes
  maxImages: number;         // total images (0 = unlimited)
  maxVideos: number;         // total videos (0 = unlimited)
  maxImageSize: number;      // bytes
  maxVideoSize: number;      // bytes
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
}

// Default limits for non-business entities
export const DEFAULT_LIMITS: MediaLimits = {
  maxFileSize: 8 * 1024 * 1024,    // 8MB
  maxImages: 8,
  maxVideos: 1,
  maxImageSize: 2 * 1024 * 1024,    // 2MB
  maxVideoSize: 8 * 1024 * 1024,    // 8MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
};

// Entity-specific limits
export const ENTITY_LIMITS: Record<string, MediaLimits> = {
  // Businesses: plan-based limits (base: 12 images, 1 video)
  businesses: {
    maxFileSize: 8 * 1024 * 1024,
    maxImages: 12,
    maxVideos: 1,
    maxImageSize: 2 * 1024 * 1024,
    maxVideoSize: 8 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  non_profits: DEFAULT_LIMITS,
  public_sectors: DEFAULT_LIMITS,
  listings: DEFAULT_LIMITS,
  // Blog: no limits
  blogs: {
    ...DEFAULT_LIMITS,
    maxImages: 0,  // unlimited
    maxVideos: 0,  // unlimited
  },
  // Hero: 1 image only
  heroes: {
    ...DEFAULT_LIMITS,
    maxImages: 1,
    maxVideos: 0,
  },
  products: {
    ...DEFAULT_LIMITS,
    maxImages: 5,
    maxVideos: 1,
  },
  // Updates (latestUpdate): 4 images + 1 video
  updates: {
    ...DEFAULT_LIMITS,
    maxImages: 4,
    maxVideos: 1,
  },
  categories: {
    ...DEFAULT_LIMITS,
    maxImages: 1,
    maxVideos: 0,
  },
  skus: {
    ...DEFAULT_LIMITS,
    maxImages: 5,
    maxVideos: 0,
  },
};

/**
 * Get limits for an entity type
 *
 * @param entityType - The entity type (e.g., 'businesses', 'blogs', 'hero')
 * @param planType - Optional plan type for businesses
 * @returns Media limits configuration
 *
 * @example
 * const limits = getMediaLimits('blogs');
 * console.log(`Max ${limits.maxImages} images`);
 */
export function getMediaLimits(entityType: string, planType?: string): MediaLimits {
  // Special handling for businesses with plans
  if (entityType === 'businesses' && planType) {
    // Plan-based limits are handled in upload.ts
    // Return base limits here
    return ENTITY_LIMITS.businesses ?? DEFAULT_LIMITS;
  }

  // Return entity-specific or default
  return ENTITY_LIMITS[entityType] ?? DEFAULT_LIMITS;
}

/**
 * Check if file type is allowed
 */
export function isAllowedImageType(mimeType: string): boolean {
  return DEFAULT_LIMITS.allowedImageTypes.includes(mimeType);
}

export function isAllowedVideoType(mimeType: string): boolean {
  return DEFAULT_LIMITS.allowedVideoTypes.includes(mimeType);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
