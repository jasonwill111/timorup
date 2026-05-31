// Auth API - Session (Get current user)
// Reads session from database (compatible with light-auth)
export const prerender = false;

import { drizzle } from 'drizzle-orm/d1';
import { users, sessions } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  try {
    const { env } = await import('cloudflare:workers');

    if (!env.DB) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    const match = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = match[1];
    const now = Math.floor(Date.now() / 1000);

    // Query session from database
    const db = drizzle(env.DB as D1Database);

    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1)
      .get();

    if (!session) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if session is expired
    if (session.expiresAt < now) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user info
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)
      .get();

    if (!user) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role || 'user',
      },
      session: {
        id: session.id,
        expiresAt: new Date(session.expiresAt * 1000).toISOString(),
        token: session.token,
        userId: session.userId,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Session] Error:', errorMessage);
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