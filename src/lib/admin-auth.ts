// Admin API Auth Helper
// Uses KV directly for session instead of better-auth's getSession
import { initAuthInstance } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'editor' | 'admin' | 'super_admin';
}

export async function getAdminUser(request?: Request): Promise<AuthUser | null> {
  try {
    if (!request) return null;

    const { env } = await import('cloudflare:workers');

    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    const match = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

    if (!match) return null;

    const token = match[1];

    // Read session directly from KV
    if (!env.SESSION) return null;

    const stored = await env.SESSION.get(token);
    if (!stored) return null;

    const data = JSON.parse(stored);
    const session = data.session;
    const kvUser = data.user;

    if (!session || new Date(session.expiresAt) <= new Date()) return null;

    // Initialize auth instance
    initAuthInstance(env as Record<string, unknown>);

    // Get role from database
    if (!env.DB) return null;

    const db = drizzle(env.DB as D1Database, { schema: { users } });
    const dbUser = await db.select({ id: users.id, email: users.email, name: users.name, role: users.role })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .get();

    if (!dbUser) return null;

    const role = (dbUser.role || 'user') as AuthUser['role'];
    if (!['admin', 'super_admin', 'editor'].includes(role)) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email || '',
      name: dbUser.name,
      role,
    };
  } catch (e) {
    console.error('[AdminAuth] Error:', e);
    return null;
  }
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Admin access required' }
  }), { status: 401, headers: { 'Content-Type': 'application/json' } });
}
