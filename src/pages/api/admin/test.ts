// Test API - Simple health check
export const prerender = false;

export async function GET() {
  return new Response(JSON.stringify({
    success: true,
    message: 'Test endpoint works!'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
