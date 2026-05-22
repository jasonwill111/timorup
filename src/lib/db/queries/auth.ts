/**
 * Session Query Functions
 * 统一 session 认证逻辑，替代散落的重复代码
 */
import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
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
 * Check if session is expired (expiresAt is integer seconds)
 */
function isSessionExpired(expiresAt: number | Date): boolean {
  const expiresAtMs = typeof expiresAt === 'number'
    ? expiresAt * 1000
    : expiresAt.getTime();
  return expiresAtMs <= Date.now();
}

/**
 * 从 cookie 值获取认证用户
 */
export async function getAuthenticatedUser(
  cookieValue: string | null | undefined
): Promise<AuthResult | AuthError> {
  if (!cookieValue) {
    return { error: 'UNAUTHORIZED' };
  }

  const db = await getDb();
if (!db) throw new Error("Database not available");

  // 查询 session (只匹配 token，expiry 在 JS 中检查)
  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, cookieValue))
    .limit(1)
    .get() ?? undefined;

  if (!session) {
    return { error: 'SESSION_EXPIRED' };
  }

  // 检查 expiry (JS 层处理，避免 SQL 整数 vs Date 比较问题)
  if (isSessionExpired(session.expiresAt)) {
    return { error: 'SESSION_EXPIRED' };
  }

  // 查询用户
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)
    .get() ?? undefined;

  if (!user) {
    return { error: 'USER_NOT_FOUND' };
  }

  return { userId: user.id, user };
}

/**
 * 从 cookies 对象获取认证用户
 * 支持 Astro actions 的 cookies 参数格式
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
  const db = await getDb();
if (!db) throw new Error("Database not available");
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .get() ?? undefined;

  return user?.role === role;
}

/**
 * 检查是否是超级管理员
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'super_admin');
}