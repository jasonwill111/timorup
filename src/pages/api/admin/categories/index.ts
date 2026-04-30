// Admin API - Categories Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq, desc, sql, or, isNull } from 'drizzle-orm';

// GET - List all categories (with optional entityType filter)
export async function GET({ request }: { request: Request }) {
  const db = await getDb();
  try {
    const url = new URL(request.url);
    const entityType = url.searchParams.get('entityType');

    let categoriesResult;

    if (entityType) {
      // Get categories matching entityType OR null (universal categories)
      categoriesResult = await db.select()
        .from(categories)
        .where(or(
          eq(categories.entityType, entityType),
          isNull(categories.entityType)
        ))
        .orderBy(desc(categories.createdAt))
        .all();
    } else {
      categoriesResult = await db.select()
        .from(categories)
        .orderBy(desc(categories.createdAt))
        .all();
    }

    return new Response(JSON.stringify({
      success: true,
      data: categoriesResult
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin categories error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch categories' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Create category
export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { name, slug, description, icon, entityType, parentId } = body;

    const id = `cat-${Date.now()}`;

    await db.insert(categories).values({
      id,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      icon: icon || '',
      entityType: entityType || 'business', // Default to business
      parentId: parentId || null,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, name, slug, entityType }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create category error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create category' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// PUT - Update category
export async function PUT({ request }: { request: Request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { id, name, slug, description, icon, entityType, parentId } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Category ID is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const updatedCategory = await db.update(categories)
      .set({
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(entityType !== undefined && { entityType }),
        ...(parentId !== undefined && { parentId }),
        updatedAt: sql`(strftime('%s', 'now'))`,
      })
      .where(eq(categories.id, id))
      .returning()
      .get();

    if (!updatedCategory) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Category not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedCategory
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Update category error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to update category' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
