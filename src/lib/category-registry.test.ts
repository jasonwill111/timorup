/**
 * Unit tests for category-registry
 */
import { describe, it, expect } from 'vitest';
import {
  CATEGORY_TABLE_MAP,
  isValidEntityType,
  getCategoryTable,
  VALID_ENTITY_TYPES,
  getValidEntityTypesMessage,
  type EntityType,
} from './category-registry';

describe('category-registry', () => {
  describe('VALID_ENTITY_TYPES', () => {
    it('contains all 4 entity types', () => {
      expect(VALID_ENTITY_TYPES).toHaveLength(4);
      expect(VALID_ENTITY_TYPES).toContain('business');
      expect(VALID_ENTITY_TYPES).toContain('non_profit');
      expect(VALID_ENTITY_TYPES).toContain('public_sector');
      expect(VALID_ENTITY_TYPES).toContain('listing');
    });
  });

  describe('isValidEntityType', () => {
    it('returns true for valid entity types', () => {
      expect(isValidEntityType('business')).toBe(true);
      expect(isValidEntityType('non_profit')).toBe(true);
      expect(isValidEntityType('public_sector')).toBe(true);
      expect(isValidEntityType('listing')).toBe(true);
    });

    it('returns false for invalid entity types', () => {
      expect(isValidEntityType('invalid')).toBe(false);
      expect(isValidEntityType('nonprofit')).toBe(false); // no underscore
      expect(isValidEntityType('Non-Profit')).toBe(false);
      expect(isValidEntityType('')).toBe(false);
      expect(isValidEntityType('BUSINESS')).toBe(false);
    });

    it('narrowing works correctly', () => {
      const type = 'business' as string;
      if (isValidEntityType(type)) {
        // TypeScript should know this is EntityType
        const result: EntityType = type;
        expect(result).toBe('business');
      }
    });
  });

  describe('getCategoryTable', () => {
    it('returns correct config for business', () => {
      const config = getCategoryTable('business');
      expect(config.tableName).toBe('business_categories');
      expect(config.schema).toBeDefined();
    });

    it('returns correct config for non_profit', () => {
      const config = getCategoryTable('non_profit');
      expect(config.tableName).toBe('non_profit_categories');
      expect(config.schema).toBeDefined();
    });

    it('returns correct config for public_sector', () => {
      const config = getCategoryTable('public_sector');
      expect(config.tableName).toBe('public_sector_categories');
      expect(config.schema).toBeDefined();
    });

    it('returns correct config for listing', () => {
      const config = getCategoryTable('listing');
      expect(config.tableName).toBe('listing_categories');
      expect(config.schema).toBeDefined();
    });
  });

  describe('CATEGORY_TABLE_MAP', () => {
    it('has all 4 entity types as keys', () => {
      const keys = Object.keys(CATEGORY_TABLE_MAP);
      expect(keys).toHaveLength(4);
      expect(keys).toContain('business');
      expect(keys).toContain('non_profit');
      expect(keys).toContain('public_sector');
      expect(keys).toContain('listing');
    });

    it('each entry has schema and tableName', () => {
      for (const key of VALID_ENTITY_TYPES) {
        const config = CATEGORY_TABLE_MAP[key];
        expect(config).toHaveProperty('schema');
        expect(config).toHaveProperty('tableName');
        expect(typeof config.tableName).toBe('string');
      }
    });

    it('tableName matches entity type pattern', () => {
      expect(CATEGORY_TABLE_MAP.business.tableName).toBe('business_categories');
      expect(CATEGORY_TABLE_MAP.non_profit.tableName).toBe('non_profit_categories');
      expect(CATEGORY_TABLE_MAP.public_sector.tableName).toBe('public_sector_categories');
      expect(CATEGORY_TABLE_MAP.listing.tableName).toBe('listing_categories');
    });
  });

  describe('getValidEntityTypesMessage', () => {
    it('returns comma-separated list of valid types', () => {
      const message = getValidEntityTypesMessage();
      expect(message).toBe('business, non_profit, public_sector, listing');
    });
  });
});