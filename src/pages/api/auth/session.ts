// Auth API - Session (Get current user)
export const prerender = false;

import { auth } from '@/lib/auth';

export async function GET({ request }: { request: Request }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ user: null, session: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
