// Admin API - Listings Management (NEW listings table)
export const prerender = false;

import { getDb } from '@/lib/db';
import { listings } from '@/db/schema';
import { eq, desc, like, sql } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List listings with filters
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const listingType = url.searchParams.get('type') || '';

    // Build conditions
    const conditions: any[] = [];
    if (search) {
      const pattern = `%${search}%`;
      conditions.push(like(listings.title, pattern));
    }
    if (status) {
      conditions.push(eq(listings.status, status));
    }
    if (listingType) {
      conditions.push(eq(listings.listingType, listingType));
    }

    const where = conditions.length ? conditions : undefined;

    const data = await db.select()
      .from(listings)
      .where(where)
      .orderBy(desc(listings.createdAt))
      .limit(limit)
      .offset(offset)
      .all();

    const countResult = db.select({ count: sql`count(*)` }).from(listings).where(where).get();
    const total = Number(countResult?.count) || 0;

    return Response.json({
      success: true,
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }, { status: 200 });
  } catch (error) {
    return Response.json({
      success: false,
      error: { message: error instanceof Error ? error.message : String(error) }
    }, { status: 500 });
  }
}

// POST - Create listing
export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { title, slug, listingType, description, price, condition, location, contactName, contactNumber, email, status, categoryId } = body;

    const id = `lst-${Date.now()}`;
    const newListing = {
      id,
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      ownerId: user.id,
      listingType: listingType || 'product',
      status: status || 'draft',
      description: description || '',
      price: price || '',
      condition: condition || '',
      location: location || '',
      contactName: contactName || '',
      contactNumber: contactNumber || '',
      email: email || '',
      countryCode: '+670',
      categoryId: categoryId || null,
      likes: 0,
      saves: 0,
      views: 0,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    await db.insert(listings).values(newListing).run();

    return Response.json({ success: true, data: { id, ...newListing } }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: { message: 'Failed to create listing' } }, { status: 500 });
  }
}

// PUT - Update listing
export async function PUT({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return Response.json({ success: false, error: { message: 'ID required' } }, { status: 400 });
    }

    const updated = await db.update(listings)
      .set({ ...updates, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(listings.id, id))
      .returning()
      .get();

    return Response.json({ success: true, data: updated });
  } catch (error) {
    return Response.json({ success: false, error: { message: 'Failed to update' } }, { status: 500 });
  }
}

// DELETE - Delete listing
export async function DELETE({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ success: false, error: { message: 'ID required' } }, { status: 400 });
    }

    await db.delete(listings).where(eq(listings.id, id)).run();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: { message: 'Failed to delete' } }, { status: 500 });
  }
}