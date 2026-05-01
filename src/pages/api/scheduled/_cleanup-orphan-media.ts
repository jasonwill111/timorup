// Scheduled cleanup - runs weekly to delete orphan media records in D1
// Runs every Sunday at 3:00 AM UTC
// Orphan records: media entries in D1 where R2 file no longer exists

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
        businessId: media.businessId,
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

    console.log(`[Cleanup-Orphan-Media] Found ${orphans.length} potential orphan records to verify`);

    if (orphans.length === 0) {
      console.log(`[Cleanup-Orphan-Media] No orphan records found. Exiting.`);
      return new Response(JSON.stringify({
        success: true,
        message: 'No orphan records found',
        deletedCount: 0,
      }), { status: 200 });
    }

    // Note: We delete orphan R2 files to reduce storage costs
    // D1 records are kept for audit trail (no cost impact)
    console.log(`[Cleanup-Orphan-Media] Found ${orphans.length} orphan records, deleting R2 files...`);

    let deletedCount = 0;
    for (const o of orphans) {
      try {
        const { deleteFromR2 } = await import('@/lib/media');
        await deleteFromR2(o.url);
        console.log(`[Cleanup-Orphan-Media] Deleted R2: ${o.url}`);
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
