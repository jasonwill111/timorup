// Businesses API - Create new business
export const prerender = false;

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { hasUserBusiness } from '@/lib/business-logic';
import { businessPages, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  try {
    // 1. Authenticate via better-auth session (security fix for BS-013)
    const cookieHeader = request.headers.get('cookie') || '';
    const session = await auth.api.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!session?.user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in to create a business' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      title, slug, categoryId, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude
    } = body;

    // 2. Check one-business-per-user limit
    const existingBusiness = await hasUserBusiness(db, userId);
    if (existingBusiness) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'LIMIT_REACHED', message: 'You can only create one business page' }
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
        error: { message: 'Business with this name already exists' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const id = `biz-${Date.now()}`;
    await db.insert(businessPages).values({
      id,
      title,
      slug: businessSlug,
      ownerId: userId,
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
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, slug: businessSlug }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create business error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create business' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
