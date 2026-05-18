// Astro Server Actions for Admin Heroes (Banners) Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

const CreateHeroSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  imageId: z.string().optional().nullable(),
  ctaLink: z.string().optional().default(''),
  linkType: z.enum(['business', 'listing', 'product']).optional(),
  position: z.enum(['homepage', 'businesses', 'products-services', 'listings']).optional(),
  sortOrder: z.number().int().optional().default(0),
});

const UpdateHeroSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageId: z.string().optional().nullable(),
  ctaLink: z.string().optional(),
  linkType: z.enum(['business', 'listing', 'product']).optional(),
  position: z.enum(['homepage', 'businesses', 'products-services', 'listings']).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const heroes = {
  // List all heroes
  list: defineAction({
    handler: async () => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const heroList = await db.select().from(adBanners).orderBy(desc(adBanners.createdAt)).all();

      return { success: true, data: heroList };
    },
  }),

  // Create hero
  create: defineAction({
    input: CreateHeroSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const id = `hero-${Date.now()}`;

      await db.insert(adBanners).values({
        id,
        title: input.title,
        description: input.description || null,
        imageId: input.imageId || null,
        linkUrl: input.ctaLink || null,
        linkType: input.linkType || 'business',
        position: input.position || 'homepage',
        sortOrder: input.sortOrder || 0,
        isActive: 1,
      }).run();

      return { success: true, data: { id, title: input.title } };
    },
  }),

  // Update hero
  update: defineAction({
    input: UpdateHeroSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.imageId !== undefined) updateData.imageId = input.imageId;
      if (input.ctaLink !== undefined) updateData.linkUrl = input.ctaLink;
      if (input.linkType !== undefined) updateData.linkType = input.linkType;
      if (input.position !== undefined) updateData.position = input.position;
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      if (input.isActive !== undefined) updateData.isActive = input.isActive ? 1 : 0;

      await db.update(adBanners)
        .set(updateData)
        .where(eq(adBanners.id, input.id))
        .run();

      return { success: true };
    },
  }),

  // Delete hero
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      await db.delete(adBanners).where(eq(adBanners.id, input.id)).run();

      return { success: true, message: 'Hero deleted' };
    },
  }),
};