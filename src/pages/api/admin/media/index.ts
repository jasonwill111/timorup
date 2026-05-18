// Admin Media API - List and manage all media
export const prerender = false;

import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { desc, eq, sql, and } from 'drizzle-orm';

// GET - List all media (admin only)
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const url = new URL(request?.url);
    const type = url.searchParams.get('type'); // 'business' | 'blog' | 'general'
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = db.select().from(media);

    if (type) {
      query = query.where(eq(media.entityType, type));
    }

    const mediaList = await query
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset)
      .all();

    // Get total count
    const countResult = await db.select({ count: sql`count(*)` }).from(media);

    return new Response(JSON.stringify({
      success: true,
      data: mediaList,
      total: Number(countResult[0]?.count) || 0,
      page,
      limit,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin media error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch media' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
