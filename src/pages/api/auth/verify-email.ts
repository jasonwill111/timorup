// Auth API - Verify Email
export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Token is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // In real app, verify token and mark email as verified
    // For demo, just return success
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email verified successfully'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Verify email error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to verify email' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
