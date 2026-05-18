// Simple test route to check DB connectivity
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export async function GET() {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(users).where(eq(users.email, 'admin@timorlist.tl')).get() ?? undefined;

    return new Response(JSON.stringify({
      directQuery: result ? { found: true, id: result.id, email: result.email } : { found: false },
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}