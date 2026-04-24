// API endpoint to get products for a business
export const prerender = false;

import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET({ url }: { url: URL }) {
  try {
    const businessPageId = url.searchParams.get('businessPageId');
    const isAdmin = url.searchParams.get('isAdmin') === 'true';

    let allProducts;

    if (isAdmin && !businessPageId) {
      allProducts = await db.select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .all();
    } else if (businessPageId) {
      allProducts = await db.select()
        .from(products)
        .where(eq(products.businessPageId, businessPageId))
        .orderBy(desc(products.createdAt))
        .all();
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessPageId is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: allProducts,
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

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { title, price, description, businessPageId, isAdmin } = body;

    if (!businessPageId || !title || !price) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessPageId, title, and price are required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!isAdmin) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Please use the business account to create products' }
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `prod-${Date.now()}`;

    await db.insert(products).values({
      id,
      title,
      price,
      description: description || null,
      businessPageId,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, price, description },
    }), {
      status: 201,
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
