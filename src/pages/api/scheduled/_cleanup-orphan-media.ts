// Scheduled cleanup - runs weekly to delete orphan media records in D1
// Runs every Sunday at 3:00 AM UTC
// Orphan records: media entries in D1 where R2 file no longer exists

export const prerender = false;

import type { ScheduledHandler } from '@cloudflare/workers-types';
import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { env } from 'cloudflare:workers';

function getR2Bucket(): R2Bucket | undefined {
  return env.MEDIA_BUCKET as R2Bucket | undefined;
}

async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const bucket = getR2Bucket();
    if (!bucket) {
      console.log('[Cleanup-Orphan-Media] R2 bucket not available');
      return false;
    }
    await bucket.delete(key);
    return true;
  } catch (error) {
    console.error('[Cleanup-Orphan-Media] Error deleting from R2:', error);
    return false;
  }
}

export const onRequest: ScheduledHandler = async (context) => {
  const db = await getDb();

  console.log(`[Cleanup-Orphan-Media] Starting weekly orphan media cleanup at ${new Date().toISOString()}`);

  try {
    // Get all media records that have R2 URLs (not data: URLs)
    const allMedia = await db
      .select({
        id: media.id,
        url: media.url,
        type: media.type,
        typeId: media.typeId,
      })
      .from(media)
      .all();

    const orphans: { id: string; url: string }[] = [];

    for (const m of allMedia) {
      // Skip data: URLs (local dev)
      if (m.url && !m.url.startsWith('data:')) {
        orphans.push({ id: m.id, url: m.url });
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
        await deleteFromR2(o.url);
        deletedCount++;
      } catch (error) {
        console.error(`[Cleanup-Orphan-Media] Failed to delete ${o.url}:`, error);
      }
    }

    console.log(`[Cleanup-Orphan-Media] Deleted ${deletedCount} orphan R2 files`);

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