// API endpoint to get subscription/order info for a user
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businesses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimitKV, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

const ParamsSchema = z.object({
  uid: z.string().min(1, { error: 'User ID is required' }),
});

export async function GET({ params, request }: { params: Record<string, string>; request: Request }) {
  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimitKV(`sub:${clientIP}`);

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Rate limit exceeded. Please try again later.' }
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(rateLimit),
      },
    });
  }

  // Validate params
  const parseResult = ParamsSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Invalid user ID' }
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { uid } = parseResult.data;

  try {
    // Get user's orders (subscriptions)
    const userOrders = await db.select({
      id: orders.id,
      typeId: orders.typeId,
      servicePackageId: orders.servicePackageId,
      variantSnapshot: orders.variantSnapshot,
      type: orders.type,
      amount: orders.amount,
      status: orders.status,
      expiresAt: orders.expiresAt,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, uid))
    .orderBy(desc(orders.createdAt))
    .all();

    // Get business titles
    const businessMap = new Map();
    const bizIds = [...new Set(userOrders.map(o => o.typeId).filter(Boolean))];
    if (bizIds.length > 0) {
      const businessList = await db.select({
        id: businesses.id,
        title: businesses.title,
      })
      .from(businesses)
      .all();

      businessList.forEach((biz: { id: string; title: string }) => {
        if (bizIds.includes(biz.id)) {
          businessMap.set(biz.id, biz.title);
        }
      });
    }

    // Add business titles + parse variant
    const ordersWithBusiness = userOrders.map((order: { typeId: string | null; variantSnapshot: string }) => {
      let variantName = '';
      try {
        const snapshot = JSON.parse(order.variantSnapshot);
        variantName = snapshot?.name || '';
      } catch {}
      return {
        ...order,
        variantName,
        businessTitle: order.typeId ? (businessMap.get(order.typeId) || 'Unknown Business') : null,
      };
    });

    // Calculate subscription summary
    const activeSubscription = userOrders.find(o =>
      o.status === 'paid' && o.expiresAt && new Date(o.expiresAt * 1000) > new Date()
    );

    return new Response(JSON.stringify({
      success: true,
      data: {
        orders: ordersWithBusiness,
        activeSubscription: activeSubscription || null,
        hasActivePlan: !!activeSubscription,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
