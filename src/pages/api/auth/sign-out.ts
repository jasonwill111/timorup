// Auth API - Sign Out
export const prerender = false;

import { getDb } from '@/lib/db';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie');

  try {
    const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);

    if (tokenMatch) {
      const token = tokenMatch[1];
      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

      // Delete session from database
      await db.delete(sessions).where(eq(sessions.token, token)).run();
    }

    // Clear session cookie
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'better-auth.session_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      }
    });
  } catch (error) {
    console.error('[SignOut] Error:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'better-auth.session_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      }
    });
  }
}