// Auth API - Session (Get current user)
export const prerender = false;

import { initAuth } from '@/lib/auth';

export async function GET({ request }: { request: Request }) {
  try {
    const authApi = (await initAuth()).api;
    const session = await authApi.getSession({
      headers: request.headers,
    });

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({
      error: errorMessage,
      user: null,
      session: null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
