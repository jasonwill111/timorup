// Auth API - Sign In
export const prerender = false;

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
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
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid email or password' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const user = userResult[0];

    // In real app, verify hashed password!
    // For demo, accept any password
    
    // Create session
    const sessionId = `session-${Date.now()}-${user.id}`;
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        sessionId
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Sign in error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to sign in' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
