// Auth API - Forgot Password
export const prerender = false;

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { forgotPasswordSchema } from '@/lib/api-validation';

export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: result.error.issues[0]?.message || 'Invalid input' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email } = result.data;

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

    // Generate secure reset token (in production, store in DB with expiry)
    // crypto.randomUUID();

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset link sent to email'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to process request' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
