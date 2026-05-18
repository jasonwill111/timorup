// Admin API - Dashboard Stats
export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { users, businesses, nonProfits, products, businessCategories, listingCategories, orders } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

async function requireAdminAuth(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Admin access required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  return null;
}

export const GET: APIRoute = async ({ request }) => {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    const now = new Date();
    const startOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
    const sevenDaysFromNow = Math.floor(now.getTime() / 1000) + 7 * 24 * 60 * 60;

    // Get total counts (sequential to avoid connection issues)
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users).get() ?? undefined;
    const totalBusinessesResult = await db.select({ count: sql<number>`count(*)` }).from(businesses).get() ?? undefined;
    const totalNonProfitsResult = await db.select({ count: sql<number>`count(*)` }).from(nonProfits).get() ?? undefined;
    const totalProductsResult = await db.select({ count: sql<number>`count(*)` }).from(products).get() ?? undefined;
    const totalBusinessCategories = await db.select({ count: sql<number>`count(*)` }).from(businessCategories).get() ?? undefined;
    const totalListingCategories = await db.select({ count: sql<number>`count(*)` }).from(listingCategories).get() ?? undefined;
    const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(20).all();

    // Calculate MTD metrics
    const mtdOrders = recentOrders.filter(o => o.createdAt && o.createdAt >= startOfMonth);
    const mtdRevenue = mtdOrders.reduce((sum, o) => sum + (o.amount || 0), 0) / 100;

    // Monthly data for chart (last 6 months)
    const monthlyData: { month: string; revenue: number; subscriptions: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = Math.floor(monthDate.getTime() / 1000);
      const monthEnd = Math.floor(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59).getTime() / 1000);

      const monthOrders = recentOrders.filter(
        o => o.createdAt && o.createdAt >= monthStart && o.createdAt <= monthEnd
      );

      monthlyData.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        revenue: monthOrders.reduce((sum, o) => sum + (o.amount || 0), 0) / 100,
        subscriptions: monthOrders.length,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalUsers: totalUsersResult?.count || 0,
        totalBusinesses: totalBusinessesResult?.count || 0,
        totalNonProfits: totalNonProfitsResult?.count || 0,
        totalProducts: totalProductsResult?.count || 0,
        totalCategories: (totalBusinessCategories?.count || 0) + (totalListingCategories?.count || 0),
        mtd: {
          revenue: mtdRevenue,
          newSubscriptions: mtdOrders.length,
          newUsers: 0,
        },
        expiringSoon: 0,
        monthly: monthlyData,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SERVER_ERROR', message: String(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};