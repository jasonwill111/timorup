// Admin API - Categories Management (supports 4 separate category tables)
export const prerender = false;

import { getDb } from '@/lib/db';
import { businessCategories, nonProfitCategories, publicSectorCategories, listingCategories } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

const TABLE_MAP: Record<string, any> = {
  'business': businessCategories,
  'non_profit': nonProfitCategories,
  'public_sector': publicSectorCategories,
  'listing': listingCategories,
};

const TABLE_NAMES = {
  'business': 'business_categories',
  'non_profit': 'non_profit_categories',
  'public_sector': 'public_sector_categories',
  'listing': 'listing_categories',
};

// GET - List categories by table
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table') || 'business';
    const tableSchema = TABLE_MAP[table];

    if (!tableSchema) {
      return Response.json({ success: false, error: { message: 'Invalid table' } }, { status: 400 });
    }

    const categories = await db.select()
      .from(tableSchema)
      .orderBy(desc(tableSchema.createdAt))
      .all();

    return Response.json({ success: true, data: categories });
  } catch (error) {
    console.error('Admin categories error:', error);
    return Response.json({ success: false, error: { message: 'Failed to fetch categories' } }, { status: 500 });
  }
}

// POST - Create category
export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { name, slug, description, icon, table = 'business', parentId } = body;
    const tableSchema = TABLE_MAP[table];

    if (!tableSchema) {
      return Response.json({ success: false, error: { message: 'Invalid table' } }, { status: 400 });
    }

    const id = `cat-${Date.now()}`;

    await db.insert(tableSchema).values({
      id,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      icon: icon || '',
      parentId: parentId || null,
    }).run();

    return Response.json({ success: true, data: { id, name, table } }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return Response.json({ success: false, error: { message: 'Failed to create category' } }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const table = url.searchParams.get('table') || 'business';
    const tableSchema = TABLE_MAP[table];

    if (!id || !tableSchema) {
      return Response.json({ success: false, error: { message: 'ID and table required' } }, { status: 400 });
    }

    // Check children
    const children = await db.select()
      .from(tableSchema)
      .where(eq(tableSchema.parentId, id))
      .all();

    if (children.length > 0) {
      return Response.json({ success: false, error: { message: 'Cannot delete category with children' } }, { status: 409 });
    }

    await db.delete(tableSchema).where(eq(tableSchema.id, id)).run();

    return Response.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    return Response.json({ success: false, error: { message: 'Failed to delete category' } }, { status: 500 });
  }
}

// PUT - Update category
export async function PUT({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { id, name, slug, description, icon, table = 'business', parentId } = body;
    const tableSchema = TABLE_MAP[table];

    if (!id || !tableSchema) {
      return Response.json({ success: false, error: { message: 'ID and table required' } }, { status: 400 });
    }

    const updated = await db.update(tableSchema)
      .set({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(parentId !== undefined && { parentId }),
        updatedAt: sql`(strftime('%s', 'now'))`,
      })
      .where(eq(tableSchema.id, id))
      .returning()
      .get();

    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update category error:', error);
    return Response.json({ success: false, error: { message: 'Failed to update category' } }, { status: 500 });
  }
}
