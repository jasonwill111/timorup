import { describe, it, expect } from 'vitest';

// Simple unit tests for utils
import { cn, formatCurrency, formatDate, slugify } from '../lib/utils';

describe('Utils', () => {
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
});

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
});

describe('formatCurrency', () => {
  it('formats USD with dollar sign', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });

  it('formats whole dollars', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats large numbers with thousands separator', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatDate', () => {
  it('formats date in US locale', () => {
    const result = formatDate('2024-03-15');
    expect(result).toMatch(/\w+ \d+, \d{4}/); // e.g. "March 15, 2024"
  });

  it('handles invalid date', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
  });

  it('formats date with time', () => {
    const result = formatDate('2024-03-15T14:30:00Z');
    expect(result).toMatch(/\w+ \d+, \d{4}/);
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('HELLO')).toBe('hello');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters and diacritics', () => {
    expect(slugify('Café & Bar!')).toBe('cafe-bar');
  });

  it('collapses multiple spaces to single hyphen', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('trims leading and trailing spaces', () => {
    expect(slugify('  Hello  ')).toBe('hello');
  });

  it('handles Timor-Leste characters', () => {
    expect(slugify('Díli Timor-Leste')).toBe('dili-timor-leste');
  });
});
