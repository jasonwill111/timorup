// Businesses API - Create new business
export const prerender = false;

import { db } from '@/lib/db';
import { businessPages, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { 
      title, slug, ownerId, categoryId, contactName, contactNumber, 
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude 
    } = body;

    // Validate required fields
    if (!title || !ownerId) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Title and owner are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check owner exists
    const owner = await db.select()
      .from(users)
      .where(eq(users.id, ownerId))
      .limit(1);

    if (owner.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Owner not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Generate slug if not provided
    const businessSlug = slug || title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    // Check slug uniqueness
    const existing = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, businessSlug))
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business with this name already exists' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const id = `biz-${Date.now()}`;
    const newBusiness = await db.insert(businessPages).values({
      id,
      title,
      slug: businessSlug,
      ownerId,
      categoryId: categoryId || null,
      contactName: contactName || null,
      contactNumber: contactNumber || null,
      countryCode: countryCode || '+670',
      email: email || null,
      address: address || null,
      aboutUs: aboutUs || null,
      tags: tags ? JSON.stringify(tags) : null,
      openingHours: openingHours ? JSON.stringify(openingHours) : null,
      locationLat: latitude || null,
      locationLng: longitude || null,
      status: 'draft',
    }).returning();

    return new Response(JSON.stringify({
      success: true,
      data: newBusiness[0]
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create business error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create business' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
