// API endpoint to get/create/update products
export const prerender = false;

import { getDb } from '@/lib/db';
import { products, businessPages } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { PLAN_LIMITS } from '@/lib/media';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

const VALID_SERVICE_TYPES = [
  'product', 'service', 'rental', 'food',
  'accommodation', 'automotive', 'healthcare',
  'education', 'beauty', 'event'
];

const parseJsonField = (val: string): unknown => {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

export async function GET({ url, request }: { url: URL; request: Request }) {
  const user = await getAdminUser(request);
  // Admin APIs require auth, regular product APIs don't
  const isAdmin = user && url.searchParams.get('isAdmin') === 'true';

  if (!isAdmin) {
    // Non-admin: require businessPageId
    const businessPageId = url.searchParams.get('businessPageId');
    if (!businessPageId) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessPageId is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = await getDb();
    const activeOnly = url.searchParams.get('active') !== 'false';
    let query = db.select().from(products).where(eq(products.businessPageId, businessPageId));
    if (activeOnly) {
      query = query.where(eq(products.active, true));
    }
    const allProducts = await query.orderBy(desc(products.featured), desc(products.createdAt)).all();

    return new Response(JSON.stringify({
      success: true,
      data: allProducts.map((p: Record<string, unknown>) => ({
        ...p,
        priceFields: p.priceFields ? parseJsonField(p.priceFields as string) : null,
        specifications: p.specifications ? parseJsonField(p.specifications as string) : null,
      })),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Admin path
  const db = await getDb();
  const businessPageId = url.searchParams.get('businessPageId');
  const activeOnly = url.searchParams.get('active') !== 'false';

  let query = db.select().from(products).orderBy(desc(products.createdAt));

  if (businessPageId) {
    query = query.where(eq(products.businessPageId, businessPageId));
    if (activeOnly) {
      query = query.where(eq(products.active, true));
    }
  }

  const allProducts = await query.all();

  return new Response(JSON.stringify({
    success: true,
    data: allProducts.map((p: Record<string, unknown>) => ({
      ...p,
      priceFields: p.priceFields ? parseJsonField(p.priceFields as string) : null,
      specifications: p.specifications ? parseJsonField(p.specifications as string) : null,
    })),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const {
      title, price, priceUnit, description, businessPageId,
      priceFields, serviceType, specifications, featured
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
          message: `SKU limit reached (${current}/${limit}). Upgrade to add more.`,
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

    const safeStringify = (val: unknown): string | null => {
      if (!val) return null;
      if (typeof val === 'string') {
        try { JSON.parse(val); return val; } catch { return val; }
      }
      return JSON.stringify(val);
    };

    await db.insert(products).values({
      id,
      title,
      price: price || null,
      priceUnit: priceUnit || null,
      description: description || null,
      businessPageId,
      priceFields: safeStringify(priceFields),
      serviceType: finalServiceType,
      specifications: safeStringify(specifications),
      featured: featured || false,
      active: true,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, price, priceFields, serviceType, specifications, featured, description },
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

export async function PUT({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

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

  try {
    const body = await request.json();
    const { title, price, priceUnit, description, priceFields, serviceType, specifications, featured, active } = body;

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Product not found' } }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (price !== undefined) updateData.price = price || null;
    if (priceUnit !== undefined) updateData.priceUnit = priceUnit || null;
    if (description !== undefined) updateData.description = description || null;
    if (priceFields !== undefined) updateData.priceFields = priceFields ? JSON.stringify(priceFields) : null;
    if (serviceType !== undefined) updateData.serviceType = VALID_SERVICE_TYPES.includes(serviceType) ? serviceType : 'product';
    if (specifications !== undefined) updateData.specifications = specifications ? JSON.stringify(specifications) : null;
    if (featured !== undefined) updateData.featured = featured;
    if (active !== undefined) updateData.active = active;

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = Math.floor(Date.now() / 1000);
      await db.update(products).set(updateData).where(eq(products.id, id)).run();
    }

    const updated = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    const parsedUpdated = updated ? {
      ...updated,
      priceFields: updated.priceFields ? parseJsonField(updated.priceFields as string) : null,
      specifications: updated.specifications ? parseJsonField(updated.specifications as string) : null,
    } : null;

    return new Response(JSON.stringify({ success: true, data: parsedUpdated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ success: false, error: { message: 'ID required' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = await getDb();
  await db.delete(products).where(eq(products.id, id)).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}