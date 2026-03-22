// Admin API - Dashboard Stats
export const prerender = false;

import { db } from '@/lib/db';
import { users, businessPages, orders, categories } from '@/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total users
    const usersResult = await db.select({ count: sql`count(*)` }).from(users);
    const totalUsers = Number(usersResult[0]?.count) || 0;

    // Get total businesses
    const businessesResult = await db.select({ count: sql`count(*)` }).from(businessPages);
    const totalBusinesses = Number(businessesResult[0]?.count) || 0;

    // Get live businesses
    const liveBusinessesResult = await db.select({ count: sql`count(*)` })
      .from(businessPages)
      .where(eq(businessPages.status, 'live'));
    const liveBusinesses = Number(liveBusinessesResult[0]?.count) || 0;

    // Get total orders
    const ordersResult = await db.select({ count: sql`count(*)` }).from(orders);
    const totalOrders = Number(ordersResult[0]?.count) || 0;

    // Get total revenue (sum of paid orders)
    const revenueResult = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
      .from(orders)
      .where(eq(orders.status, 'paid'));
    const totalRevenue = Number(revenueResult[0]?.total) || 0;

    // Get categories count
    const categoriesResult = await db.select({ count: sql`count(*)` }).from(categories);
    const totalCategories = Number(categoriesResult[0]?.count) || 0;

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
