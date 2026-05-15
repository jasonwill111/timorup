// API endpoint to get/create/update products
export const prerender = false;

import { getDb } from '@/lib/db';
import { products, businesses } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { canCreateSku, canEditBusiness } from '@/lib/subscription';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

const VALID_PRODUCT_TYPES = [
  'product', 'service', 'virtual', 'ticket', 'rental', 'subscription'
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
  const isAdmin = user && url.searchParams.get('isAdmin') === 'true';

  if (!isAdmin) {
    const businessId = url.searchParams.get('businessId');
    if (!businessId) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessId is required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = await getDb();
    const activeOnly = url.searchParams.get('active') !== 'false';
    const conditions = [eq(products.businessId, businessId)];
    if (activeOnly) {
      conditions.push(eq(products.active, true));
    }
    const allProducts = await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.featured), desc(products.createdAt))
      .all();

    return new Response(JSON.stringify({
      success: true,
      data: allProducts.map((p: Record<string, unknown>) => ({
        ...p,
        priceFields: p.priceFields ? parseJsonField(p.priceFields as string) : null,
        specifications: p.specifications ? parseJsonField(p.specifications as string) : null,
        images: p.images ? parseJsonField(p.images as string) : null,
      })),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Admin path
  const db = await getDb();
  const businessId = url.searchParams.get('businessId');
  const activeOnly = url.searchParams.get('active') !== 'false';

  const conditions = [];
  if (businessId) {
    conditions.push(eq(products.businessId, businessId));
  }
  if (activeOnly) {
    conditions.push(eq(products.active, true));
  }

  let query = db.select().from(products);
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  query = query.orderBy(desc(products.createdAt));

  const allProducts = await query.all();

  return new Response(JSON.stringify({
    success: true,
    data: allProducts.map((p: Record<string, unknown>) => ({
      ...p,
      priceFields: p.priceFields ? parseJsonField(p.priceFields as string) : null,
      specifications: p.specifications ? parseJsonField(p.specifications as string) : null,
      images: p.images ? parseJsonField(p.images as string) : null,
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
      title, description, businessId,
      categoryId, priceFields, productType, specifications, images, featured
    } = body;

    if (!businessId || !title) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'businessId and title are required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate productType
    const finalProductType = VALID_PRODUCT_TYPES.includes(productType) ? productType : 'product';

    // Check business exists
    const business = await db.select({ id: businesses.id })
      .from(businesses)
      .where(eq(businesses.id, businessId))
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

    // Check subscription status and SKU limit
    const canCreate = await canCreateSku(businessId);
    if (!canCreate.can) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'SKU_NOT_ALLOWED', message: canCreate.reason || 'Cannot create SKU' }
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
      description: description || null,
      businessId,
      categoryId: categoryId || null,
      priceFields: safeStringify(priceFields),
      productType: finalProductType,
      specifications: safeStringify(specifications),
      images: images ? JSON.stringify(images) : null,
      featured: featured || false,
      active: true,
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, priceFields, productType, specifications, images, featured, description },
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
    const { title, description, priceFields, productType, specifications, images, featured, active, businessId } = body;

    // Check grace period if updating business association
    if (businessId) {
      const check = await canEditBusiness(businessId);
      if (!check.can) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'EDIT_BLOCKED', message: check.reason || 'Cannot edit during grace period' }
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Product not found' } }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check grace period for existing product's business
    const productBusinessId = existing.businessId;
    if (productBusinessId) {
      const check = await canEditBusiness(productBusinessId);
      if (!check.can) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'EDIT_BLOCKED', message: check.reason || 'Cannot edit during grace period' }
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (priceFields !== undefined) updateData.priceFields = priceFields ? JSON.stringify(priceFields) : null;
    if (productType !== undefined) updateData.productType = VALID_PRODUCT_TYPES.includes(productType) ? productType : 'product';
    if (specifications !== undefined) updateData.specifications = specifications ? JSON.stringify(specifications) : null;
    if (images !== undefined) updateData.images = images ? JSON.stringify(images) : null;
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
      images: updated.images ? parseJsonField(updated.images as string) : null,
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