// Admin API - Businesses Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq, desc, sql, like, and, or } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

async function requireAdminAuth(request: Request) {
  const adminUser = await getAdminUser(request);
  if (!adminUser) {
    return { authorized: false, error: unauthorizedResponse() };
  }
  return { authorized: true, user: adminUser };
}

// GET - List all businesses with pagination
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
    const planType = url.searchParams.get('planType') || '';

    let whereConditions = [];
    if (search) {
      whereConditions.push(or(
        like(businesses.title, `%${search}%`),
        like(businesses.aboutUs, `%${search}%`)
      ));
    }
    if (status) {
      whereConditions.push(eq(businesses.status, status));
    }
    if (planType) {
      whereConditions.push(eq(businesses.planType, planType));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const result = await db.select({
      id: businesses.id,
      title: businesses.title,
      slug: businesses.slug,
      status: businesses.status,
      planType: businesses.planType,
      ownerId: businesses.ownerId,
      categoryId: businesses.categoryId,
      contactName: businesses.contactName,
      email: businesses.email,
      ratingAverage: businesses.ratingAverage,
      ratingCount: businesses.ratingCount,
      views: businesses.views,
      likes: businesses.likes,
      saves: businesses.saves,
      createdAt: businesses.publishDate,
    })
    .from(businesses)
    .where(whereClause)
    .orderBy(desc(businesses.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(businesses)
      .where(whereClause)
      .get() ?? undefined;
    const total = Number(countResult?.count) || 0;

    return new Response(JSON.stringify({
      success: true,
      data: result,
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