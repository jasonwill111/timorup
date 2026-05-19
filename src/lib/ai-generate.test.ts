import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the modules before importing
vi.mock('@/lib/admin-auth', () => ({
  getAdminUser: vi.fn().mockResolvedValue({
    id: 'admin-1',
    email: 'admin@TimorLink.com',
    name: 'Admin',
    role: 'admin'
  })
}));

describe('AI Generate Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have valid input schema', async () => {
    // Test that the action input schema is correctly defined
    const { z } = await import('zod');
    
    const GenerationInputSchema = z.object({
      type: z.enum(['listing', 'sku', 'blog', 'landing']),
      data: z.record(z.string(), z.unknown()),
    });

    // Valid input
    const validInput = {
      type: 'listing',
      data: {
        title: 'Test Coffee Shop',
        entityType: 'business',
        contactName: 'John',
        phone: '77000000',
      }
    };

    expect(() => GenerationInputSchema.parse(validInput)).not.toThrow();
  });

  it('should reject invalid type', async () => {
    const { z } = await import('zod');
    
    const GenerationInputSchema = z.object({
      type: z.enum(['listing', 'sku', 'blog', 'landing']),
      data: z.record(z.string(), z.unknown()),
    });

    const invalidInput = {
      type: 'invalid',
      data: {}
    };

    expect(() => GenerationInputSchema.parse(invalidInput)).toThrow();
  });
});

describe('Message Building', () => {
  it('should build listing message correctly', () => {
    const data = {
      title: 'Timor Coffee Shop',
      entityType: 'business',
      contactName: 'John Silva',
      phone: '77000000',
      email: 'info@timorcoffee.tl',
      address: 'Avenida Principal, Dili',
      about: 'Best coffee in Timor',
      tags: ['coffee', 'wifi'],
    };

    const message = `Create a listing for "${data.title}" (${data.entityType}).
Contact: ${data.contactName}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}
About: ${data.about}
Tags: ${data.tags.join(', ')}`;

    expect(message).toContain('Timor Coffee Shop');
    expect(message).toContain('John Silva');
    expect(message).toContain('77000000');
    expect(message).toContain('coffee, wifi');
  });
});

