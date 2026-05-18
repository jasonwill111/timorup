// Admin API - Public Sectors Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { publicSectors } from '@/db/schema';
import { eq, desc, sql, like, and, or } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

async function requireAdminAuth(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return { authorized: false, error: unauthorizedResponse() };
  }
  return { authorized: true, user: adminUser };
}

// GET - List all public sectors with pagination
export async function GET({ request }: { request: Request }) {
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    let whereConditions = [];
    if (search) {
      whereConditions.push(or(
        like(publicSectors.title, `%${search}%`),
        like(publicSectors.aboutUs, `%${search}%`)
      ));
    }
    if (status) {
      whereConditions.push(eq(publicSectors.status, status));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const items = await db.select({
      id: publicSectors.id,
      title: publicSectors.title,
      slug: publicSectors.slug,
      status: publicSectors.status,
      planType: publicSectors.planType,
      ownerId: publicSectors.ownerId,
      categoryId: publicSectors.categoryId,
      contactName: publicSectors.contactName,
      email: publicSectors.email,
      ratingAverage: publicSectors.ratingAverage,
      ratingCount: publicSectors.ratingCount,
      views: publicSectors.views,
      likes: publicSectors.likes,
      saves: publicSectors.saves,
      createdAt: publicSectors.publishDate,
    })
    .from(publicSectors)
    .where(whereClause)
    .orderBy(desc(publicSectors.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(publicSectors)
      .get() ?? undefined;
    const total = Number(countResult?.count) || 0;

    return new Response(JSON.stringify({
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error instanceof Error ? error.message : String(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}