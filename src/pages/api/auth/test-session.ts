// Test session endpoint
export const prerender = false;

import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('cookie');
  const tokenMatch = cookieHeader?.match(/better-auth\.session_token=([^;]+)/);
  const token = tokenMatch?.[1];

  const db = await getDb();
  const now = new Date();

  // Test 1: Simple token match
  const r1 = await db.select().from(sessions).where(eq(sessions.token, token || '')).limit(1).get();
  
  // Test 2: Token + expires check with gt
  const r2 = await db.select().from(sessions)
    .where(and(eq(sessions.token, token || ''), eq(sessions.token, token || '')))
    .limit(1).get();
  
  // Test 3: Raw SQL
  const r3 = await db.select({ count: sql<number>`count(*)` })
    .from(sessions)
    .where(sql`token = ${token}`)
    .get();

  return Response.json({
    token: token?.substring(0, 20),
    r1_found: !!r1,
    r2_found: !!r2,
    r3_count: r3?.count,
    now_iso: now.toISOString(),
    now_ts: now.getTime(),
  });
}
