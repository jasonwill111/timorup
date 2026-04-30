// Admin API - Users Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { users, sessions } from '@/db/schema';
import { eq, desc, sql, like, and, or } from 'drizzle-orm';


async function requireAdminAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }

  const db = await getDb();
  const session = await db.select()
    .from(sessions)
    .where(eq(sessions.token, tokenMatch[1]))
    .limit(1)
    .get();

  if (!session || !session.expiresAt || new Date(session.expiresAt) < new Date()) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Session expired' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }

  const user = await db.select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)
    .get();

  if (!user || user.role !== 'admin') {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' }
    }), { status: 403, headers: { 'Content-Type': 'application/json' } }) };
  }
  return { authorized: true, user };
}

// GET - List all users with pagination
export async function GET({ request }: { request: Request }) {
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const db = await getDb();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';

    let whereConditions = [];
    if (search) {
      whereConditions.push(or(
        like(users.email, `%${search}%`),
        like(users.name, `%${search}%`)
      ));
    }
    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      emailVerified: users.emailVerified,
      phone: users.phone,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause)
      .get();
    const total = Number(countResult?.count) || 0;

    return new Response(JSON.stringify({
      success: true,
      data: allUsers,
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