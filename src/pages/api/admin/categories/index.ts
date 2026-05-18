// Admin API - Categories Management (supports 4 separate category tables)
export const prerender = false;

import { getDb } from '@/lib/db';
import {
  CATEGORY_TABLE_MAP,
  isValidEntityType,
  getCategoryTable,
  getValidEntityTypesMessage,
  type EntityType,
} from '@/lib/category-registry';
import { eq, desc, sql } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List categories by table
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const url = new URL(request?.url);
    const table = url.searchParams.get('table') || 'business';

    if (!isValidEntityType(table)) {
      return Response.json(
        { success: false, error: { message: `Invalid table. Valid values: ${getValidEntityTypesMessage()}` } },
        { status: 400 }
      );
    }

    const config = getCategoryTable(table);
    const categories = await db.select()
      .from(config.schema)
      .orderBy(desc(config.schema.createdAt))
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
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const body = await request.json();
    const { name, slug, description, icon, table = 'business', parentId } = body;

    if (!isValidEntityType(table)) {
      return Response.json(
        { success: false, error: { message: `Invalid table. Valid values: ${getValidEntityTypesMessage()}` } },
        { status: 400 }
      );
    }

    const config = getCategoryTable(table);
    const id = `cat-${Date.now()}`;

    await db.insert(config.schema).values({
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
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const url = new URL(request?.url);
    const id = url.searchParams.get('id');
    const table = url.searchParams.get('table') || 'business';

    if (!id) {
      return Response.json({ success: false, error: { message: 'ID required' } }, { status: 400 });
    }

    if (!isValidEntityType(table)) {
      return Response.json(
        { success: false, error: { message: `Invalid table. Valid values: ${getValidEntityTypesMessage()}` } },
        { status: 400 }
      );
    }

    const config = getCategoryTable(table);

    // Check children
    const children = await db.select()
      .from(config.schema)
      .where(eq(config.schema.parentId, id))
      .all();

    if (children.length > 0) {
      return Response.json({ success: false, error: { message: 'Cannot delete category with children' } }, { status: 409 });
    }

    await db.delete(config.schema).where(eq(config.schema.id, id)).run();

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
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const body = await request.json();
    const { id, name, slug, description, icon, table = 'business', parentId } = body;

    if (!id) {
      return Response.json({ success: false, error: { message: 'ID required' } }, { status: 400 });
    }

    if (!isValidEntityType(table)) {
      return Response.json(
        { success: false, error: { message: `Invalid table. Valid values: ${getValidEntityTypesMessage()}` } },
        { status: 400 }
      );
    }

    const config = getCategoryTable(table);

    const updated = await db.update(config.schema)
      .set({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(parentId !== undefined && { parentId }),
        updatedAt: sql`(strftime('%s', 'now'))`,
      })
      .where(eq(config.schema.id, id))
      .returning()
      .get() ?? undefined;

    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update category error:', error);
    return Response.json({ success: false, error: { message: 'Failed to update category' } }, { status: 500 });
  }
}