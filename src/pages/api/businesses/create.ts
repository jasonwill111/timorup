// Businesses API - Create new listing (business/government/nonprofit)
export const prerender = false;

import { getDb } from '@/lib/db';
import { sessions, users, businessPages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  try {
    // 1. Authenticate via session cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);

    if (!tokenMatch) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in to create a page' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Find session by token
    const session = await db.select()
      .from(sessions)
      .where(eq(sessions.token, tokenMatch[1]))
      .limit(1)
      .get();

    if (!session || !session.expiresAt || new Date(session.expiresAt) < new Date()) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Get user
    const user = await db.select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .get();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not found' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = user.id;
    const body = await request.json();
    const {
      title, slug, categoryId, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude, entityType, registrationUrl,
      publishNow, industry, yearOfEstablishment
    } = body;

    // Validate entity type
    const validTypes = ['business', 'government', 'nonprofit'];
    const finalEntityType = validTypes.includes(entityType) ? entityType : 'business';

    // 2. Check one-listing-per-user limit
    // Each user can only have ONE listing (any type)
    const existingListing = await db.select()
      .from(businessPages)
      .where(eq(businessPages.ownerId, userId))
      .limit(1)
      .get();

    if (existingListing) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'LIMIT_REACHED',
          message: `You already have a ${existingListing.entityType} listing. Each account can only create one listing.`
        }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Validate required fields
    if (!title) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Title is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. Check slug uniqueness
    const businessSlug = slug || title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    const existingSlug = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, businessSlug))
      .limit(1)
      .get();

    if (existingSlug) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'A page with this name already exists' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const id = `biz-${Date.now()}`;
    const pageStatus = publishNow ? 'live' : 'draft';

    await db.insert(businessPages).values({
      id,
      title,
      slug: businessSlug,
      ownerId: userId,
      categoryId: categoryId || null,
      entityType: finalEntityType,
      industry: industry || null,
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
      registrationUrl: registrationUrl || null,
      yearOfEstablishment: yearOfEstablishment || null,
      status: pageStatus,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, slug: businessSlug, entityType: finalEntityType }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create page error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create page' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
