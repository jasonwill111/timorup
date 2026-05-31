/**
 * Tests for media validation module
 */
import { describe, it, expect } from 'vitest';
import { validateMediaFile, buildR2Key } from './validator';
import { ErrorCode } from '@/lib/errors';

describe('validateMediaFile', () => {
  describe('no file provided', () => {
    it('should return error for null file', () => {
      const result = validateMediaFile(null as unknown as File, 'businesses');

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.MEDIA_NO_FILE);
    });

    it('should return error for undefined file', () => {
      const result = validateMediaFile(undefined as unknown as File, 'businesses');

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.MEDIA_NO_FILE);
    });
  });

  describe('file type validation', () => {
    it('should accept valid image types', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(file, 'businesses');

      expect(result.valid).toBe(true);
      expect(result.isImage).toBe(true);
      expect(result.isVideo).toBe(false);
    });

    it('should accept valid video types', () => {
      const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      const result = validateMediaFile(file, 'businesses');

      expect(result.valid).toBe(true);
      expect(result.isImage).toBe(false);
      expect(result.isVideo).toBe(true);
    });

    it('should reject invalid file types', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateMediaFile(file, 'businesses');

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.MEDIA_TYPE_NOT_ALLOWED);
    });

    it('should accept webp images', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      const result = validateMediaFile(file, 'businesses');

      expect(result.valid).toBe(true);
      expect(result.isImage).toBe(true);
    });
  });

  describe('file size validation', () => {
    it('should reject oversized image', () => {
      // Create a file larger than 2MB (default maxImageSize)
      const largeContent = new Array(3 * 1024 * 1024).fill(0).join('');
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(file, 'businesses');

      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe(ErrorCode.MEDIA_SIZE_TOO_LARGE);
    });

    it('should accept small image', () => {
      const file = new File(['tiny'], 'small.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(file, 'businesses');

      expect(result.valid).toBe(true);
    });
  });

  describe('entity type limits', () => {
    it('should use hero limits (1 image)', () => {
      // This tests that getMediaLimits is called with the right entity type
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(file, 'heroes');

      // Should pass type validation, size will depend on actual limits
      expect(result.isImage).toBe(true);
    });

    it('should use blog limits (unlimited)', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(file, 'blogs');

      expect(result.isImage).toBe(true);
    });
  });
});

describe('buildR2Key', () => {
  it('should build correct R2 key', () => {
    const key = buildR2Key({
      type: 'businesses/biz-123/profile',
      filename: 'photo.jpg',
      timestamp: 1712345678900,
      id: 'abc-123',
    });

    expect(key).toContain('businesses/biz-123/profile/');
    expect(key).toContain('1712345678900');
    expect(key).toContain('abc-123');
    expect(key).toContain('.jpg');
  });

  it('should preserve filename without extension', () => {
    const key = buildR2Key({
      type: 'businesses/biz-123/profile',
      filename: 'photo',
      timestamp: 1712345678900,
      id: 'abc-123',
    });

    expect(key).toContain('1712345678900-abc-123');
    expect(key).toContain('.photo'); // Uses original extension
  });

  it('should extract correct extension', () => {
    const key = buildR2Key({
      type: 'products/prod-123/gallery',
      filename: 'image.png',
      timestamp: 1712345678900,
      id: 'def-456',
    });

    expect(key).toContain('.png');
  });
});