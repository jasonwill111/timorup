/**
 * Unit tests for Zod validation schemas (TDD)
 *
 * Tests the validation patterns used in API routes.
 * Follows Zod v4 syntax: z.email() not z.string().email()
 */

import { describe, it, expect } from 'vitest';
import * as z from 'zod';

// Define schemas matching the API routes
const CreateListingSchema = z.object({
  entityType: z.enum(['business', 'government', 'nonprofit']),
  title: z.string().min(1, { error: 'Title is required' }),
  categoryId: z.string().optional(),
  industry: z.string().optional(),
  contactName: z.string().optional(),
  countryCode: z.string().default('+670'),
  contactNumber: z.string().optional(),
  email: z.email({ error: 'Invalid email' }).optional().or(z.literal('')),
  registrationUrl: z?.url({ error: 'Invalid URL' }).optional().or(z.literal('')),
  address: z.string().optional(),
  aboutUs: z.string().optional(),
  tags: z.array(z.string()).optional(),
  yearOfEstablishment: z.number().optional(),
  status: z.enum(['draft', 'live', 'suspended']).default('draft'),
});

const UpdateListingSchema = z.object({
  title: z.string().min(1).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  countryCode: z.string().optional(),
  contactNumber: z.string().optional().nullable(),
  email: z.email().optional().nullable().or(z.literal('')),
  registrationUrl: z?.url().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  aboutUs: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.enum(['draft', 'live', 'suspended']).optional(),
});

const BusinessSlugSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  { error: 'Invalid slug format' }
);

const PhoneNumberSchema = z.string().regex(
  /^(\+670|0)?[0-9]{7,8}$/,
  { error: 'Invalid Timor-Leste phone number' }
);

describe('CreateListingSchema', () => {
  it('validates a complete valid listing', () => {
    const validData = {
      entityType: 'business',
      title: 'Test Cafe',
      categoryId: 'cat-123',
      industry: 'Food & Beverage',
      contactName: 'John Doe',
      countryCode: '+670',
      contactNumber: '77012345',
      email: 'test@example.com',
      registrationUrl: 'https://example.com',
      address: 'Dili, Timor-Leste',
      aboutUs: 'A great cafe',
      tags: ['coffee', 'wifi'],
      yearOfEstablishment: 2020,
      status: 'draft' as const,
    };

    const result = CreateListingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates a minimal valid listing', () => {
    const minimalData = {
      entityType: 'business',
      title: 'Test',
    };

    const result = CreateListingSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid entity type', () => {
    const invalidData = {
      entityType: 'invalid',
      title: 'Test',
    };

    const result = CreateListingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects empty title', () => {
    const invalidData = {
      entityType: 'business',
      title: '',
    };

    const result = CreateListingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const invalidData = {
      entityType: 'business',
      title: 'Test',
      email: 'not-an-email',
    };

    const result = CreateListingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('accepts empty string for optional email', () => {
    const validData = {
      entityType: 'business',
      title: 'Test',
      email: '',
    };

    const result = CreateListingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL', () => {
    const invalidData = {
      entityType: 'business',
      title: 'Test',
      registrationUrl: 'not-a-url',
    };

    const result = CreateListingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('applies default country code', () => {
    const data = {
      entityType: 'business',
      title: 'Test',
    };

    const result = CreateListingSchema.parse(data);
    expect(result.countryCode).toBe('+670');
  });

  it('applies default status', () => {
    const data = {
      entityType: 'business',
      title: 'Test',
    };

    const result = CreateListingSchema.parse(data);
    expect(result.status).toBe('draft');
  });

  it('accepts government entity type', () => {
    const validData = {
      entityType: 'government',
      title: 'Ministry of Finance',
    };

    const result = CreateListingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts nonprofit entity type', () => {
    const validData = {
      entityType: 'nonprofit',
      title: 'Red Cross Timor-Leste',
    };

    const result = CreateListingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('UpdateListingSchema', () => {
  it('validates partial update with title only', () => {
    const result = UpdateListingSchema.safeParse({ title: 'New Title' });
    expect(result.success).toBe(true);
  });

  it('validates partial update with null values', () => {
    const result = UpdateListingSchema.safeParse({
      title: null,
      categoryId: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = UpdateListingSchema.safeParse({ status: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('accepts valid status values', () => {
    expect(UpdateListingSchema.safeParse({ status: 'draft' }).success).toBe(true);
    expect(UpdateListingSchema.safeParse({ status: 'live' }).success).toBe(true);
    expect(UpdateListingSchema.safeParse({ status: 'suspended' }).success).toBe(true);
  });
});

describe('BusinessSlugSchema', () => {
  it('accepts valid slugs', () => {
    expect(BusinessSlugSchema.safeParse('my-business').success).toBe(true);
    expect(BusinessSlugSchema.safeParse('cafe-123').success).toBe(true);
    expect(BusinessSlugSchema.safeParse('a').success).toBe(true);
  });

  it('rejects uppercase', () => {
    expect(BusinessSlugSchema.safeParse('My-Business').success).toBe(false);
  });

  it('rejects spaces', () => {
    expect(BusinessSlugSchema.safeParse('my business').success).toBe(false);
  });

  it('rejects special characters', () => {
    expect(BusinessSlugSchema.safeParse('my_business').success).toBe(false);
    expect(BusinessSlugSchema.safeParse('my.business').success).toBe(false);
  });

  it('rejects leading/trailing hyphens', () => {
    expect(BusinessSlugSchema.safeParse('-my-business').success).toBe(false);
    expect(BusinessSlugSchema.safeParse('my-business-').success).toBe(false);
  });
});

describe('PhoneNumberSchema', () => {
  it('accepts Timor-Leste mobile numbers', () => {
    expect(PhoneNumberSchema.safeParse('77012345').success).toBe(true);
    expect(PhoneNumberSchema.safeParse('77000000').success).toBe(true);
  });

  it('accepts numbers with country code', () => {
    expect(PhoneNumberSchema.safeParse('+67077012345').success).toBe(true);
  });

  it('accepts landline numbers (7 digits)', () => {
    expect(PhoneNumberSchema.safeParse('2112345').success).toBe(true);
  });

  it('rejects too short numbers', () => {
    expect(PhoneNumberSchema.safeParse('12345').success).toBe(false);
  });

  it('rejects non-numeric', () => {
    expect(PhoneNumberSchema.safeParse('abc').success).toBe(false);
  });
});

describe('Zod v4 error handling', () => {
  it('uses z.flattenError for field errors', () => {
    const result = CreateListingSchema.safeParse({
      entityType: 'invalid',
      title: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = z.flattenError(result.error);
      expect(Object.keys(errors.fieldErrors).length).toBeGreaterThan(0);
    }
  });
});

// Zod 4 Coerce schemas for query params
describe('Zod v4 Coerce Schemas', () => {
  it('coerces string to number', () => {
    const schema = z.coerce.number();
    const result = schema.safeParse('123');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(123);
  });

  it('coerces query page param', () => {
    const schema = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    });
    const result = schema.safeParse({ page: '2', limit: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
    }
  });

  it('uses defaults when params missing', () => {
    const schema = z.object({
      page: z.coerce.number().int().min(1).default(1),
    });
    const result = schema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.page).toBe(1);
  });

  it('rejects invalid page number', () => {
    const schema = z.object({
      page: z.coerce.number().int().min(1),
    });
    const result = schema.safeParse({ page: '-1' });
    expect(result.success).toBe(false);
  });

  it('coerces boolean from string', () => {
    const schema = z.object({
      active: z.coerce.boolean(),
    });
    expect(schema.safeParse({ active: 'true' }).success).toBe(true);
    expect(schema.safeParse({ active: 'false' }).success).toBe(true);
    expect(schema.safeParse({ active: '1' }).success).toBe(true);
    expect(schema.safeParse({ active: '0' }).success).toBe(true);
  });
});

// File validation schemas
import {
  ImageFileSchema,
  VideoFileSchema,
  validateImageFile,
  validateVideoFile,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from './validation';

describe('ImageFileSchema (z.file)', () => {
  it('accepts valid jpeg images', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    expect(ImageFileSchema.safeParse(mockFile).success).toBe(true);
  });

  it('accepts png images', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    expect(ImageFileSchema.safeParse(mockFile).success).toBe(true);
  });

  it('accepts webp images', () => {
    const mockFile = new File(['test'], 'test.webp', { type: 'image/webp' });
    expect(ImageFileSchema.safeParse(mockFile).success).toBe(true);
  });

  it('rejects non-image files', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    expect(ImageFileSchema.safeParse(mockFile).success).toBe(false);
  });

  it('rejects oversized files', () => {
    // Create a file larger than MAX_IMAGE_SIZE
    const largeData = new Uint8Array(MAX_IMAGE_SIZE + 1);
    const mockFile = new File([largeData.buffer], 'large.jpg', { type: 'image/jpeg' });
    // Verify the mock file actually has the expected size
    expect(mockFile.size).toBeGreaterThan(MAX_IMAGE_SIZE);
    // z.file() maxSize validation
    const result = ImageFileSchema.safeParse(mockFile);
    expect(result.success).toBe(false);
  });
});

describe('VideoFileSchema (z.file)', () => {
  it('accepts valid mp4 videos', () => {
    const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    expect(VideoFileSchema.safeParse(mockFile).success).toBe(true);
  });

  it('accepts webm videos', () => {
    const mockFile = new File(['test'], 'test.webm', { type: 'video/webm' });
    expect(VideoFileSchema.safeParse(mockFile).success).toBe(true);
  });

  it('rejects non-video files', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    expect(VideoFileSchema.safeParse(mockFile).success).toBe(false);
  });
});

describe('validateImageFile helper', () => {
  it('returns valid for good images', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(mockFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error for invalid images', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const result = validateImageFile(mockFile);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('validateVideoFile helper', () => {
  it('returns valid for good videos', () => {
    const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const result = validateVideoFile(mockFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns error for invalid videos', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateVideoFile(mockFile);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
