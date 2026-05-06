// Admin API - Dashboard Stats
export const prerender = false;

import { getDb } from '@/lib/db';
import { users, businessPages, orders, categories, sessions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

async function requireAdminAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }

  // Direct session query instead of using auth API
  const db = await getDb();
  const session = await db.select()
    .from(sessions)
    .where(eq(sessions.token, tokenMatch[1]))
    .limit(1)
    .get();

  if (!session || !session.expiresAt) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Session expired' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }

  // expiresAt is Unix timestamp in seconds
  const expiresAtMs = typeof session.expiresAt === 'number'
    ? session.expiresAt * 1000
    : new Date(session.expiresAt).getTime();

  if (expiresAtMs <= Date.now()) {
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

export async function GET({ request }: { request: Request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    // Get total users
    const usersResult = await db.select({ count: sql`count(*)` }).from(users).get();
    const totalUsers = Number(usersResult?.count) || 0;

    // Get total businesses
    const businessesResult = await db.select({ count: sql`count(*)` }).from(businessPages).get();
    const totalBusinesses = Number(businessesResult?.count) || 0;

    // Get live businesses
    const liveBusinessesResult = await db.select({ count: sql`count(*)` })
      .from(businessPages)
      .where(eq(businessPages.status, 'live'))
      .get();
    const liveBusinesses = Number(liveBusinessesResult?.count) || 0;

    // Get total orders
    const ordersResult = await db.select({ count: sql`count(*)` }).from(orders).get();
    const totalOrders = Number(ordersResult?.count) || 0;

    // Get total revenue (sum of paid orders)
    const revenueResult = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
      .from(orders)
      .where(eq(orders.status, 'paid'))
      .get();
    const totalRevenue = Number(revenueResult?.total) || 0;

    // Get categories count
    const categoriesResult = await db.select({ count: sql`count(*)` }).from(categories).get();
    const totalCategories = Number(categoriesResult?.count) || 0;

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalUsers,
        totalBusinesses,
        liveBusinesses,
        totalOrders,
        totalRevenue,
        totalCategories,
        pendingBusinesses: totalBusinesses - liveBusinesses
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch stats' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
