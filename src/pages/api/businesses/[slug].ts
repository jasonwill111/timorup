// API endpoint to get single business by slug (GET) and update it (PUT)
export const prerender = false;

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { businessPages, categories, products, reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let categoryName = 'Business';
    if (business.categoryId) {
      const cat = await db.select()
        .from(categories)
        .where(eq(categories.id, business.categoryId))
        .limit(1)
        .get();
      if (cat) {
        categoryName = cat.name;
      }
    }

    const businessProducts = await db.select()
      .from(products)
      .where(eq(products.businessPageId, business.id))
      .all();

    const businessReviews = await db.select()
      .from(reviews)
      .where(eq(reviews.businessPageId, business.id))
      .orderBy(desc(reviews.createdAt))
      .all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...business,
        categoryName,
        products: businessProducts,
        reviews: businessReviews,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error.message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT({ params, request }: { params: { slug: string }; request: Request }) {
  try {
    const { slug } = params;

    const cookieHeader = request.headers.get('cookie') || '';
    const session = await auth.api.getSession({
      headers: { cookie: cookieHeader },
    });

    if (!session?.user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in to update a business' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = session.user.id;

    const existing = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    if (existing.ownerId !== userId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to edit this business' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const {
      title, slug: newSlug, categoryId, contactName, contactNumber,
      countryCode, email, address, aboutUs, tags, openingHours,
      latitude, longitude, yearOfEstablishment, latestUpdates
    } = body;

    const updateValues: Record<string, unknown> = {};
    if (title !== undefined) updateValues.title = title;
    if (newSlug !== undefined) updateValues.slug = newSlug;
    if (categoryId !== undefined) updateValues.categoryId = categoryId || null;
    if (contactName !== undefined) updateValues.contactName = contactName || null;
    if (contactNumber !== undefined) updateValues.contactNumber = contactNumber || null;
    if (countryCode !== undefined) updateValues.countryCode = countryCode || '+670';
    if (email !== undefined) updateValues.email = email || null;
    if (address !== undefined) updateValues.address = address || null;
    if (aboutUs !== undefined) updateValues.aboutUs = aboutUs || null;
    if (tags !== undefined) updateValues.tags = Array.isArray(tags) ? JSON.stringify(tags) : (tags || null);
    if (openingHours !== undefined) updateValues.openingHours = openingHours ? JSON.stringify(openingHours) : null;
    if (latitude !== undefined) updateValues.locationLat = latitude || null;
    if (longitude !== undefined) updateValues.locationLng = longitude || null;
    if (yearOfEstablishment !== undefined) updateValues.yearOfEstablishment = yearOfEstablishment || null;
    if (latestUpdates !== undefined) updateValues.latestUpdates = latestUpdates || null;

    if (Object.keys(updateValues).length > 0) {
      updateValues.updatedAt = Math.floor(Date.now() / 1000);
      await db.update(businessPages)
        .set(updateValues)
        .where(eq(businessPages.slug, slug))
        .run();
    }

    const updated = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

    return new Response(JSON.stringify({
      success: true,
      data: updated
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error.message }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
