/**
 * Tests for admin-update.ts utility
 */

import { describe, it, expect } from 'vitest';
import { buildUpdateData, createConfig } from './admin-update';

describe('admin-update utility', () => {
  describe('buildUpdateData', () => {
    it('should pass through direct fields', () => {
      const data = {
        title: 'Test Business',
        status: 'live',
        verifiedBadge: true,
      };

      const result = buildUpdateData(data, {});

      expect(result).toEqual(data);
    });

    it('should JSON.stringify json fields', () => {
      const data = {
        tags: ['food', 'restaurant'],
        openingHours: { mon: '9-5' },
        socialLinks: { facebook: 'fb.com/test' },
      };

      const config = {
        tags: 'json',
        openingHours: 'json',
        socialLinks: 'json',
      };

      const result = buildUpdateData(data, config);

      expect(result.tags).toBe('["food","restaurant"]');
      expect(result.openingHours).toBe('{"mon":"9-5"}');
      expect(result.socialLinks).toBe('{"facebook":"fb.com/test"}');
    });

    it('should convert empty string to null for emptyToNull fields', () => {
      const data = {
        email: '',
        registrationUrl: '',
        name: 'Business Name',
      };

      const config = {
        email: 'emptyToNull',
        registrationUrl: 'emptyToNull',
      };

      const result = buildUpdateData(data, config);

      expect(result.email).toBeNull();
      expect(result.registrationUrl).toBeNull();
      expect(result.name).toBe('Business Name');
    });

    it('should convert number to Date for date fields', () => {
      const timestamp = 1715000000000;
      const data = {
        expiryDate: timestamp,
      };

      const config = {
        expiryDate: 'date',
      };

      const result = buildUpdateData(data, config);

      expect(result.expiryDate).toBeInstanceOf(Date);
      expect((result.expiryDate as Date).getTime()).toBe(timestamp);
    });

    it('should handle null values for json fields', () => {
      const data = {
        tags: null,
        openingHours: null,
      };

      const config = {
        tags: 'json',
        openingHours: 'json',
      };

      const result = buildUpdateData(data, config);

      expect(result.tags).toBeNull();
      expect(result.openingHours).toBeNull();
    });

    it('should skip undefined fields', () => {
      const data = {
        title: 'Test',
        description: undefined,
      };

      const result = buildUpdateData(data, {});

      expect(result).toEqual({ title: 'Test' });
      expect(result).not.toHaveProperty('description');
    });

    it('should apply multiple transforms', () => {
      const data = {
        email: '',
        tags: ['test'],
        expiryDate: 1715000000000,
        name: 'My Business',
      };

      const config = {
        email: 'emptyToNull',
        tags: 'json',
        expiryDate: 'date',
      };

      const result = buildUpdateData(data, config);

      expect(result).toEqual({
        email: null,
        tags: '["test"]',
        expiryDate: expect.any(Date),
        name: 'My Business',
      });
    });
  });

  describe('createConfig', () => {
    it('should create config object', () => {
      const config = createConfig({
        tags: 'json',
        email: 'emptyToNull',
      });

      expect(config.tags).toBe('json');
      expect(config.email).toBe('emptyToNull');
    });
  });
});