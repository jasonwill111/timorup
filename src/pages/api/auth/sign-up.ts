// Auth API - Sign Up
export const prerender = false;

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Email, password, and name are required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user already exists
    const existing = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'User already exists' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Create user (in real app, hash password!)
    const id = `user-${Date.now()}`;
    const newUser = await db.insert(users).values({
      id,
      email,
      name,
      phone: phone || null,
      role: 'user',
    }).returning();

    // Create session (simplified - in real app use proper session)
    const sessionId = `session-${Date.now()}`;
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        user: newUser[0],
        sessionId
      }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Sign up error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to sign up' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
