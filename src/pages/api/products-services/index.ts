// Public API - Products & Services Listings
export const prerender = false;

import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");

    const allProducts = await db.select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      priceFields: products.priceFields,
      images: products.images,
      productType: products.productType,
      businessId: products.businessId,
      createdAt: products.createdAt,
    })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(100)
      .all();

    return new Response(JSON.stringify({
      success: true,
      data: allProducts,
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