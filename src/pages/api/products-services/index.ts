// Public API - Products & Services Listings
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const parseJsonField = (val: string | null): unknown => {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return val; }
};

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');
    const activeOnly = url.searchParams.get('active') !== 'false';
    const includeInactive = url.searchParams.get('isAdmin') === 'true';

    // Build where conditions
    const conditions = [];
    if (businessId) {
      conditions.push(eq(products.businessId, businessId));
    }
    if (activeOnly && !includeInactive) {
      conditions.push(eq(products.active, 1));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allProducts = await db.select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      categoryId: products.categoryId,
      productType: products.productType,
      specifications: products.specifications,
      images: products.images,
      featured: products.featured,
      active: products.active,
      businessId: products.businessId,
      sortOrder: products.sortOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(100)
      .all();

    // Parse JSON fields
    const parsedProducts = allProducts.map(p => ({
      ...p,
      specifications: parseJsonField(p.specifications),
      images: parseJsonField(p.images),
    }));

    return new Response(JSON.stringify({
      success: true,
      data: parsedProducts,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Products API] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: String(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}