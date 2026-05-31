// Admin Auth - unified via D1 sessions
import { getAuthenticatedUserFromCookies, type AuthResult, type AuthError } from '@/lib/db/queries/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_ROLES = ['admin', 'super_admin', 'editor'] as const;
type AdminRole = typeof ADMIN_ROLES[number];

// Re-export for use in other modules
export { ADMIN_ROLES };
export type { AdminRole };

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
}

/**
 * Require admin role - uses D1 sessions (same as getAuthenticatedUserFromCookies)
 */
export async function requireAdmin(
  cookies: Record<string, string> | { get(name: string): { value: string | undefined } | undefined }
): Promise<AuthResult | AuthError> {
  const result = await getAuthenticatedUserFromCookies(cookies);

  if ('error' in result) {
    return result;
  }

  // Check admin role
  if (!result.user || !ADMIN_ROLES.includes(result.user.role as AdminRole)) {
    return { error: 'FORBIDDEN', requiredRole: 'admin' };
  }

  return result;
}

/**
 * Get admin user - returns null on any failure (backward compatible)
 */
export async function getAdminUser(cookies?: Record<string, string>): Promise<AuthUser | null> {
  if (!cookies) return null;

  const result = await requireAdmin(cookies);

  if ('error' in result || !result.user) {
    return null;
  }

  return {
    id: result.userId,
    email: result.user.email,
    name: result.user.name || null,
    role: result.user.role as AdminRole,
  };
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Admin access required' }
  }), { status: 401, headers: { 'Content-Type': 'application/json' } });
}