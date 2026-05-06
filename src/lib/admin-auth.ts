// Admin API Auth Helper
import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'editor' | 'admin' | 'super_admin';
}

export async function getAdminUser(request: Request): Promise<AuthUser | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) return null;

  try {
    const db = await getDb();
    const token = tokenMatch[1];

    // Direct DB query (same as session.ts)
    const session = await db.select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1)
      .get();

    if (!session) return null;

    // Check expiry
    const expiresAtMs = typeof session.expiresAt === 'number'
      ? session.expiresAt * 1000
      : new Date(session.expiresAt).getTime();

    if (expiresAtMs <= Date.now()) return null;

    // Get user
    const user = await db.select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .get();

    if (!user) return null;

    // Check if user has admin role
    const role = (user.role || 'user') as AuthUser['role'];
    if (!['admin', 'super_admin', 'editor'].includes(role)) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
    };
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Admin access required' }
  }), { status: 401, headers: { 'Content-Type': 'application/json' } });
}