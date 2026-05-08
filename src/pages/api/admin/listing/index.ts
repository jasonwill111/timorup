// Admin API - Listings Management
import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { businessPages } from '@/db/schema';
import { eq, and, like, or, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

const createSchema = z.object({
  entityType: z.enum(['business', 'government', 'nonprofit', 'non-profit']),
  title: z.string().min(1, { error: 'Title is required' }),
  slug: z.string().optional(),
  categoryId: z.string().optional(),
  industry: z.string().optional(),
  contactName: z.string().optional(),
  countryCode: z.string().default('+670'),
  contactNumber: z.string().optional(),
  email: z.email().optional().or(z.literal('')),
  registrationUrl: z.string().optional().or(z.literal('')),
  address: z.string().optional(),
  aboutUs: z.string().optional(),
  tags: z.array(z.string()).optional(),
  yearOfEstablishment: z.number().optional(),
  openingHours: z.record(z.string(), z.object({
    open: z.string(),
    close: z.string(),
  })).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  status: z.enum(['draft', 'live', 'suspended']).default('draft'),
  ownerId: z.string().optional(),
  bannerImageId: z.string().optional(),
  profileImageId: z.string().optional(),
  verifiedBadge: z.boolean().optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  photoGallery: z.array(z.string()).optional(),
  planType: z.string().optional(),
  expiryDate: z.number().optional(),
});

const updateSchema = createSchema.partial();

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${nanoid(6)}`;
}

export const GET: APIRoute = async ({ url, request }) => {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  const entityType = url.searchParams.get('entityType');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  let query = db.select().from(businessPages);
  const conditions = [];

  if (entityType) {
    conditions.push(eq(businessPages.entityType, entityType));
  }
  if (status) {
    conditions.push(eq(businessPages.status, status));
  }
  if (search) {
    conditions.push(like(businessPages.title, `%${search}%`));
  }

  const listings = conditions.length > 0
    ? await query.where(and(...conditions)).all()
    : await query.all();

  return new Response(JSON.stringify({ success: true, data: listings }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const slug = data.slug || generateSlug(data.title);
    // Normalize entityType: 'non-profit' -> 'nonprofit'
    const normalizedEntityType = data.entityType === 'non-profit' ? 'nonprofit' : data.entityType;

    const newListing = {
      id: nanoid(),
      title: data.title,
      slug,
      ownerId: data.ownerId || user.id,
      entityType: normalizedEntityType,
      categoryId: data.categoryId || null,
      industry: data.industry || null,
      contactName: data.contactName || null,
      countryCode: data.countryCode,
      contactNumber: data.contactNumber || null,
      email: data.email || null,
      registrationUrl: data.registrationUrl || null,
      address: data.address || null,
      aboutUs: data.aboutUs || null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      yearOfEstablishment: data.yearOfEstablishment || null,
      openingHours: data.openingHours ? JSON.stringify(data.openingHours) : null,
      locationLat: data.locationLat || null,
      locationLng: data.locationLng || null,
      status: data.status,
      bannerImageId: data.bannerImageId || null,
      profileImageId: data.profileImageId || null,
      verifiedBadge: data.verifiedBadge || false,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null,
      photoGallery: data.photoGallery ? JSON.stringify(data.photoGallery) : null,
      planType: data.planType || null,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    };

    await db.insert(businessPages).values(newListing);

    return new Response(JSON.stringify({ id: newListing.id, slug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.error('Error creating listing:', error);
    return new Response(JSON.stringify({ error: 'Failed to create listing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const validated = updateSchema.parse(data);

    const updateData: Record<string, unknown> = {};
    if (validated.entityType !== undefined) updateData.entityType = validated.entityType;
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.slug !== undefined) updateData.slug = validated.slug;
    if (validated.categoryId !== undefined) updateData.categoryId = validated.categoryId;
    if (validated.industry !== undefined) updateData.industry = validated.industry;
    if (validated.contactName !== undefined) updateData.contactName = validated.contactName;
    if (validated.countryCode !== undefined) updateData.countryCode = validated.countryCode;
    if (validated.contactNumber !== undefined) updateData.contactNumber = validated.contactNumber;
    if (validated.email !== undefined) updateData.email = validated.email;
    if (validated.registrationUrl !== undefined) updateData.registrationUrl = validated.registrationUrl;
    if (validated.address !== undefined) updateData.address = validated.address;
    if (validated.aboutUs !== undefined) updateData.aboutUs = validated.aboutUs;
    if (validated.tags !== undefined) updateData.tags = JSON.stringify(validated.tags);
    if (validated.yearOfEstablishment !== undefined) updateData.yearOfEstablishment = validated.yearOfEstablishment;
    if (validated.openingHours !== undefined) updateData.openingHours = JSON.stringify(validated.openingHours);
    if (validated.locationLat !== undefined) updateData.locationLat = validated.locationLat;
    if (validated.locationLng !== undefined) updateData.locationLng = validated.locationLng;
    if (validated.status !== undefined) updateData.status = validated.status;
    if (validated.bannerImageId !== undefined) updateData.bannerImageId = validated.bannerImageId;
    if (validated.profileImageId !== undefined) updateData.profileImageId = validated.profileImageId;
    if (validated.verifiedBadge !== undefined) updateData.verifiedBadge = validated.verifiedBadge;
    if (validated.socialLinks !== undefined) updateData.socialLinks = JSON.stringify(validated.socialLinks);
    if (validated.photoGallery !== undefined) updateData.photoGallery = JSON.stringify(validated.photoGallery);
    if (validated.planType !== undefined) updateData.planType = validated.planType;
    if (validated.expiryDate !== undefined) updateData.expiryDate = new Date(validated.expiryDate);

    await db.update(businessPages)
      .set(updateData)
      .where(eq(businessPages.id, id))
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    return new Response(JSON.stringify({ error: 'Failed to update listing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const db = await getDb();
  await db.delete(businessPages).where(eq(businessPages.id, id)).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};