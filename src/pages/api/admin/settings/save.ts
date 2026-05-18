// Admin API - Save Settings
export const prerender = false;

import { getDb } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { settings: settingsData } = body;

    if (!settingsData || typeof settingsData !== 'object') {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid settings data' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDb();
if (!db) throw new Error("Database not available");

    // Upsert each setting
    for (const [key, data] of Object.entries(settingsData)) {
      const value = typeof data === 'object' && data !== null && 'value' in data
        ? String(data.value)
        : String(data);

      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1).get() ?? undefined;

      if (existing) {
        await db.update(siteSettings)
          .set({ value, updatedAt: Math.floor(Date.now() / 1000) })
          .where(eq(siteSettings.key, key))
          .run();
      } else {
        await db.insert(siteSettings).values({
          key,
          value,
          createdAt: Math.floor(Date.now() / 1000) as any,
          updatedAt: Math.floor(Date.now() / 1000),
        }).run();
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Settings POST] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: String(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}