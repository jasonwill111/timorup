// Banners Create Server Action
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { getAdminUser } from '@/lib/admin-auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const CreateBannerSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  linkedBusinessPageId: z.string().optional().nullable(),
  externalUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const createBanner = defineAction({
  input: CreateBannerSchema,
  handler: async (input, { request }) => {
    const user = await getAdminUser(request);
    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } };
    }

    const db = await getDb();
    try {
      const [newBanner] = await db.insert(adBanners).values({
        title: input.title,
        description: input.description || null,
        imageId: input.imageId || null,
        linkedBusinessPageId: input.linkedBusinessPageId || null,
        externalUrl: input.externalUrl || null,
        isActive: input.isActive ?? true,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
      }).returning().get();

      return { success: true, data: newBanner };
    } catch (error) {
      return { success: false, error: { code: 'CREATE_ERROR', message: getErrorMessage(error) } };
    }
  },
});