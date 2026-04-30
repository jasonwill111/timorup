// Auth API - Forgot Password
export const prerender = false;

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Email is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if user exists
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .get();

    if (!user) {
      // Don't reveal if email exists
      return new Response(JSON.stringify({
        success: true,
        message: 'If email exists, reset link will be sent'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // In real app, generate reset token and send email
    const resetToken = `reset-${Date.now()}`;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset link sent to email',
      // DEBUG ONLY - remove in production
      debugToken: resetToken
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to process request' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
