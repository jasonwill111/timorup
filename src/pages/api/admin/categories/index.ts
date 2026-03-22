// Admin API - Categories Management
export const prerender = false;

import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

// GET - List all categories
export async function GET() {
  try {
    const categoriesResult = await db.select()
      .from(categories)
      .orderBy(desc(categories.createdAt));

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
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    const id = `cat-${Date.now()}`;
    const newCategory = await db.insert(categories).values({
      id,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
    }).returning();

    return new Response(JSON.stringify({
      success: true,
      data: newCategory[0]
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create category error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create category' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
