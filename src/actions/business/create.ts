import { getErrorMessage } from '@/lib/errors';
// Business Server Action - Create
import { defineAction } from 'astro:actions';
import * as z from 'zod';
import { getAuthenticatedUserFromCookies } from '@/lib/db/queries/auth';
import { getBusinessByOwner, slugExists, createBusiness } from '@/lib/db/queries/businesses';
import { emailSchema, requiredString } from '@/lib/schemas/common';


export const create = defineAction({
  accept: 'form',
  input: z.object({
    title: requiredString('Title is required'),
    categoryId: requiredString('Category is required'),
    contactName: requiredString('Contact name is required'),
    contactNumber: requiredString('Phone number is required'),
    email: emailSchema,
    slug: z.string().optional(),
    address: z.string().optional(),
    aboutUs: z.string().optional(),
    tags: z.string().optional(),
    openingHours: z.string().optional(),
    locationLat: z.number().optional(),
    locationLng: z.number().optional(),
    registrationUrl: z.string().url().optional().or(z.string().optional()),

    yearOfEstablishment: z.number().optional(),
    socialLinks: z.string().optional(),
    countryCode: z.string().optional(),
    publishNow: z.boolean().optional(),
  }),
  handler: async (input, { cookies }) => {
    const authResult = await getAuthenticatedUserFromCookies(cookies);
    if ('error' in authResult) {
      return { success: false, error: { code: authResult.error, message: 'Authentication required' } };
    }

    const userId = authResult.userId;

    try {
      // Check one-listing-per-user limit via query layer
      const existingListing = await getBusinessByOwner(userId);
      if (existingListing) {
        return {
          success: false,
          error: {
            code: 'LIMIT_REACHED',
            message: 'You already have a listing. Each account can only create one listing.'
          }
        };
      }

      // Generate slug and check uniqueness via query layer
      const businessSlug = input.slug || input.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

      const slugInUse = await slugExists(businessSlug);
      if (slugInUse) {
        return {
          success: false,
          error: { message: 'A page with this name already exists. Please choose a different name.' }
        };
      }

      // Parse optional JSON fields (with error handling)
      let parsedTags: unknown = null;
      let parsedOpeningHours: unknown = null;
      let parsedSocialLinks: unknown = null;

      if (input.tags) {
        try {
          parsedTags = JSON.parse(input.tags);
        } catch (e) {
          console.warn('[Business:create] Invalid tags format:', e instanceof Error ? e.message : String(e));
          return { success: false, error: { code: 'INVALID_JSON', message: 'Invalid tags format' } };
        }
      }
      if (input.openingHours) {
        try {
          parsedOpeningHours = JSON.parse(input.openingHours);
        } catch (e) {
          console.warn('[Business:create] Invalid opening hours format:', e instanceof Error ? e.message : String(e));
          return { success: false, error: { code: 'INVALID_JSON', message: 'Invalid opening hours format' } };
        }
      }
      if (input.socialLinks) {
        try {
          parsedSocialLinks = JSON.parse(input.socialLinks);
        } catch (e) {
          console.warn('[Business:create] Invalid social links format:', e instanceof Error ? e.message : String(e));
          return { success: false, error: { code: 'INVALID_JSON', message: 'Invalid social links format' } };
        }
      }

      // Create via query layer
      const result = await createBusiness({
        title: input.title,
        slug: businessSlug,
        ownerId: userId,
        categoryId: input.categoryId,
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
        socialLinks: parsedSocialLinks ? JSON.stringify(parsedSocialLinks) : null,
        status: 'pending_payment',  // requires subscription
        subscriptionStatus: 'none',
      });

      return { success: true, data: result };
    } catch (error) {
      console.error('Create page error:', error);
      return { success: false, error: { message: getErrorMessage(error) || 'Failed to create page' } };
    }
  },
});