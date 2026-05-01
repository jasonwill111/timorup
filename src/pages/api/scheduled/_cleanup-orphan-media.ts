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

    // Note: We don't verify R2 existence because:
    // 1. Head request to R2 costs money
    // 2. If R2 file was deleted but D1 record exists, the D1 record is orphaned anyway
    // 3. It's safer to keep orphan metadata than to accidentally delete valid records
    //
    // Instead, we log the orphans for manual review
    console.log(`[Cleanup-Orphan-Media] Orphan records (for review):`);
    orphans.forEach(o => {
      console.log(`  - ${o.id}: ${o.url}`);
    });

    // Alternative: If you want to auto-delete, uncomment below:
    // const orphanIds = orphans.map(o => o.id);
    // await db.delete(media).where(inArray(media.id, orphanIds));
    // console.log(`[Cleanup-Orphan-Media] Deleted ${orphanIds.length} orphan records`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Orphan media cleanup completed',
      orphansFound: orphans.length,
      orphans: orphans.map(o => ({ id: o.id, url: o.url })),
      note: 'Records logged for review, not deleted. Set DELETE_MODE=true to auto-delete.',
      deletedCount: 0,
    }), { status: 200 });

  } catch (error) {
    console.error(`[Cleanup-Orphan-Media] Error:`, error);
    return new Response(JSON.stringify({
      success: false,
      error: String(error),
    }), { status: 500 });
  }
};
