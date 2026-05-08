// Businesses API - Create new listing (business/government/nonprofit)
export const prerender = false;

import { getDb } from '@/lib/db';
import { sessions, users, businessPages, media } from '@/db/schema';
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

    // Parse body (supports both JSON and FormData)
    let body: Record<string, unknown>;
    let uploadedImageIds: { banner?: string; profile?: string; gallery: string[] } = { gallery: [] };

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      // Handle file uploads
      const bannerFile = formData.get('bannerImage') as File | null;
      const profileFile = formData.get('profileImage') as File | null;
      const galleryFiles = formData.getAll('galleryImages') as File[];

      // TODO: Upload files to R2 and get media IDs
      // For now, we'll handle this after media upload is implemented
      if (bannerFile?.size) {
        // Placeholder for banner upload
        console.log('Banner file:', bannerFile.name, bannerFile.size);
      }
      if (profileFile?.size) {
        // Placeholder for profile upload
        console.log('Profile file:', profileFile.name, profileFile.size);
      }
      if (galleryFiles.length > 0) {
        // Placeholder for gallery upload
        console.log('Gallery files:', galleryFiles.length);
      }

      // Convert formData to plain object
      body = {};
      formData.forEach((value, key) => {
        if (key !== 'bannerImage' && key !== 'profileImage' && key !== 'galleryImages') {
          body[key] = value;
        }
      });
    } else {
      body = await request.json();
    }

    const {
      title, slug, categoryId, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      locationLat, locationLng, entityType, registrationUrl,
      publishNow, industry, yearOfEstablishment, socialLinks
    } = body as Record<string, string | boolean | number | null>;

    // Validate entity type (accept both 'nonprofit' and 'non-profit', store as 'nonprofit')
    const validTypes = ['business', 'nonprofit', 'non-profit'];
    const rawType = entityType as string;
    const finalEntityType = validTypes.includes(rawType) ? (rawType === 'non-profit' ? 'nonprofit' : rawType) : 'business';

    // 2. Check one-listing-per-user limit
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

    if (!categoryId) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Category is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!contactName) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Contact name is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!contactNumber) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Phone number is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Email is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. Check slug uniqueness
    const businessSlug = slug || (title as string).toLowerCase()
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
        error: { message: 'A page with this name already exists. Please choose a different name.' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Parse optional fields
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags as string) : tags) : null;
    const parsedOpeningHours = openingHours ? (typeof openingHours === 'string' ? JSON.parse(openingHours as string) : openingHours) : null;
    const parsedSocialLinks = socialLinks ? (typeof socialLinks === 'string' ? JSON.parse(socialLinks as string) : socialLinks) : null;

    const id = `biz-${Date.now()}`;

    // 4. Set initial status based on entity type
    // - nonprofit: immediate publish (free, no payment needed)
    // - business: pending_payment (requires subscription + admin confirmation)
    let pageStatus: string;
    if (finalEntityType === 'nonprofit') {
      pageStatus = 'live'; // Non-profits go live immediately
    } else {
      pageStatus = 'pending_payment'; // Businesses require subscription
    }

    await db.insert(businessPages).values({
      id,
      title: title as string,
      slug: businessSlug,
      ownerId: userId,
      categoryId: categoryId as string || null,
      entityType: finalEntityType,
      industry: industry as string || null,
      contactName: contactName as string || null,
      contactNumber: contactNumber as string || null,
      countryCode: countryCode as string || '+670',
      email: email as string || null,
      address: address as string || null,
      aboutUs: aboutUs as string || null,
      tags: parsedTags ? JSON.stringify(parsedTags) : null,
      openingHours: parsedOpeningHours ? JSON.stringify(parsedOpeningHours) : null,
      locationLat: locationLat ? parseFloat(String(locationLat)) : null,
      locationLng: locationLng ? parseFloat(String(locationLng)) : null,
      registrationUrl: registrationUrl as string || null,
      yearOfEstablishment: yearOfEstablishment ? parseInt(String(yearOfEstablishment), 10) : null,
      bannerImageId: uploadedImageIds.banner || null,
      profileImageId: uploadedImageIds.profile || null,
      socialLinks: parsedSocialLinks ? JSON.stringify(parsedSocialLinks) : null,
      status: pageStatus,
      subscriptionStatus: 'none', // Initialize subscription status
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