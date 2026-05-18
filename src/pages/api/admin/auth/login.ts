// Admin Auth API - Login
export const prerender = false;

import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Email and password are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const auth = await initAuth();
    const result = await auth.api.signInEmail({
      body: { email, password }
    });

    if (!result.user) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid email or password' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Query DB for role (better-auth doesn't return custom fields)
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    const dbUser = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, result.user.id))
      .limit(1)
      .get() ?? undefined;

    const userRole = dbUser?.role || 'user';

    if (!['admin', 'super_admin', 'editor'].includes(userRole)) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Access denied. Admin role required.' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: userRole
      },
      session: result.session ? {
        id: result.session.id,
        userId: result.session.userId,
        expiresAt: result.session.expiresAt
      } : null
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Admin sign in error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to sign in as admin' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
