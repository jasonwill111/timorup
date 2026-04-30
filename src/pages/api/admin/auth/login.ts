// Admin Auth API - Login
export const prerender = false;

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Email and password are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Find user by email
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .get();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid email or password' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Access denied. Admin role required.' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // In real app, verify hashed password!
    // For demo, accept any password
    
    // Create session
    const sessionId = `session-${Date.now()}-${user.id}`;
    const session = {
      id: sessionId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      session
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Admin sign in error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to sign in as admin' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
