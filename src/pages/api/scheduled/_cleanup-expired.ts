// Scheduled cleanup job - Delete expired listings after grace period
export const prerender = false;

import { getDb } from '@/lib/db';
import { businessPages, products, orders } from '@/db/schema';
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
  const now = new Date();
  const nowTimestamp = Math.floor(now.getTime() / 1000);

  try {
    // Find listings past grace period
    // - subscriptionStatus = 'expired'
    // - gracePeriodEndDate < now
    const expiredListings = await db.select()
      .from(businessPages)
      .where(and(
        eq(businessPages.subscriptionStatus, 'expired'),
        lt(businessPages.gracePeriodEndDate, nowTimestamp)
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

    for (const listing of expiredListings) {
      try {
        // Count SKUs before deletion
        const skuCountResult = await db.select({ count: sql<number>`count(*)` })
          .from(products)
          .where(eq(products.businessPageId, listing.id))
          .get();
        const skuCount = Number(skuCountResult?.count) || 0;

        // Delete all SKUs for this listing
        await db.delete(products)
          .where(eq(products.businessPageId, listing.id))
          .run();

        results.totalSkusDeleted += skuCount;

        // Delete the listing
        await db.delete(businessPages)
          .where(eq(businessPages.id, listing.id))
          .run();

        results.deleted.push(listing.id);
        console.log(`[Cleanup] Deleted listing: ${listing.id} (${listing.title}), ${skuCount} SKUs`);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        results.failed.push({ id: listing.id, error });
        console.error(`[Cleanup] Failed to delete listing ${listing.id}:`, error);
      }
    }

    // Log cleanup summary
    console.log(`[Cleanup] Summary: ${results.deleted.length} listings deleted, ${results.totalSkusDeleted} SKUs removed, ${results.failed.length} failures`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        executedAt: now.toISOString(),
        listingsFound: expiredListings.length,
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
