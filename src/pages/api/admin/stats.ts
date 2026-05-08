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

    // Get subscriptions expiring within 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringResult = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(sql`${orders.status} = 'active' AND ${orders.expiresAt} IS NOT NULL AND ${orders.expiresAt} <= ${sevenDaysFromNow.toISOString()}`)
      .get();
    const expiringSoon = Number(expiringResult?.count) || 0;

    // Get total products/SKUs
    const productsResult = await db.select({ count: sql`count(*)` }).from(products).get();
    const totalProducts = Number(productsResult?.count) || 0;

    // Get categories count
    const categoriesResult = await db.select({ count: sql`count(*)` }).from(categories).get();
    const totalCategories = Number(categoriesResult?.count) || 0;

    // Get MTD (Month to Date) stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const mtdRevenueResult = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
      .from(orders)
      .where(sql`${orders.status} = 'paid' AND ${orders.paidAt} >= ${startOfMonth}`)
      .get();
    const mtdRevenue = Number(mtdRevenueResult?.total) || 0;

    const mtdNewSubscriptionsResult = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(sql`${orders.paidAt} >= ${startOfMonth}`)
      .get();
    const mtdNewSubscriptions = Number(mtdNewSubscriptionsResult?.count) || 0;

    const mtdNewUsersResult = await db.select({ count: sql`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= ${startOfMonth}`)
      .get();
    const mtdNewUsers = Number(mtdNewUsersResult?.count) || 0;

    // Get last 6 months revenue for bar chart
    const monthlyData: { month: string; revenue: number; subscriptions: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthRevenue = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
        .from(orders)
        .where(sql`${orders.status} = 'paid' AND ${orders.paidAt} >= ${monthStart.toISOString()} AND ${orders.paidAt} <= ${monthEnd.toISOString()}`)
        .get();

      const monthSubscriptions = await db.select({ count: sql`count(*)` })
        .from(orders)
        .where(sql`${orders.paidAt} >= ${monthStart.toISOString()} AND ${orders.paidAt} <= ${monthEnd.toISOString()}`)
        .get();

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Number(monthRevenue?.total) || 0,
        subscriptions: Number(monthSubscriptions?.count) || 0
      });
    }

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
        expiringSoon,
        pendingBusinesses: totalBusinesses - liveBusinesses,
        mtd: {
          revenue: mtdRevenue,
          newSubscriptions: mtdNewSubscriptions,
          newUsers: mtdNewUsers
        },
        monthly: monthlyData
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
