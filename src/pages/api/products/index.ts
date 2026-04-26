// API endpoint to get products for a business
export const prerender = false;

import { db } from '@/lib/db';
import { products, businessPages } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { PLAN_LIMITS } from '@/lib/media';

// Helper to check SKU limit
async function checkSkuLimit(businessPageId: string): Promise<{ allowed: boolean; limit: number; current: number; planName: string }> {
  // Get business page with plan info
  const business = await db.select({
    planType: businessPages.planType,
    expiryDate: businessPages.expiryDate,
  })
  .from(businessPages)
  .where(eq(businessPages.id, businessPageId))
  .limit(1)
  .get();

  if (!business) {
    return { allowed: false, limit: 0, current: 0, planName: 'none' };
  }

  // Determine effective plan
  let effectivePlan = business.planType || 'basic';
  if (business.expiryDate && new Date(business.expiryDate) < new Date()) {
    // Plan expired, limit to basic (10)
    effectivePlan = 'basic';
  }

  const limit = PLAN_LIMITS[effectivePlan]?.maxProducts || PLAN_LIMITS.basic.maxProducts;

  // Count current products
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.businessPageId, businessPageId));

  const current = Number(countResult[0]?.count) || 0;

  return {
    allowed: current < limit,
    limit,
    current,
    planName: effectivePlan,
  };
}

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
  } catch (error) {
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
    const { title, price, priceUnit, description, businessPageId, priceFields, serviceType, isAdmin } = body;

    if (!businessPageId || !title) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessPageId and title are required' }
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

    // Check SKU limit
    const skuCheck = await checkSkuLimit(businessPageId);
    if (!skuCheck.allowed) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'SKU_LIMIT_EXCEEDED',
          message: `You have reached your SKU limit (${skuCheck.current}/${skuCheck.limit}). Please upgrade your plan to add more products.`,
          plan: skuCheck.planName,
          limit: skuCheck.limit,
          current: skuCheck.current,
        }
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `prod-${Date.now()}`;

    await db.insert(products).values({
      id,
      title,
      price: price || null,
      priceUnit: priceUnit || null,
      description: description || null,
      businessPageId,
      priceFields: priceFields || null,
      serviceType: serviceType || 'product',
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, price, priceFields, serviceType, description },
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error.message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
