// API endpoint to get single product by ID
export const prerender = false;

import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }: { params: { id: string } }) {
  try {
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

    return new Response(JSON.stringify({
      success: true,
      data: product
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error.message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
