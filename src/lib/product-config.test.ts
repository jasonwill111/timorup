/**
 * Product Config Module Tests
 */
import { describe, it, expect } from 'vitest';
import {
  productConfig,
  PRICE_UNITS,
  SKU_SERVICE_TYPES,
  getPriceUnitsForServiceType,
  type ProductType,
  type PriceUnit,
  type SpecificationField,
} from './product-config';

describe('ProductType Union', () => {
  it('TC-001: ProductType union includes all 10 types', () => {
    const validTypes: ProductType[] = [
      'product', 'service', 'rental', 'food',
      'accommodation', 'automotive', 'healthcare',
      'education', 'beauty', 'event'
    ];

    validTypes.forEach(type => {
      expect(productConfig.isValid(type)).toBe(true);
    });
  });
});

describe('PriceUnit Interface', () => {
  it('TC-002: PriceUnit has correct structure', () => {
    const unit = PRICE_UNITS[0];
    expect(unit).toHaveProperty('value');
    expect(unit).toHaveProperty('label');
    expect(unit).toHaveProperty('placeholder');
    expect(typeof unit.value).toBe('string');
    expect(typeof unit.label).toBe('string');
    expect(typeof unit.placeholder).toBe('string');
  });
});

describe('PRICE_UNIT_MAP Coverage', () => {
  it('TC-003: Each product type maps to at least one price unit', () => {
    const types = productConfig.allTypes();
    types.forEach(type => {
      const units = productConfig.getPriceUnits(type);
      expect(units.length).toBeGreaterThan(0);
    });
  });
});

describe('productConfig.isValid()', () => {
  it('TC-004: Valid type returns true', () => {
    expect(productConfig.isValid('product')).toBe(true);
    expect(productConfig.isValid('service')).toBe(true);
    expect(productConfig.isValid('automotive')).toBe(true);
  });

  it('TC-005: Invalid type returns false', () => {
    expect(productConfig.isValid('invalid_type')).toBe(false);
    expect(productConfig.isValid('')).toBe(false);
    expect(productConfig.isValid('PRODUCT')).toBe(false); // case-sensitive
  });

  it('TC-006: Type guard narrows type', () => {
    const checkType = (type: string): type is ProductType => {
      return productConfig.isValid(type);
    };

    const testType = 'product';
    if (checkType(testType)) {
      // TypeScript should now know testType is ProductType
      expect(productConfig.allTypes().includes(testType)).toBe(true);
    }
  });
});

describe('productConfig.getPriceUnits()', () => {
  it('TC-007: Returns correct units for product type', () => {
    const productUnits = productConfig.getPriceUnits('product');
    const expectedValues = ['/piece', '/kg', '/liter', '/pack', '/set', '/unit', ''];

    expect(productUnits.length).toBeGreaterThan(0);
    productUnits.forEach(unit => {
      expect(expectedValues).toContain(unit.value);
    });
  });

  it('TC-008: Invalid type returns empty array', () => {
    expect(productConfig.getPriceUnits('invalid')).toEqual([]);
    expect(productConfig.getPriceUnits('')).toEqual([]);
  });
});

describe('productConfig.getSpecificationFields()', () => {
  it('TC-009: Returns spec fields for automotive type', () => {
    const fields = productConfig.getSpecificationFields('automotive');

    expect(fields.length).toBeGreaterThan(0);
    fields.forEach((field: SpecificationField) => {
      expect(field).toHaveProperty('key');
      expect(field).toHaveProperty('label');
      expect(field).toHaveProperty('type');
    });
  });

  it('TC-010: Invalid type returns empty array', () => {
    expect(productConfig.getSpecificationFields('invalid')).toEqual([]);
  });

  it('TC-009b: Returns spec fields for food type', () => {
    const fields = productConfig.getSpecificationFields('food');

    expect(fields.length).toBeGreaterThan(0);
    const hasSelectField = fields.some(f => f.type === 'select');
    expect(hasSelectField).toBe(true);
  });
});

describe('productConfig.allTypes()', () => {
  it('TC-011: Returns all 10 ProductType values', () => {
    const types = productConfig.allTypes();
    expect(types.length).toBe(10);
  });

  it('TC-012: All returned values are valid', () => {
    const types = productConfig.allTypes();
    types.forEach(type => {
      expect(productConfig.isValid(type)).toBe(true);
    });
  });
});

describe('Backward Compatibility Exports', () => {
  it('TC-013: PRICE_UNITS export exists and has data', () => {
    expect(PRICE_UNITS).toBeDefined();
    expect(Array.isArray(PRICE_UNITS)).toBe(true);
    expect(PRICE_UNITS.length).toBeGreaterThan(0);
  });

  it('TC-014: SKU_SERVICE_TYPES export exists and has data', () => {
    expect(SKU_SERVICE_TYPES).toBeDefined();
    expect(Array.isArray(SKU_SERVICE_TYPES)).toBe(true);
    expect(SKU_SERVICE_TYPES.length).toBeGreaterThan(0);
  });
});

describe('Deprecated getPriceUnitsForServiceType()', () => {
  it('TC-015: Returns same result as productConfig.getPriceUnits()', () => {
    const types = productConfig.allTypes();

    types.forEach(type => {
      const deprecated = getPriceUnitsForServiceType(type);
      const current = productConfig.getPriceUnits(type);
      expect(deprecated).toEqual(current);
    });
  });
});