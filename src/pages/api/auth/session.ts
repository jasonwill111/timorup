// Auth API - Session (Get current user)
export const prerender = false;

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  try {
    // Check for user ID in header or cookie
    let userId = request.headers.get('x-user-id');
    
    // If no header, check cookie
    if (!userId) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => c.split('='))
        );
        userId = cookies['user_id'];
      }
    }
    
    if (!userId) {
      return new Response(JSON.stringify({
        success: true,
        data: { user: null }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const userResult = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        data: { user: null }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const user = userResult[0];
    return new Response(JSON.stringify({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Session error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to get session' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
