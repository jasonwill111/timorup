// Scheduled cleanup - runs weekly to delete expired businesses (60+ days after expiry)
export const prerender = false;

import type { ScheduledHandler } from '@cloudflare/workers-types';
import { getDb } from '@/lib/db';
import { businessPages, media, products } from '@/db/schema';
import { lt, isNull, or, inArray } from 'drizzle-orm';
import { deleteFolderFromR2 } from '@/lib/media';

// 60 days in milliseconds
const EXPIRY_GRACE_PERIOD_MS = 60 * 24 * 60 * 60 * 1000;

export const onRequest: ScheduledHandler = async (context) => {
  const db = await getDb();
  const now = Date.now();
  const cutoffDate = new Date(now - EXPIRY_GRACE_PERIOD_MS);

  console.log(`[Cleanup] Starting expired business cleanup at ${new Date().toISOString()}`);
  console.log(`[Cleanup] Cutoff date: ${cutoffDate.toISOString()}`);

  try {
    // Find businesses expired for 60+ days
    const expiredBusinesses = await db
      .select({
        id: businessPages.id,
        slug: businessPages.slug,
        entityType: businessPages.entityType,
        ownerId: businessPages.ownerId,
      })
      .from(businessPages)
      .where(
        lt(businessPages.expiryDate, cutoffDate)
      )
      .all();

    console.log(`[Cleanup] Found ${expiredBusinesses.length} expired businesses to delete`);

    let deletedCount = 0;

    for (const business of expiredBusinesses) {
      try {
        console.log(`[Cleanup] Processing business: ${business.id} (${business.slug})`);

        // 1. Delete R2 folder based on entity type
        const entityFolder = `${business.entityType || 'business'}/${business.id}`;
        await deleteFolderFromR2(entityFolder);
        console.log(`[Cleanup] Deleted R2 folder: ${entityFolder}`);

        // 2. Delete media records
        await db.delete(media).where(
          or(
            inArray(media.businessId, [business.id]),
            isNull(media.businessId)
          )
        ).where((f) => f.sql`url LIKE ${`${entityFolder}/%`}`)
        .run();
        console.log(`[Cleanup] Deleted media records for business ${business.id}`);

        // 3. Delete products
        await db.delete(products).where(inArray(products.businessPageId, [business.id])).run();
        console.log(`[Cleanup] Deleted products for business ${business.id}`);

        // 4. Delete business page
        await db.delete(businessPages).where(inArray(businessPages.id, [business.id])).run();
        console.log(`[Cleanup] Deleted business ${business.id}`);

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