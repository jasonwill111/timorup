// Banners Update Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const UpdateBannerSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  linkedBusinessPageId: z.string().optional().nullable(),
  externalUrl: z.string().optional().nullable(),
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
    try {
      const updated = await db.update(adBanners)
        .set({
          title: input.title,
          description: input.description,
          imageId: input.imageId,
          linkedBusinessPageId: input.linkedBusinessPageId,
          externalUrl: input.externalUrl,
          isActive: input.isActive,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(adBanners.id, input.id))
        .returning()
        .get();

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
  handler: async (_, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();
    try {
      await db.delete(adBanners).where(eq(adBanners.id, input.id)).run();
      return { success: true };
    } catch (error) {
      return { success: false, error: { code: 'DELETE_ERROR', message: getErrorMessage(error) } };
    }
  },
});