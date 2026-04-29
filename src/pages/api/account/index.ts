// Account API - Base endpoint requiring auth
export const prerender = false;

import { auth } from '@/lib/auth';

async function requireAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
  try {
    const authApi = (auth as unknown as { api: typeof auth.api }).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    if (!user) {
      return { authorized: false, error: new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
    }
    return { authorized: true, user };
  } catch {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
}

// GET - Account info
export async function GET({ request }: { request: Request }) {
  const authResult = await requireAuth(request);
  if (!authResult.authorized) return authResult.error;

  // Return basic account info
  return new Response(JSON.stringify({
    success: true,
    data: {
      id: authResult.user.id,
      name: authResult.user.name,
      email: authResult.user.email,
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
