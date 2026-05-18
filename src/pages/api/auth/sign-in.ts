// Auth API - Sign In (REST endpoint for admin login form)
import type { APIRoute } from 'astro';
import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    const db = await getDb();
if (!db) throw new Error("Database not available");
    const auth = await initAuth();
    const authApi = auth.api;

    // Sign in via better-auth (this sets the session cookie)
    const result = await authApi.signInEmail({
      body: { email, password },
    }) as { user?: { id: string; name: string }; token: string };

    const user = result.user || { id: '', name: '' };
    const token = result.token || '';

    // Fetch user role from database
    const dbUser = await db
      .select({ id: users.id, name: users.name, role: users.role, email: users.email })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .get() ?? undefined;

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: dbUser?.id || user.id,
        email: dbUser?.email || email,
        name: dbUser?.name || user.name,
        role: dbUser?.role || 'user',
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Set cookie explicitly for cross-origin compatibility
        'Set-Cookie': `better-auth.session_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid credentials';
    return new Response(JSON.stringify({ success: false, error: { message } }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};