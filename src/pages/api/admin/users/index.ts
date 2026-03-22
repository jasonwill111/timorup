// Admin API - Users Management
export const prerender = false;

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, desc, sql, like } from 'drizzle-orm';

// GET - List all users
export async function GET({ url }: { url: URL }) {
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
