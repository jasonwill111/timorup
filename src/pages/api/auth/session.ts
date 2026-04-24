// Auth API - Session (Get current user)
export const prerender = false;

import { auth } from '@/lib/auth';

// Type helper for better-auth API access
const authApi = (auth as unknown as { api: typeof auth.api }).api;

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);

  if (!tokenMatch) {
    return new Response(JSON.stringify({
      success: true,
      user: null,
      session: null
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { user, session } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });

    return new Response(JSON.stringify({ success: true, user, session }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: true,
      user: null,
      session: null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'better-auth.session_token=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/'
      }
    });
  }
}
