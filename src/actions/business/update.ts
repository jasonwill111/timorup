// Business Server Action - Update
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getAuthenticatedUserFromCookies } from '@/lib/db/queries/auth';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updateBusiness } from '@/lib/db/queries/businesses';
import { createErrorResponse, ErrorCode } from '@/lib/errors';


async function purgeCache(path: string): Promise<void> {
  try {
    const cacheKey = `https://TimorUp.com${path}`;
    await (caches as unknown as { default: Cache }).default.delete(cacheKey);
    await (caches as unknown as { default: Cache }).default.delete('https://TimorUp.com/businesses');
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[Cache] Purge failed:', e instanceof Error ? e.message : String(e));
    }
  }
}

export const update = defineAction({
  accept: 'form',
  input: z.object({
    slug: z.string().min(1, 'Slug is required'),
    title: z.string().optional(),
    categoryId: z.string().optional(),
    contactName: z.string().optional(),
    contactNumber: z.string().optional(),
    countryCode: z.string().optional(),
    email: z.email().optional().or(z.literal('')),
    address: z.string().optional(),
    aboutUs: z.string().optional(),
    tags: z.array(z.string()).optional(),
    openingHours: z.record(z.string(), z.string()).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    yearOfEstablishment: z.number().optional(),
    latestUpdates: z.string().optional(),
    registrationUrl: z.string().optional(),
    bannerImageId: z.string().optional(),
    profileImageId: z.string().optional(),
    socialLinks: z.record(z.string(), z.string()).optional(),
    newSlug: z.string().optional(),
  }),
  handler: async (input, { cookies }) => {
    try {
      // Authenticate via query layer
      const authResult = await getAuthenticatedUserFromCookies(cookies);
      if ('error' in authResult) {
        return { success: false, error: { code: authResult.error, message: 'Authentication required' } };
      }

      const userId = authResult.userId;

      // Fetch existing business (still need inline for ownership check)
      const db = await getDb();
      if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");

      const existing = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .limit(1)
        .get() ?? null;

      if (!existing) {
        return { success: false, error: { message: 'Business not found' } };
      }

      if (existing.ownerId !== userId) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to edit this business' } };
      }

      // Build update data for query layer
      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.newSlug !== undefined) updateData.slug = input.newSlug;
      if (input.categoryId !== undefined) updateData.categoryId = input.categoryId || null;
      if (input.contactName !== undefined) updateData.contactName = input.contactName || null;
      if (input.contactNumber !== undefined) updateData.contactNumber = input.contactNumber || null;
      if (input.countryCode !== undefined) updateData.countryCode = input.countryCode || '+670';
      if (input.email !== undefined) updateData.email = input.email || null;
      if (input.address !== undefined) updateData.address = input.address || null;
      if (input.aboutUs !== undefined) updateData.aboutUs = input.aboutUs || null;
      if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
      if (input.openingHours !== undefined) updateData.openingHours = JSON.stringify(input.openingHours);
      if (input.latitude !== undefined) updateData.locationLat = input.latitude || null;
      if (input.longitude !== undefined) updateData.locationLng = input.longitude || null;
      if (input.yearOfEstablishment !== undefined) updateData.yearOfEstablishment = input.yearOfEstablishment || null;
      if (input.registrationUrl !== undefined) updateData.registrationUrl = input.registrationUrl || null;
      if (input.bannerImageId !== undefined) updateData.bannerImageId = input.bannerImageId || null;
      if (input.profileImageId !== undefined) updateData.profileImageId = input.profileImageId || null;
      if (input.socialLinks !== undefined) updateData.socialLinks = JSON.stringify(input.socialLinks);

      if (Object.keys(updateData).length > 0) {
        // Use query layer
        await updateBusiness(existing.id, updateData);
        await purgeCache(`/api/businesses/${input.slug}`);
      }

      // Fetch updated record
      const updated = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .limit(1)
        .get() ?? null;

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});