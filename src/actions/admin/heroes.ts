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
  ctaText: z.string().optional().default(''),
  ctaLink: z.string().optional().default(''),
  order: z.number().int().optional().default(0),
});

const UpdateHeroSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageId: z.string().optional().nullable(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number().int().optional(),
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
if (!db) throw new Error("Database not available");
      const id = `hero-${Date.now()}`;

      await db.insert(adBanners).values({
        id,
        title: input.title,
        description: input.description,
        imageId: input.imageId || null,
        ctaText: input.ctaText,
        ctaLink: input.ctaLink,
        order: input.order,
        isActive: true,
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
if (!db) throw new Error("Database not available");

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.imageId !== undefined) updateData.imageId = input.imageId;
      if (input.ctaText !== undefined) updateData.ctaText = input.ctaText;
      if (input.ctaLink !== undefined) updateData.ctaLink = input.ctaLink;
      if (input.order !== undefined) updateData.order = input.order;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

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
if (!db) throw new Error("Database not available");
      await db.delete(adBanners).where(eq(adBanners.id, input.id)).run();

      return { success: true, message: 'Hero deleted' };
    },
  }),
};