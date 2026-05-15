// API endpoint to get single product by ID
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET({ params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const { id } = params;

    const product = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
      .get();

    if (!product) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Product not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT({ params, request }: { params: { id: string }, request: Request }) {
  try {
    const user = await getAdminUser(request);
    if (!user) return unauthorizedResponse();

    const db = await getDb();
    const body = await request.json();
    const { title, description, priceFields, productType, specifications, images, featured, active, businessId } = body;

    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, params.id))
      .get();

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priceFields !== undefined) updateData.priceFields = priceFields ? JSON.stringify(priceFields) : null;
    if (productType !== undefined) updateData.productType = productType;
    if (specifications !== undefined) updateData.specifications = specifications ? JSON.stringify(specifications) : null;
    if (images !== undefined) updateData.images = images ? JSON.stringify(images) : null;
    if (featured !== undefined) updateData.featured = featured;
    if (active !== undefined) updateData.active = active;
    if (businessId !== undefined) updateData.businessId = businessId;

    await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, params.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE({ params, request }: { params: { id: string }, request: Request }) {
  try {
    const user = await getAdminUser(request);
    if (!user) return unauthorizedResponse();

    const db = await getDb();

    await db
      .delete(products)
      .where(eq(products.id, params.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
