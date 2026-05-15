// Scheduled job - Mark expired subscriptions and set grace period
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq, lt, and } from 'drizzle-orm';
import { calculateGracePeriodEnd } from '@/lib/subscription';

export async function GET({ request }: { params: Record<string, string>; request: Request }) {
  // Verify this is an internal/scheduled call
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
    // Find active subscriptions that have passed expiry date (businesses only)
    const expiredSubscriptions = await db.select()
      .from(businesses)
      .where(and(
        eq(businesses.subscriptionStatus, 'active'),
        lt(businesses.expiryDate, nowTimestamp)
      ))
      .all();

    const results: {
      markedExpired: string[];
      failed: { id: string; error: string }[];
    } = {
      markedExpired: [],
      failed: [],
    };

    for (const listing of expiredSubscriptions) {
      try {
        const expiryTimestamp = listing.expiryDate as number;
        const gracePeriodEnd = calculateGracePeriodEnd(expiryTimestamp);

        await db.update(businesses)
          .set({
            subscriptionStatus: 'expired',
            gracePeriodEndDate: gracePeriodEnd,
            updatedAt: new Date(),
          })
          .where(eq(businesses.id, listing.id))
          .run();

        results.markedExpired.push(listing.id);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        results.failed.push({ id: listing.id, error });
        console.error(`[Mark Expired] Failed to update listing ${listing.id}:`, error);
      }
    }

    // Summary logged internally for debugging if needed, not needed in production output
    return new Response(JSON.stringify({
      success: true,
      data: {
        executedAt: now.toISOString(),
        found: expiredSubscriptions.length,
        markedExpired: results.markedExpired.length,
        failed: results.failed.length,
        expiredIds: results.markedExpired,
        failedIds: results.failed,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Mark Expired] Job failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Job failed', details: String(error) }
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
