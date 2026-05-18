// Astro Server Actions for Admin Listing Management (single listing operations)
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { buildUpdateData } from '@/lib/admin-update';

const updateSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  countryCode: z.string().optional(),
  contactNumber: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  registrationUrl: z.string().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  aboutUs: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  yearOfEstablishment: z.number().optional().nullable(),
  openingHours: z.record(z.string(), z.string()).optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  status: z.enum(['draft', 'live', 'suspended']).optional(),
  bannerImageId: z.string().optional().nullable(),
  profileImageId: z.string().optional().nullable(),
  verifiedBadge: z.boolean().optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional().nullable(),
  photoGallery: z.array(z.string()).optional().nullable(),
  latestUpdate: z.string().optional().nullable(),
  latestUpdateImages: z.array(z.string()).optional().nullable(),
  latestUpdateDate: z.number().optional().nullable(),
  planType: z.string().optional().nullable(),
  expiryDate: z.number().optional().nullable(),
});

// Field transform config for listing updates
const LISTING_FIELD_CONFIG = {
  tags: 'json',
  openingHours: 'json',
  socialLinks: 'json',
  email: 'emptyToNull',
  registrationUrl: 'emptyToNull',
  expiryDate: 'date',
} as const;

export const listing = {
  // Get single listing
  get: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
      const listing = await db.select()
        .from(businesses)
        .where(eq(businesses.id, input.id))
        .limit(1)
        .get();

      if (!listing) throw new Error('Listing not found');

      return { success: true, data: listing };
    },
  }),

  // Update listing
  update: defineAction({
    input: updateSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
      const { id, ...data } = input;

      const existing = await db.select()
        .from(businesses)
        .where(eq(businesses.id, id))
        .limit(1)
        .get();

      if (!existing) throw new Error('Listing not found');

      // Build update data with field transforms
      const updateData = buildUpdateData(data, LISTING_FIELD_CONFIG);

      await db.update(businesses)
        .set(updateData)
        .where(eq(businesses.id, id))
        .run();

      return { success: true };
    },
  }),

  // Delete listing
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
      await db.delete(businesses).where(eq(businesses.id, input.id)).run();

      return { success: true };
    },
  }),
};