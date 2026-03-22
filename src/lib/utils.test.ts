import { describe, it, expect } from 'vitest';

// Simple unit tests for utils
import { cn } from '../lib/utils';

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
