// Banners Update Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';
import { createErrorResponse, ErrorCode } from '@/lib/errors';


const UpdateBannerSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  linkType: z.enum(['business', 'listing', 'product']).optional(),
  position: z.enum(['homepage', 'businesses', 'products-services', 'listings']).optional(),
  sortOrder: z.number().optional(),
  orderId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const updateBanner = defineAction({
  input: UpdateBannerSchema,
  handler: async (input, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();
if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");
    try {
      const updated = await db.update(adBanners)
        .set({
          title: input.title,
          description: input.description,
          imageId: input.imageId,
          linkUrl: input.linkUrl,
          linkType: input.linkType,
          position: input.position,
          sortOrder: input.sortOrder,
          orderId: input.orderId,
          isActive: input.isActive !== undefined ? (input.isActive ? 1 : 0) : undefined,
          startDate: input.startDate ? Math.floor(new Date(input.startDate).getTime() / 1000) : undefined,
          endDate: input.endDate ? Math.floor(new Date(input.endDate).getTime() / 1000) : undefined,
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(adBanners.id, input.id))
        .returning()
        .get() ?? undefined;

      if (!updated) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Banner not found' } };
      }

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: { code: 'UPDATE_ERROR', message: getErrorMessage(error) } };
    }
  },
});

export const deleteBanner = defineAction({
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();
if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");
    try {
      await db.delete(adBanners).where(eq(adBanners.id, id)).run();
      return { success: true };
    } catch (error) {
      return { success: false, error: { code: 'DELETE_ERROR', message: getErrorMessage(error) } };
    }
  },
});