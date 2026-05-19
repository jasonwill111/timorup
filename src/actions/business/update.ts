// Business Server Action - Update
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function purgeCache(path: string): Promise<void> {
  // Use Cloudflare Cache API to purge CDN cache
  // This ensures updated content is served immediately after DB update
  try {
    const cacheKey = `https://TimorUp.com${path}`;
    await (caches as unknown as { default: Cache }).default.delete(cacheKey);
    // Also purge list pages that might include this business
    await (caches as unknown as { default: Cache }).default.delete('https://TimorUp.com/businesses');
  } catch (e) {
    // Log but don't fail the update if cache purge fails
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
    industry: z.string().optional(),
    contactName: z.string().optional(),
    contactNumber: z.string().optional(),
    countryCode: z.string().optional(),
    email: z.email({ error: 'Valid email required' }).optional().or(z.string().optional()),
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
    const db = await getDb();
if (!db) throw new Error("Database not available");

    try {
      // Authenticate
      const authApi = (await initAuth()).api;
      const cookieValue = cookies.get('better-auth.session_token')?.value || '';

      const session = await authApi.getSession({
        headers: { cookie: cookieValue ? `better-auth.session_token=${cookieValue}` : '' },
      });

      if (!session?.user) {
        return { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in to update a business' } };
      }

      const userId = session.user.id;

      // Check ownership
      const existing = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .limit(1)
        .get() ?? undefined;

      if (!existing) {
        return { success: false, error: { message: 'Business not found' } };
      }

      if (existing.ownerId !== userId) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to edit this business' } };
      }

      // Build update values
      const updateValues: Record<string, unknown> = {};
      if (input.title !== undefined) updateValues.title = input.title;
      if (input.newSlug !== undefined) updateValues.slug = input.newSlug;
      if (input.categoryId !== undefined) updateValues.categoryId = input.categoryId || null;
      if (input.industry !== undefined) updateValues.industry = input.industry || null;
      if (input.contactName !== undefined) updateValues.contactName = input.contactName || null;
      if (input.contactNumber !== undefined) updateValues.contactNumber = input.contactNumber || null;
      if (input.countryCode !== undefined) updateValues.countryCode = input.countryCode || '+670';
      if (input.email !== undefined) updateValues.email = input.email || null;
      if (input.address !== undefined) updateValues.address = input.address || null;
      if (input.aboutUs !== undefined) updateValues.aboutUs = input.aboutUs || null;
      if (input.tags !== undefined) updateValues.tags = JSON.stringify(input.tags);
      if (input.openingHours !== undefined) updateValues.openingHours = JSON.stringify(input.openingHours);
      if (input.latitude !== undefined) updateValues.locationLat = input.latitude || null;
      if (input.longitude !== undefined) updateValues.locationLng = input.longitude || null;
      if (input.yearOfEstablishment !== undefined) updateValues.yearOfEstablishment = input.yearOfEstablishment || null;
      if (input.registrationUrl !== undefined) updateValues.registrationUrl = input.registrationUrl || null;
      if (input.bannerImageId !== undefined) updateValues.bannerImageId = input.bannerImageId || null;
      if (input.profileImageId !== undefined) updateValues.profileImageId = input.profileImageId || null;
      if (input.socialLinks !== undefined) updateValues.socialLinks = JSON.stringify(input.socialLinks);

      if (Object.keys(updateValues).length > 0) {
        updateValues.updatedAt = Math.floor(Date.now() / 1000);
        await db.update(businesses)
          .set(updateValues)
          .where(eq(businesses.slug, input.slug))
          .run();

        await purgeCache(`/api/businesses/${input.slug}`);
      }

      const updated = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug))
        .limit(1)
        .get() ?? undefined;

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: { message: getErrorMessage(error) } };
    }
  },
});
