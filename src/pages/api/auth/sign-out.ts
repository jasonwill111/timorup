// Auth API - Sign Out
export const prerender = false;

export async function POST() {
  // In real app, clear session/cookies
  return new Response(JSON.stringify({
    success: true,
    message: 'Signed out successfully'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
