// Public API - Products & Services Listings
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const safeParse = (val: unknown): unknown => {
  if (!val || typeof val !== 'string') return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Database not available' }
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');
    const isAdmin = url.searchParams.get('isAdmin') === 'true';

    console.log('[Products API] businessId:', businessId, 'isAdmin:', isAdmin);

    // Simple query - just get all products first
    let allProducts;
    try {
      allProducts = await db.select().from(products).limit(5).all();
      console.log('[Products API] Query result count:', allProducts?.length);
    } catch (queryError) {
      console.error('[Products API] Query error:', queryError);
      return new Response(JSON.stringify({
        success: false,
        error: { message: `Query error: ${String(queryError)}` }
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (!allProducts || allProducts.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        data: [],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Parse first product to check structure
    const first = allProducts[0];
    console.log('[Products API] First product keys:', Object.keys(first));

    // Map results
    const parsedProducts = allProducts.map((p: Record<string, unknown>) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.category_id,
      productType: p.product_type,
      priceFields: safeParse(p.price_fields),
      specifications: safeParse(p.specifications),
      images: safeParse(p.images),
      featured: p.featured,
      active: p.active,
      businessId: p.business_id,
      sortOrder: p.sort_order,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return new Response(JSON.stringify({
      success: true,
      data: parsedProducts,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('[Products API] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: String(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
