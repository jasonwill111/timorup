// Astro Server Actions for Admin Listing Management (single listing operations)
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

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

export const listing = {
  // Get single listing
  get: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const db = await getDb();
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
      const { id, ...data } = input;

      const existing = await db.select()
        .from(businesses)
        .where(eq(businesses.id, id))
        .limit(1)
        .get();

      if (!existing) throw new Error('Listing not found');

      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.industry !== undefined) updateData.industry = data.industry;
      if (data.contactName !== undefined) updateData.contactName = data.contactName;
      if (data.countryCode !== undefined) updateData.countryCode = data.countryCode;
      if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
      if (data.email !== undefined) updateData.email = data.email || null;
      if (data.registrationUrl !== undefined) updateData.registrationUrl = data.registrationUrl || null;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.aboutUs !== undefined) updateData.aboutUs = data.aboutUs;
      if (data.tags !== undefined) updateData.tags = data.tags ? JSON.stringify(data.tags) : null;
      if (data.yearOfEstablishment !== undefined) updateData.yearOfEstablishment = data.yearOfEstablishment;
      if (data.openingHours !== undefined) updateData.openingHours = data.openingHours ? JSON.stringify(data.openingHours) : null;
      if (data.locationLat !== undefined) updateData.locationLat = data.locationLat;
      if (data.locationLng !== undefined) updateData.locationLng = data.locationLng;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.bannerImageId !== undefined) updateData.bannerImageId = data.bannerImageId;
      if (data.profileImageId !== undefined) updateData.profileImageId = data.profileImageId;
      if (data.verifiedBadge !== undefined) updateData.verifiedBadge = data.verifiedBadge;
      if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks ? JSON.stringify(data.socialLinks) : null;
      if (data.photoGallery !== undefined) updateData.photoGallery = data.photoGallery ? JSON.stringify(data.photoGallery) : null;
      if (data.latestUpdate !== undefined) updateData.latestUpdate = data.latestUpdate;
      if (data.latestUpdateImages !== undefined) updateData.latestUpdateImages = data.latestUpdateImages ? JSON.stringify(data.latestUpdateImages) : null;
      if (data.latestUpdateDate !== undefined) updateData.latestUpdateDate = data.latestUpdateDate ? new Date(data.latestUpdateDate) : null;
      if (data.planType !== undefined) updateData.planType = data.planType;
      if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;

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
      await db.delete(businesses).where(eq(businesses.id, input.id)).run();

      return { success: true };
    },
  }),
};