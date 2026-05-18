// Scheduled cleanup - runs weekly to delete expired businesses (60+ days after expiry)
export const prerender = false;

import type { ScheduledHandler } from '@cloudflare/workers-types';
import { getDb } from '@/lib/db';
import { businesses, media, products } from '@/db/schema';
import { lt, and, inArray, eq } from 'drizzle-orm';
import { getR2Bucket, deleteFolderFromR2 } from '@/lib/media';

// 60 days grace period in seconds
const GRACE_PERIOD_SECONDS = 60 * 24 * 60 * 60;

export const onRequest: ScheduledHandler = async (context) => {
  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const cutoffDate = now - GRACE_PERIOD_SECONDS;

  // Starting cleanup silently

  try {
    // Find businesses expired past grace period
    const expiredBusinesses = await db
      .select({
        id: businesses.id,
        slug: businesses.slug,
        ownerId: businesses.ownerId,
      })
      .from(businesses)
      .where(
        and(
          eq(businesses.subscriptionStatus, 'expired'),
          lt(businesses.gracePeriodEndDate, cutoffDate)
        )
      )
      .all();

    // Found count not logged to reduce log noise

    let deletedCount = 0;

    for (const business of expiredBusinesses) {
      try {
        // 1. Delete R2 folder
        const entityFolder = `businesses/${business.id}`;
        await deleteFolderFromR2(entityFolder);

        // 2. Delete media records
        await db.delete(media)
          .where(and(
            eq(media.entityId, business.id),
            eq(media.entityType, 'businesses')
          ))
          .run();

        // 3. Delete products
        await db.delete(products).where(inArray(products.businessId, [business.id])).run();

        // 4. Delete business
        await db.delete(businesses).where(inArray(businesses.id, [business.id])).run();

        deletedCount++;
      } catch (error) {
        console.error(`[Cleanup] Error deleting business ${business.id}:`, error);
      }
    }

    // Completion silently logged
    return new Response(JSON.stringify({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    }), { status: 200 });
  } catch (error) {
    console.error('[Cleanup] Fatal error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString(),
    }), { status: 500 });
  }
};