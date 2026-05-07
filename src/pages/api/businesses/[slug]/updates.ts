// API: Business Updates (News)
export const prerender = false;

import { getDb } from '@/lib/db';
import { businessPages, businessUpdates } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/businesses/:slug/updates - List updates for a business
export async function GET({ params, url }: { params: { slug: string }; url: URL }) {
  const db = await getDb();
  const { slug } = params;

  try {
    // Get business by slug
    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .get();

    if (!business) {
      return new Response(JSON.stringify({ success: false, error: 'Business not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get updates (max 4, newest first)
    const updates = await db.select()
      .from(businessUpdates)
      .where(eq(businessUpdates.businessId, business.id))
      .orderBy(desc(businessUpdates.createdAt))
      .limit(4)
      .all();

    // Parse images JSON
    const updatesWithImages = updates.map(u => ({
      ...u,
      images: u.images ? JSON.parse(u.images) : [],
    }));

    return new Response(JSON.stringify({
      success: true,
      updates: updatesWithImages,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/businesses/:slug/updates - Create new update
export async function POST({ params, request }: { params: { slug: string }; request: Request }) {
  const db = await getDb();
  const { slug } = params;

  try {
    const body = await request.json();
    const { content, images } = body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (content.length > 140) {
      return new Response(JSON.stringify({ success: false, error: 'Content must be 140 characters or less' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (images && (!Array.isArray(images) || images.length > 4)) {
      return new Response(JSON.stringify({ success: false, error: 'Maximum 4 images allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get business
    const business = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .get();

    if (!business) {
      return new Response(JSON.stringify({ success: false, error: 'Business not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const todayPosts = await db.select()
      .from(businessUpdates)
      .where(eq(businessUpdates.businessId, business.id))
      .all()
      .then(updates => updates.filter(u => u.postedDate === today));

    if (todayPosts.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'You can only post once per day. Try again tomorrow!'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Count total updates - if >= 4, delete oldest
    const existingUpdates = await db.select()
      .from(businessUpdates)
      .where(eq(businessUpdates.businessId, business.id))
      .orderBy(desc(businessUpdates.createdAt))
      .all();

    if (existingUpdates.length >= 4) {
      // Delete oldest (first in desc order)
      const oldest = existingUpdates[existingUpdates.length - 1];
      await db.delete(businessUpdates)
        .where(eq(businessUpdates.id, oldest.id))
        .run();
    }

    // Create update
    const updateId = crypto.randomUUID();
    const imagesJson = images ? JSON.stringify(images) : '[]';

    await db.insert(businessUpdates).values({
      id: updateId,
      businessId: business.id,
      content: content.trim(),
      images: imagesJson,
      postedDate: today,
    }).run();

    // Fetch the created update
    const newUpdate = await db.select()
      .from(businessUpdates)
      .where(eq(businessUpdates.id, updateId))
      .get();

    return new Response(JSON.stringify({
      success: true,
      update: {
        ...newUpdate,
        images: newUpdate?.images ? JSON.parse(newUpdate.images) : [],
      },
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE /api/businesses/:slug/updates - Delete an update
export async function DELETE({ params, url }: { params: { slug: string }; url: URL }) {
  const db = await getDb();
  const { slug } = params;
  const updateId = url.searchParams.get('id');

  if (!updateId) {
    return new Response(JSON.stringify({ success: false, error: 'Update ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await db.delete(businessUpdates)
      .where(eq(businessUpdates.id, updateId))
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
