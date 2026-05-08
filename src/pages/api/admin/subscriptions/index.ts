// Admin API - Orders Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

async function requireAdminAuth(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return { authorized: false, error: unauthorizedResponse() };
  }
  return { authorized: true, user: adminUser };
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