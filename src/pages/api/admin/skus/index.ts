// Admin API - SKUs Management
export const prerender = false;

import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const skus = await db.select().from(products).orderBy(desc(products.createdAt)).all();

    return new Response(JSON.stringify({
      success: true,
      data: skus
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin SKUs error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch SKUs' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
