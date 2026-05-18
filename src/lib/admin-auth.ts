// Admin API Auth Helper
import { getDb } from '@/lib/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'editor' | 'admin' | 'super_admin';
}

export async function getAdminUser(request?: Request): Promise<AuthUser | null> {
  try {
    // For Astro actions, request is passed via context
    const cookieHeader = request?.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (!tokenMatch) return null;

    const token = tokenMatch[1];
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

    const session = await db.select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1)
      .get() ?? undefined;

    if (!session) return null;

    const expiresAtMs = typeof session.expiresAt === 'number'
      ? session.expiresAt * 1000
      : new Date(session.expiresAt).getTime();

    if (expiresAtMs <= Date.now()) return null;

    const user = await db.select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .get() ?? undefined;

    if (!user) return null;

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