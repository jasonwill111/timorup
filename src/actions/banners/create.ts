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
  linkUrl: z.string().optional().nullable(),    // slug for linking
  linkType: z.enum(['business', 'listing', 'product']).optional().default('business'),
  position: z.enum(['homepage', 'businesses', 'products-services', 'listings']).optional().default('homepage'),
  sortOrder: z.number().optional().default(0),
  orderId: z.string().optional().nullable(),     // FK to orders (paid banners)
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
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    try {
      const [newBanner] = await db.insert(adBanners).values({
        title: input.title,
        description: input.description || null,
        imageId: input.imageId || null,
        linkUrl: input.linkUrl || null,
        linkType: input.linkType || 'business',
        position: input.position || 'homepage',
        sortOrder: input.sortOrder || 0,
        orderId: input.orderId || null,
        isActive: input.isActive ?? true,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
      }).returning().get() ?? undefined;

      return { success: true, data: newBanner };
    } catch (error) {
      return { success: false, error: { code: 'CREATE_ERROR', message: getErrorMessage(error) } };
    }
  },
});