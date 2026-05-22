/**
 * Auth Query Functions - KV-based
 * Better Auth stores sessions in KV, not D1
 */
import { initAuthInstance } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

type User = typeof users.$inferSelect;

export interface AuthResult {
  userId: string;
  user?: Pick<User, 'id' | 'email' | 'name' | 'role'>;
}

export interface AuthError {
  error: 'UNAUTHORIZED' | 'SESSION_EXPIRED' | 'USER_NOT_FOUND';
}

/**
 * 从 cookie 值获取认证用户 (KV-based)
 */
export async function getAuthenticatedUser(
  cookieValue: string | null | undefined
): Promise<AuthResult | AuthError> {
  if (!cookieValue) {
    return { error: 'UNAUTHORIZED' };
  }

  try {
    const { env } = await import('cloudflare:workers');
    initAuthInstance(env as Record<string, unknown>);

    if (!env.SESSION) {
      console.error('[Auth] SESSION KV not available');
      return { error: 'UNAUTHORIZED' };
    }

    // Read session from KV
    const stored = await env.SESSION.get(cookieValue);

    if (!stored) {
      return { error: 'SESSION_EXPIRED' };
    }

    const data = JSON.parse(stored);
    const session = data.session;
    const kvUser = data.user;

    // Check expiry
    if (!session || new Date(session.expiresAt) <= new Date()) {
      return { error: 'SESSION_EXPIRED' };
    }

    // Get user role from DB
    let role = 'user';
    if (env.DB) {
      try {
        const db = drizzle(env.DB as D1Database, { schema: { users } });
        const dbUser = await db.select({ role: users.role })
          .from(users)
          .where(eq(users.id, session.userId))
          .limit(1)
          .get();
        if (dbUser) {
          role = dbUser.role || 'user';
        }
      } catch (e) {
        console.error('[Auth] DB error:', e);
      }
    }

    return {
      userId: session.userId,
      user: {
        id: session.userId,
        email: kvUser?.email || '',
        name: kvUser?.name || '',
        role: role,
      }
    };
  } catch (error) {
    console.error('[Auth] Error:', error);
    return { error: 'UNAUTHORIZED' };
  }
}

/**
 * 从 cookies 对象获取认证用户
 */
export async function getAuthenticatedUserFromCookies(
  cookies: Record<string, string> | { get(name: string): { value: string | undefined } | undefined }
): Promise<AuthResult | AuthError> {
  const cookieValue = 'get' in cookies
    ? cookies.get('better-auth.session_token')?.value
    : cookies['better-auth.session_token'];
  return getAuthenticatedUser(cookieValue);
}

/**
 * 从 Request headers 获取认证用户
 */
export async function getAuthenticatedUserFromRequest(
  request: Request
): Promise<AuthResult | AuthError> {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [k, ...v] = c.split('=');
      return [k, v.join('=')];
    })
  );

  const sessionToken = cookies['better-auth.session_token'];
  return getAuthenticatedUser(sessionToken);
}

/**
 * 检查用户是否有特定角色
 */
export async function hasRole(userId: string, role: string): Promise<boolean> {
  try {
    const { env } = await import('cloudflare:workers');
    if (!env.DB) return false;

    const db = drizzle(env.DB as D1Database, { schema: { users } });
    const user = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .get() ?? undefined;

    return user?.role === role;
  } catch {
    return false;
  }
}

/**
 * 检查是否是超级管理员
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'super_admin');
}