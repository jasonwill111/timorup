// Auth API - Sign Up (REST endpoint)
import type { APIRoute } from 'astro';
import { initAuth } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Email, password, and name are required' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Password must be at least 8 characters' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const auth = await initAuth();
    const authApi = auth.api;

    // Sign up via better-auth
    const result = await authApi.signUpEmail({
      body: { email, password, name },
    }) as { user: { id: string; email: string; name: string } };

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';

    if (message.includes('already exists') || message.includes('already registered')) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'An account with this email already exists' }
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: { message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};