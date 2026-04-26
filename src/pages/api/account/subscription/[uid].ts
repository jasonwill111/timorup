// API endpoint to get subscription/order info for a user
export const prerender = false;

import { db } from '@/lib/db';
import { orders, businessPages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
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
  uid: z.string().min(1),
});

export async function GET({ params, request }: { params: Record<string, string>; request: Request }) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`sub:${clientIP}`);

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
      businessPageId: orders.businessPageId,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      expiryDate: orders.expiryDate,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, uid))
    .orderBy(desc(orders.createdAt))
    .all();

    // Get business titles
    const businessMap = new Map();
    const bizIds = [...new Set(userOrders.map(o => o.businessPageId))];
    if (bizIds.length > 0) {
      const businesses = await db.select({
        id: businessPages.id,
        title: businessPages.title,
      })
      .from(businessPages)
      .all();

      businesses.forEach((biz: { id: string; title: string }) => {
        if (bizIds.includes(biz.id)) {
          businessMap.set(biz.id, biz.title);
        }
      });
    }

    // Add business titles
    const ordersWithBusiness = userOrders.map((order: { businessPageId: string }) => ({
      ...order,
      businessTitle: businessMap.get(order.businessPageId) || 'Unknown Business',
    }));

    // Calculate subscription summary
    const activeSubscription = userOrders.find(o =>
      o.status === 'paid' && o.expiryDate && new Date(o.expiryDate) > new Date()
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
