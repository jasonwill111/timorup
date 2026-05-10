// Auth API - Reset Password
export const prerender = false;

import { resetPasswordSchema } from '@/lib/api-validation';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: result.error.issues[0]?.message || 'Invalid input' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { token, password } = result.data;

    // In real app, validate token and update password
    // For demo, just return success
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset successfully'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to reset password' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
