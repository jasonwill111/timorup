// Auth API - Sign In (REST endpoint for admin login form)
import type { APIRoute } from 'astro';
import { initAuthInstance } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Email and password required' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { env } = await import('cloudflare:workers');
    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Database not available' } }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create auth instance
    const auth = initAuthInstance(env as Record<string, unknown>);
    const authApi = auth.api;

    // Sign in via better-auth
    const result = await authApi.signInEmail({
      body: { email, password },
    }) as { user?: { id: string; name: string }; token: string };

    const user = result.user || { id: '', name: '' };
    const token = result.token || '';

    if (!user.id) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Invalid credentials' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: email,
        name: user.name || email.split('@')[0],
        role: 'admin',  // Will be verified by admin pages
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `better-auth.session_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid credentials';
    console.error('[sign-in] Error:', message);
    return new Response(JSON.stringify({ success: false, error: { message } }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
