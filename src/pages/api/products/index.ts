// API endpoint to get/create products for a business
export const prerender = false;

import { getDb } from '@/lib/db';
import { products, businessPages } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { PLAN_LIMITS } from '@/lib/media';

const VALID_SERVICE_TYPES = [
  'product', 'service', 'rental', 'food',
  'accommodation', 'automotive', 'healthcare',
  'education', 'beauty', 'event'
];

export async function GET({ url }: { url: URL }) {
  try {
    const db = await getDb();
    const businessPageId = url.searchParams.get('businessPageId');
    const isAdmin = url.searchParams.get('isAdmin') === 'true';
    const activeOnly = url.searchParams.get('active') !== 'false'; // Default true

    let query = db.select().from(products);

    if (isAdmin && !businessPageId) {
      // Admin view all products
      query = query.orderBy(desc(products.createdAt));
    } else if (businessPageId) {
      // Get products for specific business
      query = query.where(eq(products.businessPageId, businessPageId));
      if (activeOnly && !isAdmin) {
        query = query.where(eq(products.active, true));
      }
      query = query.orderBy(desc(products.featured), desc(products.createdAt));
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessPageId is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const allProducts = await query.all();

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
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const body = await request.json();
    const {
      title, price, priceUnit, description, businessPageId,
      priceFields, serviceType, specifications, featured, isAdmin
    } = body;

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

    // Validate serviceType
    const finalServiceType = VALID_SERVICE_TYPES.includes(serviceType) ? serviceType : 'product';

    // Check SKU limit
    const business = await db.select({
      planType: businessPages.planType,
      expiryDate: businessPages.expiryDate,
    })
    .from(businessPages)
    .where(eq(businessPages.id, businessPageId))
    .limit(1)
    .get();

    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let effectivePlan = business.planType || 'basic';
    if (business.expiryDate && new Date(business.expiryDate) < new Date()) {
      effectivePlan = 'basic';
    }

    const limit = PLAN_LIMITS[effectivePlan]?.maxProducts || PLAN_LIMITS.basic.maxProducts;
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.businessPageId, businessPageId));
    const current = Number(countResult[0]?.count) || 0;

    if (current >= limit) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'SKU_LIMIT_EXCEEDED',
          message: `You have reached your SKU limit (${current}/${limit}). Please upgrade your plan to add more products.`,
          plan: effectivePlan,
          limit,
          current,
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
      priceFields: priceFields ? JSON.stringify(priceFields) : null,
      serviceType: finalServiceType,
      specifications: specifications ? JSON.stringify(specifications) : null,
      featured: featured || false,
      active: true,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: {
        id, title, price, priceFields, serviceType,
        specifications, featured, description
      },
    }), {
      status: 201,
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

// Product update handler
export async function PUT({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Product ID is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const {
      title, price, priceUnit, description,
      priceFields, serviceType, specifications, featured, active
    } = body;

    // Check product exists
    const existing = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
      .get();

    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Product not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (price !== undefined) updateData.price = price || null;
    if (priceUnit !== undefined) updateData.priceUnit = priceUnit || null;
    if (description !== undefined) updateData.description = description || null;
    if (priceFields !== undefined) updateData.priceFields = priceFields ? JSON.stringify(priceFields) : null;
    if (serviceType !== undefined) {
      updateData.serviceType = VALID_SERVICE_TYPES.includes(serviceType) ? serviceType : 'product';
    }
    if (specifications !== undefined) updateData.specifications = specifications ? JSON.stringify(specifications) : null;
    if (featured !== undefined) updateData.featured = featured;
    if (active !== undefined) updateData.active = active;

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = Math.floor(Date.now() / 1000);
      await db.update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .run();
    }

    // Get updated product
    const updated = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
      .get();

    return new Response(JSON.stringify({
      success: true,
      data: updated,
    }), {
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
