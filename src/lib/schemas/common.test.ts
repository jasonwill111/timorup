/**
 * Tests for common Zod schemas
 */
import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  requiredString,
  optionalString,
  phoneSchema,
  countryCodeSchema,
  slugSchema,
} from './common';

describe('emailSchema', () => {
  it('accepts valid email addresses', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true);
    expect(emailSchema.safeParse('user.name@domain.co.uk').success).toBe(true);
    expect(emailSchema.safeParse('admin@timorup.com').success).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(emailSchema.safeParse('notanemail').success).toBe(false);
    expect(emailSchema.safeParse('@domain.com').success).toBe(false);
    expect(emailSchema.safeParse('user@').success).toBe(false);
    expect(emailSchema.safeParse('').success).toBe(false);
  });

  it('has consistent error message', () => {
    const result = emailSchema.safeParse('invalid');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Valid email required');
    }
  });
});

describe('requiredString', () => {
  it('accepts non-empty strings', () => {
    const schema = requiredString();
    expect(schema.safeParse('hello').success).toBe(true);
    expect(schema.safeParse('a').success).toBe(true);
    expect(schema.safeParse('  trimmed  ').success).toBe(true); // Note: doesn't trim
  });

  it('rejects empty strings', () => {
    const schema = requiredString();
    expect(schema.safeParse('').success).toBe(false);
  });

  it('accepts custom error message', () => {
    const schema = requiredString('Title is required');
    const result = schema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required');
    }
  });
});

describe('phoneSchema', () => {
  it('accepts Timor-Leste format', () => {
    expect(phoneSchema.safeParse('+6701234567').success).toBe(true);
    expect(phoneSchema.safeParse('+670 123 4567').success).toBe(false); // spaces not allowed
  });

  it('accepts international formats', () => {
    expect(phoneSchema.safeParse('+1234567890').success).toBe(true);
    expect(phoneSchema.safeParse('+85212345678').success).toBe(true);
  });

  it('rejects invalid phone formats', () => {
    expect(phoneSchema.safeParse('abc123').success).toBe(false);
    expect(phoneSchema.safeParse('').success).toBe(false);
    expect(phoneSchema.safeParse('+abc123').success).toBe(false);
  });
});

describe('countryCodeSchema', () => {
  it('has default value', () => {
    const result = countryCodeSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('+670');
    }
  });

  it('preserves valid country codes', () => {
    expect(countryCodeSchema.safeParse('+1').success).toBe(true);
    expect(countryCodeSchema.safeParse('+852').success).toBe(true);
  });
});

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(slugSchema.safeParse('hello-world').success).toBe(true);
    expect(slugSchema.safeParse('cafe-timor').success).toBe(true);
    expect(slugSchema.safeParse('business123').success).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(slugSchema.safeParse('Hello-World').success).toBe(false); // uppercase
    expect(slugSchema.safeParse('hello_world').success).toBe(false); // underscore
    expect(slugSchema.safeParse('hello--world').success).toBe(false); // double hyphen
    expect(slugSchema.safeParse('-hello').success).toBe(false); // starts with hyphen
  });
});

describe('optionalString', () => {
  it('accepts strings and undefined', () => {
    const schema = optionalString();
    expect(schema.safeParse('hello').success).toBe(true);
    expect(schema.safeParse('').success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
  });
});