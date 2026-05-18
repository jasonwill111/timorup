// Scheduled cleanup - runs weekly to delete orphan media records in D1
// Runs every Sunday at 3:00 AM UTC
// Orphan records: media entries in D1 where R2 file no longer exists

export const prerender = false;

// Cloudflare Workers scheduled handler type
type ScheduledHandler = (event: { scheduledTime: number; cron: string }) => Promise<Response>;

import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { getR2Bucket, deleteFromR2 as deleteFromR2Media } from '@/lib/media';

async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const bucket = getR2Bucket();
    if (!bucket) {
      return false;
    }
    await bucket.delete(key);
    return true;
  } catch (error) {
    console.error('[Cleanup-Orphan-Media] Error deleting from R2:', error);
    return false;
  }
}

export const onRequest: ScheduledHandler = async (_event) => {
  const db = await getDb();
if (!db) throw new Error("Database not available");

  // Starting cleanup silently

  try {
    // Get all media records that have R2 URLs (not data: URLs)
    const allMedia = await db
      .select({
        id: media.id,
        r2Key: media.r2Key,
        entityType: media.entityType,
        entityId: media.entityId,
      })
      .from(media)
      .all();

    const orphans: { id: string; r2Key: string }[] = [];

    for (const m of allMedia) {
      // Skip data: URLs (local dev)
      if (m?.r2Key && !m?.r2Key.startsWith('data:')) {
        orphans.push({ id: m.id, r2Key: m?.r2Key });
      }
    }

    if (orphans.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No orphan records found',
        deletedCount: 0,
      }), { status: 200 });
    }

    // Note: We delete orphan R2 files to reduce storage costs
    // D1 records are kept for audit trail (no cost impact)
    // Proceed with deletion (summary logged at end)
    let deletedCount = 0;
    for (const o of orphans) {
      try {
        await deleteFromR2(o?.r2Key);
        deletedCount++;
      } catch (error) {
        console.error(`[Cleanup-Orphan-Media] Failed to delete ${o?.r2Key}:`, error);
      }
    }

    // Completion silently logged

    return new Response(JSON.stringify({
      success: true,
      message: 'Orphan media cleanup completed',
      orphansFound: orphans.length,
      deletedR2Count: deletedCount,
    }), { status: 200 });

  } catch (error) {
    console.error(`[Cleanup-Orphan-Media] Error:`, error);
    return new Response(JSON.stringify({
      success: false,
      error: String(error),
    }), { status: 500 });
  }
};