// Admin API Auth Helper
import { initAuth } from '@/lib/auth';

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
    const authApi = (await initAuth()).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });

    if (!user) return null;

    // Check if user has admin role
    const role = (user as any).role as AuthUser['role'];
    if (!role || !['admin', 'super_admin', 'editor'].includes(role)) {
      return null;
    }

    return {
      id: user.id,
      email: user.email as string,
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