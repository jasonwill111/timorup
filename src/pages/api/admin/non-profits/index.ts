// Admin API - Non-Profits Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { nonProfits } from '@/db/schema';
import { eq, desc, sql, like, and, or } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

async function requireAdminAuth(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return { authorized: false, error: unauthorizedResponse() };
  }
  return { authorized: true, user: adminUser };
}

// GET - List all non-profits with pagination
export async function GET({ request }: { request: Request }) {
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
    const url = new URL(request?.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    let whereConditions = [];
    if (search) {
      whereConditions.push(or(
        like(nonProfits.title, `%${search}%`),
        like(nonProfits.aboutUs, `%${search}%`)
      ));
    }
    if (status) {
      whereConditions.push(eq(nonProfits.status, status));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const items = await db.select({
      id: nonProfits.id,
      title: nonProfits.title,
      slug: nonProfits.slug,
      status: nonProfits.status,
      planType: nonProfits.planType,
      ownerId: nonProfits.ownerId,
      categoryId: nonProfits.categoryId,
      contactName: nonProfits.contactName,
      email: nonProfits.email,
      ratingAverage: nonProfits.ratingAverage,
      ratingCount: nonProfits.ratingCount,
      views: nonProfits.views,
      likes: nonProfits.likes,
      saves: nonProfits.saves,
      createdAt: nonProfits.publishDate,
    })
    .from(nonProfits)
    .where(whereClause)
    .orderBy(desc(nonProfits.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(nonProfits)
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