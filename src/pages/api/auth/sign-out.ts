// Auth API - Sign Out
export const prerender = false;

import { getAuth } from '@/lib/auth';

export async function POST({ request }: { request: Request }) {
  try {
    const auth = await getAuth();

    // Use better-auth's signOut API
    const response = await auth.api.signOut({
      headers: request.headers,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'better-auth.session_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      }
    });
  } catch (error) {
    console.error('[SignOut] Error:', error);
    // Still clear the cookie even if better-auth fails
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'better-auth.session_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      }
    });
  }
}
