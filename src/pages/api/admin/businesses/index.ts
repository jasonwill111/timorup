// Admin API - Businesses Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { businessPages, categories, users } from '@/db/schema';
import { eq, desc, sql, like, and, or } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';

async function requireAdminAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
  try {
    const authInstance = await initAuth();
    const { user } = await authInstance.api.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    if (!user || user.role !== 'admin') {
      return { authorized: false, error: new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } }) };
    }
    return { authorized: true, user };
  } catch {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
}

// GET - List all businesses
export async function GET({ url, request }: { url: URL; request: Request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const status = url.searchParams.get('status') || '';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status) {
      conditions.push(eq(businessPages.status, status));
    }
    if (search) {
      conditions.push(or(
        like(businessPages.title, `%${search}%`),
        like(businessPages.email, `%${search}%`)
      ));
    }

    const businessesResult = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      status: businessPages.status,
      email: businessPages.email,
      createdAt: businessPages.createdAt,
      categoryName: categories.name,
      ownerName: users.name,
    })
    .from(businessPages)
    .leftJoin(categories, eq(businessPages.categoryId, categories.id))
    .leftJoin(users, eq(businessPages.ownerId, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(businessPages.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

    const countResult = await db.select({ count: sql`count(*)` })
      .from(businessPages)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .get();

    return new Response(JSON.stringify({
      success: true,
      data: businessesResult,
      total: Number(countResult?.count) || 0,
      page,
      limit
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin businesses error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch businesses' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Create a new business
export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const body = await request.json();
    const { title, slug, email, contactNumber, aboutUs, latestUpdates, status, ownerId } = body;

    if (!title || !slug) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Title and slug are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if slug already exists
    const existing = await db.select({ id: businessPages.id })
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1)
      .get();

    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Slug already exists' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const id = `biz-${Date.now()}`;

    // Use first available user as default owner if not specified
    let finalOwnerId = ownerId;
    if (!finalOwnerId) {
      const usersResult = await db.select({ id: users.id }).from(users).limit(1).get();
      finalOwnerId = usersResult?.id || 'user-1';
    }

    await db.insert(businessPages).values({
      id,
      title,
      slug,
      email: email || null,
      contactNumber: contactNumber || null,
      aboutUs: aboutUs || null,
      latestUpdates: latestUpdates || null,
      status: status || 'draft',
      ownerId: finalOwnerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id, title, slug }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Admin businesses error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create business' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
