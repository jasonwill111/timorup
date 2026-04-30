// API endpoint to get SKU usage for a business page
export const prerender = false;

import { getDb } from '@/lib/db';
import { products, businessPages } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { PLAN_LIMITS } from '@/lib/media';

export async function GET({ params, url }: { params: Record<string, string>; url: URL }) {
  const db = await getDb();
  try {
    const { businessPageId } = params;

    // Get business page with plan info
    const business = await db.select({
      planType: businessPages.planType,
      expiryDate: businessPages.expiryDate,
      status: businessPages.status,
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

    const plan = business.planType || 'basic';

    // Check if plan is expired
    let effectivePlan = plan;
    if (business.expiryDate && new Date(business.expiryDate) < new Date()) {
      effectivePlan = 'expired';
    }

    const limit = PLAN_LIMITS[effectivePlan]?.maxProducts || PLAN_LIMITS.basic.maxProducts;

    // Count current products
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.businessPageId, businessPageId));

    const current = Number(countResult[0]?.count) || 0;
    const remaining = Math.max(0, limit - current);

    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: effectivePlan,
        limit,
        current,
        remaining,
        canAdd: remaining > 0,
        isExpired: effectivePlan === 'expired',
        expiryDate: business.expiryDate,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('SKU usage error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to get SKU usage' }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
