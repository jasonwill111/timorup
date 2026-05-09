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

    // Get subscriptions expiring within 7 days - use timestamp comparison
    const now = Math.floor(Date.now() / 1000);
    const sevenDaysLater = now + (7 * 24 * 60 * 60);
    const expiringResult = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(sql`status = 'active' AND expiry_date IS NOT NULL AND expiry_date > ${now} AND expiry_date <= ${sevenDaysLater}`)
      .get();
    const expiringSoon = Number(expiringResult?.count) || 0;

    // Get total products/SKUs
    const productsResult = await db.select({ count: sql`count(*)` }).from(products).get();
    const totalProducts = Number(productsResult?.count) || 0;

    // Get categories count
    const categoriesResult = await db.select({ count: sql`count(*)` }).from(categories).get();
    const totalCategories = Number(categoriesResult?.count) || 0;

    // Get MTD (Month to Date) stats - use timestamp comparison
    const startOfMonthTimestamp = Math.floor(new Date().setDate(1) / 1000);

    const mtdRevenueResult = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
      .from(orders)
      .where(sql`status = 'paid' AND paid_date >= ${startOfMonthTimestamp}`)
      .get();
    const mtdRevenue = Number(mtdRevenueResult?.total) || 0;

    const mtdNewSubscriptionsResult = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(sql`paid_date >= ${startOfMonthTimestamp}`)
      .get();
    const mtdNewSubscriptions = Number(mtdNewSubscriptionsResult?.count) || 0;

    const mtdNewUsersResult = await db.select({ count: sql`count(*)` })
      .from(users)
      .where(sql`created_at >= ${startOfMonthTimestamp}`)
      .get();
    const mtdNewUsers = Number(mtdNewUsersResult?.count) || 0;

    // Get last 6 months data for charts
    const monthlyData: { month: string; revenue: number; subscriptions: number }[] = [];
    const monthlyUsers: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartTs = Math.floor(monthStart.getTime() / 1000);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);
      const monthEndTs = Math.floor(monthEnd.getTime() / 1000);

      const monthRevenue = await db.select({ total: sql`COALESCE(SUM(amount), 0)` })
        .from(orders)
        .where(sql`status = 'paid' AND paid_date >= ${monthStartTs} AND paid_date <= ${monthEndTs}`)
        .get();

      const monthSubscriptions = await db.select({ count: sql`count(*)` })
        .from(orders)
        .where(sql`paid_date >= ${monthStartTs} AND paid_date <= ${monthEndTs}`)
        .get();

      const monthNewUsers = await db.select({ count: sql`count(*)` })
        .from(users)
        .where(sql`created_at >= ${monthStartTs} AND created_at <= ${monthEndTs}`)
        .get();

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Number(monthRevenue?.total) || 0,
        subscriptions: Number(monthSubscriptions?.count) || 0
      });
      monthlyUsers.push(Number(monthNewUsers?.count) || 0);
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
        monthly: monthlyData,
        monthlyUsers
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch stats', details: message }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}