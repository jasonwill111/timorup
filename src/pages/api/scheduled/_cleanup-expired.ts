// Scheduled cleanup job - Delete expired listings after grace period
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses, products } from '@/db/schema';
import { eq, lt, and, sql } from 'drizzle-orm';

export async function GET({ request }: { params: Record<string, string>; request: Request }) {
  // Verify this is an internal/scheduled call (could add secret key check)
  const authHeader = request.headers.get('authorization');
  const expectedToken = import.meta.env.CLEANUP_SECRET;

  if (authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Unauthorized' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  const now = new Date();
  const nowTimestamp = Math.floor(now.getTime() / 1000);

  try {
    // Find businesses past grace period (businesses only)
    const expiredBusinesses = await db.select()
      .from(businesses)
      .where(and(
        eq(businesses.subscriptionStatus, 'expired'),
        lt(businesses.gracePeriodEndDate, nowTimestamp)
      ))
      .all();

    const results: {
      deleted: string[];
      failed: { id: string; error: string }[];
      totalSkusDeleted: number;
    } = {
      deleted: [],
      failed: [],
      totalSkusDeleted: 0,
    };

    for (const business of expiredBusinesses) {
      try {
        // Count SKUs before deletion
        const skuCountResult = await db.select({ count: sql<number>`count(*)` })
          .from(products)
          .where(eq(products.businessId, business.id))
          .get() ?? undefined;
        const skuCount = Number(skuCountResult?.count) || 0;

        // Delete all SKUs for this listing
        await db.delete(products)
          .where(eq(products.businessId, business.id))
          .run();

        results.totalSkusDeleted += skuCount;

        // Delete the business
        await db.delete(businesses)
          .where(eq(businesses.id, business.id))
          .run();

        results.deleted.push(business.id);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        results.failed.push({ id: business.id, error });
        console.error(`[Cleanup] Failed to delete business ${business.id}:`, error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        executedAt: now.toISOString(),
        businessesFound: expiredBusinesses.length,
        deleted: results.deleted.length,
        skusDeleted: results.totalSkusDeleted,
        failed: results.failed.length,
        deletedIds: results.deleted,
        failedIds: results.failed,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Cleanup] Job failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Cleanup job failed', details: String(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Also support POST for easier cron triggering
export async function POST({ request }: { params: Record<string, string>; request: Request }) {
  return GET({ request, params: {} });
}
