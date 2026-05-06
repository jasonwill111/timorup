// Admin API - Orders Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businessPages, users, sessions } from '@/db/schema';
import { eq, desc, sql, like, or, and } from 'drizzle-orm';


async function requireAdminAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }

  const db = await getDb();
  const session = await db.select()
    .from(sessions)
    .where(eq(sessions.token, tokenMatch[1]))
    .limit(1)
    .get();

  // expiresAt is Unix timestamp in seconds
  const expiresAtMs = typeof session.expiresAt === 'number'
    ? session.expiresAt * 1000
    : new Date(session.expiresAt).getTime();

  if (!session || !session.expiresAt || expiresAtMs <= Date.now()) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Session expired' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }

  const user = await db.select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)
    .get();

  if (!user || user.role !== 'admin') {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' }
    }), { status: 403, headers: { 'Content-Type': 'application/json' } }) };
  }
  return { authorized: true, user };
}

// GET - List all orders with pagination
export async function GET({ request }: { request: Request }) {
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const db = await getDb();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const status = url.searchParams.get('status') || '';

    let whereCondition;
    if (status) {
      whereCondition = eq(orders.status, status);
    }

    const allOrders = await db.select({
      id: orders.id,
      businessPageId: orders.businessPageId,
      userId: orders.userId,
      planType: orders.planType,
      amount: orders.amount,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      expiryDate: orders.expiryDate,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(whereCondition)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereCondition)
      .get();
    const total = Number(countResult?.count) || 0;

    return new Response(JSON.stringify({
      success: true,
      data: allOrders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error instanceof Error ? error.message : String(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}