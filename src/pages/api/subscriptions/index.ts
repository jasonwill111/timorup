// Subscriptions API - Requires authentication
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businesses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

const _db = await getDb();
if (!_db) throw new Error("Database not available");
const db = _db;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function requireAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
  try {
    const authApi = (await initAuth()).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    if (!user) {
      return { authorized: false, error: new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
    }
    return { authorized: true, user };
  } catch {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
}

// GET - List user's orders
export async function GET({ request }: { request: Request }) {
  const authResult = await requireAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const userOrders = await db.select({
      id: orders.id,
      typeId: orders.typeId,
      servicePackageId: orders.servicePackageId,
      variantSnapshot: orders.variantSnapshot,
      type: orders.type,
      amount: orders.amount,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      expiresAt: orders.expiresAt,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, authResult.user.id))
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

    // Add business titles
    const ordersWithBusiness = userOrders.map((order: { typeId: string | null }) => ({
      ...order,
      businessTitle: order.typeId ? (businessMap.get(order.typeId) || 'Unknown Business') : null,
    }));

    return new Response(JSON.stringify({
      success: true,
      data: ordersWithBusiness,
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
