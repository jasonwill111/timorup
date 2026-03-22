// API endpoint to get products for a business
export const prerender = false;

import { db } from '@/lib/db';
import { products, productImages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET({ url }: { url: URL }) {
  try {
    const businessPageId = url.searchParams.get('businessPageId');
    const isAdmin = url.searchParams.get('isAdmin') === 'true';
    
    let allProducts;
    
    if (isAdmin && !businessPageId) {
      // Admin fetch all products across all businesses
      allProducts = await db.select()
        .from(products)
        .orderBy(desc(products.createdAt));
    } else if (businessPageId) {
      allProducts = await db.select()
        .from(products)
        .where(eq(products.businessPageId, businessPageId))
        .orderBy(desc(products.createdAt));
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
    
    // Skip ownership/subscription checks for admin
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
    
    const [newProduct] = await db.insert(products).values({
      id,
      title,
      price,
      description: description || null,
      businessPageId,
    }).returning();
    
    return new Response(JSON.stringify({
      success: true,
      data: newProduct,
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
