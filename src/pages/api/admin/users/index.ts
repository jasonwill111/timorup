// Admin API - Users Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, desc, sql, like } from 'drizzle-orm';
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

// GET - List all users
export async function GET({ url, request }: { url: URL; request: Request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;

  try {
    const role = url.searchParams.get('role') || '';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let conditions = [];
    if (role) {
      conditions.push(eq(users.role, role));
    }
    if (search) {
      conditions.push(like(users.name, `%${search}%`));
    }

    const usersResult = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

    const countResult = await db.select({ count: sql`count(*)` }).from(users);

    return new Response(JSON.stringify({
      success: true,
      data: usersResult,
      total: Number(countResult[0]?.count) || 0,
      page,
      limit
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch users' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
