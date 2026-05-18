// Admin API - Get Settings
export const prerender = false;

import { getDb } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");

    // Get all settings as key-value pairs
    const allSettings = await db.select().from(siteSettings).all() as unknown[];

    const settingsMap: Record<string, { value: string }> = {};
    for (const s of allSettings) {
      settingsMap[s.key] = { value: s.value };
    }

    return new Response(JSON.stringify({
      success: true,
      data: settingsMap,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Settings GET] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: String(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}