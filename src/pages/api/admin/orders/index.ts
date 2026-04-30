// Admin API - Orders Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { orders, businessPages, users, sessions } from '@/db/schema';
import { eq, desc, sql, like, or, and } from 'drizzle-orm';


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