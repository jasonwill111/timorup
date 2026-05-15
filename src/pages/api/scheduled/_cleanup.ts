// Scheduled cleanup - runs weekly to delete expired businesses (60+ days after expiry)
export const prerender = false;

import type { ScheduledHandler } from '@cloudflare/workers-types';
import { getDb } from '@/lib/db';
import { businesses, media, products } from '@/db/schema';
import { lt, and, inArray } from 'drizzle-orm';
import { env } from 'cloudflare:workers';

// 60 days grace period in seconds
const GRACE_PERIOD_SECONDS = 60 * 24 * 60 * 60;

function getR2Bucket(): R2Bucket | undefined {
  return env.MEDIA_BUCKET as R2Bucket | undefined;
}

async function deleteFolderFromR2(prefix: string): Promise<boolean> {
  try {
    const bucket = getR2Bucket();
    if (!bucket) {
      console.log('[Cleanup] R2 bucket not available, skipping folder delete');
      return false;
    }

    let cursor: string | undefined;
    do {
      const result = await bucket.list({ prefix, cursor, limit: 1000 });
      for (const obj of result.objects ?? []) {
        if (obj.key) {
          await bucket.delete(obj.key);
        }
      }
      cursor = result.truncated ? result.cursor : undefined;
    } while (cursor);

    return true;
  } catch (error) {
    console.error('[Cleanup] Error deleting folder from R2:', error);
    return false;
  }
}

export const onRequest: ScheduledHandler = async (context) => {
  const db = await getDb();
  const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const cutoffDate = now - GRACE_PERIOD_SECONDS;

  console.log(`[Cleanup] Starting expired business cleanup`);

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

    console.log(`[Cleanup] Found ${expiredBusinesses.length} expired businesses to delete`);

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

    console.log(`[Cleanup] Completed. Deleted ${deletedCount} businesses`);
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