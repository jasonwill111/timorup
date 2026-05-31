// Astro Server Actions for Admin Listings Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';
import { listListings, createListing, updateListing, deleteListing } from '@/lib/db/queries/admin-listings';

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  listingType: z.enum(['job', 'product', 'service', 'vehicle', 'property', 'wanted']),
  categoryId: z.string().optional().nullable(),
  description: z.string().min(1),
  price: z.string().optional().nullable(),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']).optional().nullable(),
  location: z.string().optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  countryCode: z.string().default('+670'),
  email: z.email().optional().or(z.literal('')),
  tags: z.string().optional().nullable(),
  imageIds: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  ownerId: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string(),
});

const listSchema = z.object({
  listingType: z.enum(['job', 'product', 'service', 'vehicle', 'property', 'wanted']).optional(),
  status: z.enum(['draft', 'published']).optional(),
  search: z.string().optional(),
});

export const listings = {
  // List listings
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const listings = await listListings({
        listingType: input?.listingType,
        status: input?.status,
        search: input?.search,
      });

      return { success: true, data: listings };
    },
  }),

  // Create listing
  create: defineAction({
    input: createSchema,
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const result = await createListing({
        title: input.title,
        slug: input.slug,
        listingType: input.listingType,
        categoryId: input.categoryId,
        description: input.description,
        price: input.price,
        condition: input.condition,
        location: input.location,
        locationLat: input.locationLat,
        locationLng: input.locationLng,
        contactName: input.contactName,
        contactNumber: input.contactNumber,
        countryCode: input.countryCode,
        email: input.email || undefined,
        tags: input.tags,
        imageIds: input.imageIds,
        status: input.status,
        ownerId: input.ownerId || authResult.userId,
      });

      return { success: true, data: result };
    },
  }),

  // Update listing
  update: defineAction({
    input: updateSchema,
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      const { id, ...data } = input;
      await updateListing({ id, ...data });

      return { success: true };
    },
  }),

  // Delete listing
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input, { cookies }) => {
      const authResult = await requireAdmin(cookies);
      if ('error' in authResult) return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');

      await deleteListing(input.id);

      return { success: true };
    },
  }),
};