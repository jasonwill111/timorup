// Admin API - Orders Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businessPages, users } from '@/db/schema';
import { eq, desc, sql, like, or, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

async function requireAdminAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
  try {
    const authApi = (auth as unknown as { api: typeof auth.api }).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    if (!user || user.role !== 'admin') {
      return { authorized: false, error: new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } }) };
    }
    return { authorized: true, user };
  } catch {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
}

// GET - List all orders
export async function GET({ url, request }: { url: URL; request: Request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let conditions = [];
    if (status) {
      conditions.push(eq(orders.status, status));
    }

    const ordersResult = await db.select({
      id: orders.id,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      businessTitle: businessPages.title,
      userName: users.name,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(businessPages, eq(orders.businessPageId, businessPages.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

    const countResult = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return new Response(JSON.stringify({
      success: true,
      data: ordersResult,
      total: Number(countResult[0]?.count) || 0,
      page,
      limit
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch orders' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Create order
export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const body = await request.json();
    const { businessPageId, userId, planType, amount, paymentMethod } = body;

    const id = `order-${Date.now()}`;
    const newOrder = await db.insert(orders).values({
      id,
      businessPageId,
      userId,
      planType,
      amount,
      paymentMethod: paymentMethod || 'cash',
      status: 'unpaid',
    }).returning();

    return new Response(JSON.stringify({
      success: true,
      data: newOrder[0]
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create order error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create order' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
