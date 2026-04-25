// Businesses API - Create new business or organization
export const prerender = false;

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { hasUserBusiness } from '@/lib/business-logic';
import { businessPages, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  try {
    // 1. Authenticate via better-auth session
    const cookieHeader = request.headers.get('cookie') || '';
    const session = await auth.api.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!session?.user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in to create a page' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      title, slug, categoryId, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude, entityType, organizationType, registrationUrl,
      publishNow
    } = body;

    // Determine if this is an organization
    const isOrganization = entityType === 'organization';

    // 2. Check one-page-per-user limit (by entity type)
    // Users can have one business AND one organization
    const existingBusiness = await hasUserBusiness(db, userId);
    if (existingBusiness) {
      // Allow if user is creating org and has business, or vice versa
      if (existingBusiness.entityType !== entityType) {
        const existingType = existingBusiness.entityType === 'organization' ? 'organization' : 'business';
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'LIMIT_REACHED', message: `You already have a ${existingType}. You can only create one of each type.` }
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'LIMIT_REACHED', message: 'You can only create one page of this type' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Validate required fields
    if (!title) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Title is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (isOrganization && !organizationType) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Organization type is required' }
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
      entityType: entityType || 'business',
      organizationType: isOrganization ? organizationType : null,
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
      status: pageStatus,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, slug: businessSlug, entityType: entityType || 'business' }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create page error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create page' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
