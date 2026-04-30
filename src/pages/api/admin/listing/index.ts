import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { businessPages } from '@/db/schema';
import { eq, and, like, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const createSchema = z.object({
  entityType: z.enum(['business', 'government', 'nonprofit']),
  title: z.string().min(1),
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
  openingHours: z.record(z.string(), z.string()).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  status: z.enum(['draft', 'live', 'suspended']).default('draft'),
  ownerId: z.string().optional(),
  // Image fields
  bannerImageId: z.string().optional(),
  profileImageId: z.string().optional(),
  // Organization fields
  verifiedBadge: z.boolean().optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  // Gallery
  photoGallery: z.array(z.string()).optional(),
  // Subscription
  planType: z.string().optional(),
  expiryDate: z.number().optional(),
});

// Generate slug from title
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${nanoid(6)}`;
}

export const GET: APIRoute = async ({ url }) => {
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
  const db = await getDb();
  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const slug = data.slug || generateSlug(data.title);

    const newListing = {
      id: nanoid(),
      title: data.title,
      slug,
      ownerId: data.ownerId || 'admin',
      entityType: data.entityType,
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
      // Image fields
      bannerImageId: data.bannerImageId || null,
      profileImageId: data.profileImageId || null,
      // Organization fields
      verifiedBadge: data.verifiedBadge || false,
      socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null,
      // Gallery
      photoGallery: data.photoGallery ? JSON.stringify(data.photoGallery) : null,
      // Subscription
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
