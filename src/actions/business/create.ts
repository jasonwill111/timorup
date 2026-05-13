// Business Server Action - Create
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthenticatedUserFromCookies } from '@/lib/db/queries/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const create = defineAction({
  accept: 'form',
  input: z.object({
    title: z.string().min(1, 'Title is required'),
    categoryId: z.string().min(1, 'Category is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    contactNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Valid email required'),
    slug: z.string().optional(),
    address: z.string().optional(),
    aboutUs: z.string().optional(),
    tags: z.string().optional(), // JSON string
    openingHours: z.string().optional(), // JSON string
    locationLat: z.number().optional(),
    locationLng: z.number().optional(),
    registrationUrl: z.string().url().optional().or(z.string().optional()),
    industry: z.string().optional(),
    yearOfEstablishment: z.number().optional(),
    socialLinks: z.string().optional(), // JSON string
    countryCode: z.string().optional(),
    publishNow: z.boolean().optional(),
  }),
  handler: async (input, { cookies }) => {
    const authResult = await getAuthenticatedUserFromCookies(cookies);
    if ('error' in authResult) {
      return { success: false, error: { code: authResult.error, message: 'Authentication required' } };
    }

    const userId = authResult.userId;
    const db = await getDb();

    try {
      // Check one-listing-per-user limit
      const existingListing = await db.select()
        .from(businesses)
        .where(eq(businesses.ownerId, userId))
        .limit(1)
        .get();

      if (existingListing) {
        return {
          success: false,
          error: {
            code: 'LIMIT_REACHED',
            message: 'You already have a listing. Each account can only create one listing.'
          }
        };
      }

      // Generate slug
      const businessSlug = input.slug || input.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

      // Check slug uniqueness
      const existingSlug = await db.select()
        .from(businesses)
        .where(eq(businesses.slug, businessSlug))
        .limit(1)
        .get();

      if (existingSlug) {
        return {
          success: false,
          error: { message: 'A page with this name already exists. Please choose a different name.' }
        };
      }

      // Parse optional JSON fields
      const parsedTags = input.tags ? JSON.parse(input.tags) : null;
      const parsedOpeningHours = input.openingHours ? JSON.parse(input.openingHours) : null;
      const parsedSocialLinks = input.socialLinks ? JSON.parse(input.socialLinks) : null;

      const id = `biz-${Date.now()}`;

      // Set initial status - pending_payment (requires subscription)
      const pageStatus = 'pending_payment';

      await db.insert(businesses).values({
        id,
        title: input.title,
        slug: businessSlug,
        ownerId: userId,
        categoryId: input.categoryId,
        industry: input.industry || null,
        contactName: input.contactName,
        contactNumber: input.contactNumber,
        countryCode: input.countryCode || '+670',
        email: input.email,
        address: input.address || null,
        aboutUs: input.aboutUs || null,
        tags: parsedTags ? JSON.stringify(parsedTags) : null,
        openingHours: parsedOpeningHours ? JSON.stringify(parsedOpeningHours) : null,
        locationLat: input.locationLat || null,
        locationLng: input.locationLng || null,
        registrationUrl: input.registrationUrl || null,
        yearOfEstablishment: input.yearOfEstablishment || null,
        bannerImageId: null,
        profileImageId: null,
        socialLinks: parsedSocialLinks ? JSON.stringify(parsedSocialLinks) : null,
        status: pageStatus,
        subscriptionStatus: 'none',
      }).run();

      return { success: true, data: { id, title: input.title, slug: businessSlug } };
    } catch (error) {
      console.error('Create page error:', error);
      return { success: false, error: { message: getErrorMessage(error) || 'Failed to create page' } };
    }
  },
});