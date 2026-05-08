// Admin API - Dashboard Stats
export const prerender = false;

import { getDb } from '@/lib/db';
import { users, businessPages, orders, categories, products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET({ request }: { request: Request }) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return unauthorizedResponse();
  }

  const db = await getDb();

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

    // Get non-profit businesses count
    const nonProfitsResult = await db.select({ count: sql`count(*)` })
      .from(businessPages)
      .where(eq(businessPages.entityType, 'nonprofit'))
      .get();
    const totalNonProfits = Number(nonProfitsResult?.count) || 0;

    // Get total subscriptions (using orders table - it stores subscription data)
    const subscriptionsResult = await db.select({ count: sql`count(*)` }).from(orders).get();
    const totalSubscriptions = Number(subscriptionsResult?.count) || 0;

    // Get total revenue (sum of paid subscriptions)
    const revenueResult = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
      .from(orders)
      .where(eq(orders.status, 'paid'))
      .get();
    const totalRevenue = Number(revenueResult?.total) || 0;

    // Get total products/SKUs
    const productsResult = await db.select({ count: sql`count(*)` }).from(products).get();
    const totalProducts = Number(productsResult?.count) || 0;

    // Get categories count
    const categoriesResult = await db.select({ count: sql`count(*)` }).from(categories).get();
    const totalCategories = Number(categoriesResult?.count) || 0;

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalUsers,
        totalBusinesses,
        totalNonProfits,
        liveBusinesses,
        totalSubscriptions,
        totalRevenue,
        totalProducts,
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
