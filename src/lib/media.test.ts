import { describe, it, expect } from 'vitest';

// ==================== UTILS TESTS ====================

import { cn } from '../lib/utils';

describe('Utils - cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar')).toBe('foo');
    expect(cn('foo', true && 'bar')).toBe('foo bar');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
  });
});

// ==================== DATABASE SCHEMA TESTS ====================

describe('Database Schema', () => {
  it('should have users table defined', async () => {
    const { users } = await import('../db/schema/index');
    expect(users).toBeDefined();
  });

  it('should have categories table defined', async () => {
    const { categories } = await import('../db/schema/index');
    expect(categories).toBeDefined();
  });

  it('should have businessPages table defined', async () => {
    const { businessPages } = await import('../db/schema/index');
    expect(businessPages).toBeDefined();
  });

  it('should have orders table defined', async () => {
    const { orders } = await import('../db/schema/index');
    expect(orders).toBeDefined();
  });

  // Test schema structure - verify tables are properly defined
  it('should have users table', async () => {
    const { users } = await import('../db/schema/index');
    expect(users).toBeDefined();
  });

  it('should have categories table', async () => {
    const { categories } = await import('../db/schema/index');
    expect(categories).toBeDefined();
  });

  it('should have businessPages table', async () => {
    const { businessPages } = await import('../db/schema/index');
    expect(businessPages).toBeDefined();
  });

  it('should have products table', async () => {
    const { products } = await import('../db/schema/index');
    expect(products).toBeDefined();
  });

  it('should have reviews table', async () => {
    const { reviews } = await import('../db/schema/index');
    expect(reviews).toBeDefined();
  });

  it('should have orders table', async () => {
    const { orders } = await import('../db/schema/index');
    expect(orders).toBeDefined();
  });

  // Test auth schema exports
  it('should export sessions from auth', async () => {
    const schema = await import('../db/schema/index');
    expect(schema.sessions).toBeDefined();
  });

  it('should export accounts from auth', async () => {
    const schema = await import('../db/schema/index');
    expect(schema.accounts).toBeDefined();
  });

  it('should export verifications from auth', async () => {
    const schema = await import('../db/schema/index');
    expect(schema.verifications).toBeDefined();
  });

  // Additional table tests
  it('should have media table defined', async () => {
    const { media } = await import('../db/schema/index');
    expect(media).toBeDefined();
  });

  it('should have adBanners table defined', async () => {
    const { adBanners } = await import('../db/schema/index');
    expect(adBanners).toBeDefined();
  });

  it('should have siteSettings table defined', async () => {
    const { siteSettings } = await import('../db/schema/index');
    expect(siteSettings).toBeDefined();
  });
});

// ==================== MEDIA UTILS TESTS ====================

describe('Media Utils', async () => {
  const mediaModule = await import('../lib/media');
  const { 
    validateFileType, 
    validateFileSize, 
    generateFileKey,
    MAX_IMAGE_SIZE,
    MAX_VIDEO_SIZE,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_VIDEO_TYPES,
    PLAN_LIMITS
  } = mediaModule;

  describe('validateFileType', () => {
    it('should accept valid image types', () => {
      ALLOWED_IMAGE_TYPES.forEach((type: string) => {
        const result = validateFileType(type);
        expect(result.valid).toBe(true);
        expect(result.type).toBe('image');
      });
    });

    it('should accept valid video types', () => {
      ALLOWED_VIDEO_TYPES.forEach((type: string) => {
        const result = validateFileType(type);
        expect(result.valid).toBe(true);
        expect(result.type).toBe('video');
      });
    });

    it('should reject invalid types', () => {
      const result = validateFileType('application/pdf');
      expect(result.valid).toBe(false);
      expect(result.type).toBeNull();
    });
  });

  describe('validateFileSize', () => {
    it('should accept small images', () => {
      const result = validateFileSize(1024 * 1024, 'image'); // 1MB
      expect(result.valid).toBe(true);
    });

    it('should reject oversized images', () => {
      const result = validateFileSize(MAX_IMAGE_SIZE + 1, 'image');
      expect(result.valid).toBe(false);
    });

    it('should accept small videos', () => {
      const result = validateFileSize(1024 * 1024, 'video'); // 1MB
      expect(result.valid).toBe(true);
    });

    it('should reject oversized videos', () => {
      const result = validateFileSize(MAX_VIDEO_SIZE + 1, 'video');
      expect(result.valid).toBe(false);
    });
  });

  describe('generateFileKey', () => {
    it('should generate unique keys', () => {
      const key1 = generateFileKey('user1', 'file1', 'jpg');
      // Wait a bit to ensure different timestamp
      const key2 = generateFileKey('user1', 'file2', 'jpg');
      expect(key1).not.toBe(key2);
    });

    it('should include user ID in key', () => {
      const key = generateFileKey('user123', 'file1', 'jpg');
      expect(key).toContain('user123');
    });
  });

  describe('PLAN_LIMITS', () => {
    it('should have basic plan', () => {
      expect(PLAN_LIMITS.basic).toBeDefined();
      expect(PLAN_LIMITS.basic.maxProducts).toBe(10);
    });

    it('should have pro plan', () => {
      expect(PLAN_LIMITS.pro).toBeDefined();
      expect(PLAN_LIMITS.pro.maxProducts).toBe(30);
    });

    it('should have max plan', () => {
      expect(PLAN_LIMITS.max).toBeDefined();
      expect(PLAN_LIMITS.max.maxProducts).toBe(60);
    });

    it('should have correct image limits', () => {
      expect(PLAN_LIMITS.basic.maxImages).toBe(10);
      expect(PLAN_LIMITS.pro.maxImages).toBe(10);
      expect(PLAN_LIMITS.max.maxImages).toBe(10);
    });

    it('should have correct video limits', () => {
      expect(PLAN_LIMITS.basic.maxVideos).toBe(1);
      expect(PLAN_LIMITS.pro.maxVideos).toBe(1);
      expect(PLAN_LIMITS.max.maxVideos).toBe(1);
    });
  });

  // ==================== ADDITIONAL COVERAGE TESTS ====================
  // Testing uncovered functions: getSignedUrl, getOptimizedImageUrl, 
  // isCloudflareEnvironment, getPublicMediaUrl

  describe('getSignedUrl', () => {
    it('should return public URL for R2', async () => {
      const { getSignedUrl } = await import('../lib/media');
      const url = await getSignedUrl('test-key');
      expect(url).toContain('test-key');
    });

    it('should accept custom expiration', async () => {
      const { getSignedUrl } = await import('../lib/media');
      const url = await getSignedUrl('test-key', 7200);
      expect(url).toContain('test-key');
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should return original URL if not R2 URL', async () => {
      const { getOptimizedImageUrl } = await import('../lib/media');
      const result = getOptimizedImageUrl('https://other-cdn.com/image.jpg');
      expect(result).toBe('https://other-cdn.com/image.jpg');
    });

    it('should add width transformation', async () => {
      const { getOptimizedImageUrl } = await import('../lib/media');
      const result = getOptimizedImageUrl('https://timorlist-media.r2.cloudflarestorage.com/test.jpg', { width: 800 });
      expect(result).toContain('width=800');
    });

    it('should add height transformation', async () => {
      const { getOptimizedImageUrl } = await import('../lib/media');
      const result = getOptimizedImageUrl('https://timorlist-media.r2.cloudflarestorage.com/test.jpg', { height: 600 });
      expect(result).toContain('height=600');
    });

    it('should use default quality and format', async () => {
      const { getOptimizedImageUrl } = await import('../lib/media');
      const result = getOptimizedImageUrl('https://timorlist-media.r2.cloudflarestorage.com/test.jpg');
      expect(result).toContain('quality=80');
      expect(result).toContain('format=webp');
    });

    it('should allow custom quality and format', async () => {
      const { getOptimizedImageUrl } = await import('../lib/media');
      const result = getOptimizedImageUrl('https://timorlist-media.r2.cloudflarestorage.com/test.jpg', { 
        quality: 60, 
        format: 'avif' 
      });
      expect(result).toContain('quality=60');
      expect(result).toContain('format=avif');
    });
  });

  describe('isCloudflareEnvironment', () => {
    it('should detect CF_PAGES environment', async () => {
      const original = process.env.CF_PAGES;
      process.env.CF_PAGES = 'true';
      const { isCloudflareEnvironment } = await import('../lib/media');
      expect(isCloudflareEnvironment()).toBe(true);
      if (original !== undefined) process.env.CF_PAGES = original;
      else delete process.env.CF_PAGES;
    });

    it('should detect CF_FUNCTION environment', async () => {
      const original = process.env.CF_FUNCTION;
      process.env.CF_FUNCTION = 'true';
      const { isCloudflareEnvironment } = await import('../lib/media');
      expect(isCloudflareEnvironment()).toBe(true);
      if (original !== undefined) process.env.CF_FUNCTION = original;
      else delete process.env.CF_FUNCTION;
    });

    it('should detect cloudflare NODE_ENV', async () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = 'cloudflare';
      const { isCloudflareEnvironment } = await import('../lib/media');
      expect(isCloudflareEnvironment()).toBe(true);
      process.env.NODE_ENV = original;
    });

    it('should return false in normal environment', async () => {
      const { isCloudflareEnvironment } = await import('../lib/media');
      expect(isCloudflareEnvironment()).toBe(false);
    });
  });

  describe('getPublicMediaUrl', () => {
    it('should return URL as-is if already starts with http', async () => {
      const { getPublicMediaUrl } = await import('../lib/media');
      expect(getPublicMediaUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
    });

    it('should prepend R2 public URL if key does not start with http', async () => {
      const { getPublicMediaUrl } = await import('../lib/media');
      const result = getPublicMediaUrl('uploads/test/image.jpg');
      expect(result).toContain('uploads/test/image.jpg');
    });
  });

  // Additional tests for uncovered functions
  describe('createS3Client', () => {
    it('should create client with custom config', async () => {
      const { createS3Client } = await import('../lib/media');
      const client = createS3Client({
        endpoint: 'https://custom.endpoint.com',
        credentials: {
          accessKeyId: 'test-key',
          secretAccessKey: 'test-secret'
        }
      });
      expect(client).toBeDefined();
    });

    it('should create client with default config when no params provided', async () => {
      const { createS3Client } = await import('../lib/media');
      const client = createS3Client();
      expect(client).toBeDefined();
    });
  });

  describe('getS3Client', () => {
    it('should return singleton client', async () => {
      const { getS3Client, resetS3Client } = await import('../lib/media');
      resetS3Client();
      const client1 = getS3Client();
      const client2 = getS3Client();
      expect(client1).toBe(client2);
    });
  });
});
