// API endpoint to get single product by ID
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
    const db = await getDb();
    const body = await request.json();
    const { title, price, priceUnit, description, businessPageId, priceFields, serviceType, isAdmin } = body;

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    await db
      .update(products)
      .set({
        title: title ?? existing.title,
        price: price ?? existing.price,
        priceUnit: priceUnit ?? existing.priceUnit,
        description: description ?? existing.description,
        businessPageId: businessPageId ?? existing.businessPageId,
        priceFields: priceFields ?? existing.priceFields,
        serviceType: serviceType ?? existing.serviceType,
      })
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
    const db = await getDb();
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('isAdmin') === 'true' || request.headers.get('admin') === 'true';

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
