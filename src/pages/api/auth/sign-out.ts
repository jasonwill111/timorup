// Auth API - Sign Out
export const prerender = false;

import { auth } from '@/lib/auth';

// Type helper for better-auth API access
const authApi = (auth as unknown as { api: typeof auth.api }).api;

export async function POST({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);

  if (tokenMatch) {
    try {
      await authApi.signOut({
        headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
      });
    } catch (error) {
      // Ignore sign out errors
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'better-auth.session_token=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/'
    }
  });
}
