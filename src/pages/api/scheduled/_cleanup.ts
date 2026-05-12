// Scheduled cleanup - runs weekly to delete expired businesses (60+ days after expiry)
export const prerender = false;

import type { ScheduledHandler } from '@cloudflare/workers-types';
import { getDb } from '@/lib/db';
import { businesses, media, products } from '@/db/schema';
import { lt, isNull, or, inArray } from 'drizzle-orm';
import { env } from 'cloudflare:workers';

// 60 days in milliseconds
const EXPIRY_GRACE_PERIOD_MS = 60 * 24 * 60 * 60 * 1000;

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
  const now = Date.now();
  const cutoffDate = new Date(now - EXPIRY_GRACE_PERIOD_MS);

  console.log(`[Cleanup] Starting expired business cleanup`);

  try {
    // Find businesses expired for 60+ days (only from businesses table)
    const expiredBusinesses = await db
      .select({
        id: businesses.id,
        slug: businesses.slug,
        ownerId: businesses.ownerId,
      })
      .from(businesses)
      .where(
        lt(businesses.expiryDate, cutoffDate)
      )
      .all();

    console.log(`[Cleanup] Found ${expiredBusinesses.length} expired businesses to delete`);

    let deletedCount = 0;

    for (const business of expiredBusinesses) {
      try {
        // 1. Delete R2 folder
        const entityFolder = `business/${business.id}`;
        await deleteFolderFromR2(entityFolder);

        // 2. Delete media records
        await db.delete(media).where(
          or(
            inArray(media.businessId, [business.id]),
            isNull(media.businessId)
          )
        ).where((f) => f.sql`url LIKE ${`${entityFolder}/%`}`)
        .run();

        // 3. Delete products
        await db.delete(products).where(inArray(products.businessPageId, [business.id])).run();

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