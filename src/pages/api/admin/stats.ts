// Admin API - Dashboard Stats
export const prerender = false;

import { getDb } from '@/lib/db';
import { users, businessPages, orders, categories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

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
    const authInstance = await initAuth();
    const { user } = await authInstance.api.getSession({
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
