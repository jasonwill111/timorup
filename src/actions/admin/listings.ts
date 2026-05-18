// Astro Server Actions for Admin Listings Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { listings as listingsTable } from '@/db/schema';
import { eq, and, like } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getAdminUser } from '@/lib/admin-auth';

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
  email: z.string().email().optional().or(z.literal('')),
  tags: z.string().optional().nullable(), // JSON string
  imageIds: z.string().optional().nullable(), // JSON string
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

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${nanoid(6)}`;
}

export const listings = {
  // List listings
  list: defineAction({
    input: listSchema.optional(),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      let query = db.select().from(listingsTable);
      const conditions = [];

      if (input?.listingType) {
        conditions.push(eq(listingsTable.listingType, input.listingType));
      }
      if (input?.status) {
        conditions.push(eq(listingsTable.status, input.status));
      }
      if (input?.search) {
        conditions.push(like(listingsTable.title, `%${input.search}%`));
      }

      const allListings = conditions.length > 0
        ? await query.where(and(...conditions)).all()
        : await query.all();

      return { success: true, data: allListings };
    },
  }),

  // Create listing
  create: defineAction({
    input: createSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const slug = input.slug || generateSlug(input.title);
      const id = nanoid();
      const now = Math.floor(Date.now() / 1000);

      // Calculate expiresAt (3 days from now)
      const expiresAt = now + 3 * 24 * 60 * 60;

      const newListing = {
        id,
        title: input.title,
        slug,
        ownerId: input.ownerId || user.id,
        listingType: input.listingType,
        categoryId: input.categoryId || null,
        description: input.description,
        price: input.price || null,
        condition: input.condition || null,
        location: input.location || null,
        locationLat: input.locationLat || null,
        locationLng: input.locationLng || null,
        contactName: input.contactName || null,
        contactNumber: input.contactNumber || null,
        countryCode: input.countryCode,
        email: input.email || null,
        tags: input.tags || null,
        imageIds: input.imageIds || null,
        status: input.status,
        likes: 0,
        saves: 0,
        views: 0,
        createdAt: now,
        updatedAt: now,
        expiresAt,
        lastRenewedAt: now,
      };

      await db.insert(listingsTable).values(newListing);

      return { success: true, data: { id: newListing.id, slug } };
    },
  }),

  // Update listing
  update: defineAction({
    input: updateSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const { id, ...data } = input;

      const updateData: Record<string, unknown> = { updatedAt: Math.floor(Date.now() / 1000) };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.listingType !== undefined) updateData.listingType = data.listingType;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.condition !== undefined) updateData.condition = data.condition;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.locationLat !== undefined) updateData.locationLat = data.locationLat;
      if (data.locationLng !== undefined) updateData.locationLng = data.locationLng;
      if (data.contactName !== undefined) updateData.contactName = data.contactName;
      if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
      if (data.countryCode !== undefined) updateData.countryCode = data.countryCode;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.imageIds !== undefined) updateData.imageIds = data.imageIds;
      if (data.status !== undefined) updateData.status = data.status;

      await db.update(listingsTable)
        .set(updateData)
        .where(eq(listingsTable.id, id))
        .run();

      return { success: true };
    },
  }),

  // Delete listing
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      await db.delete(listingsTable).where(eq(listingsTable.id, input.id)).run();

      return { success: true };
    },
  }),
};