// API endpoint to get SKU usage for a business page
export const prerender = false;

import { getDb } from '@/lib/db';
import { products, businesses } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getPlanLimits } from '@/lib/subscription';

export async function GET({ params }: { params: Record<string, string> }) {
  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  try {
    const { businessPageId } = params;

    // Get business with plan info
    const business = await db.select({
      planSlug: businesses.planSlug,
      limits: businesses.limits,
      subscriptionStatus: businesses.subscriptionStatus,
      subscriptionExpiresAt: businesses.subscriptionExpiresAt,
      status: businesses.status,
    })
    .from(businesses)
    .where(eq(businesses.id, businessPageId))
    .limit(1)
    .get() ?? undefined;

    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if subscription expired
    let effectivePlan = business.planSlug || null;
    if (business.subscriptionExpiresAt && new Date(business.subscriptionExpiresAt) < new Date()) {
      effectivePlan = 'expired';
    }

    const planData = effectivePlan ? await getPlanLimits(effectivePlan) : null;
    const limit = planData?.skuLimit || 0;

    // Count current products
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.businessId, businessPageId));

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
        expiresAt: business.subscriptionExpiresAt,
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
