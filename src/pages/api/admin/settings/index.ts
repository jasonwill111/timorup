// Admin API - Settings Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

// GET - Get all settings
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const settingsResult = await db.select().from(siteSettings).all();

    const settings: Record<string, unknown> = {};
    settingsResult.forEach((s) => {
      if (s.key === 'payment_info') {
        settings[s.key] = { qrCode: s.value };
      } else {
        settings[s.key] = { value: s.value };
      }
    });

    return new Response(JSON.stringify({
      success: true,
      data: settings
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin settings error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch settings' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// PUT - Update a setting
export async function PUT({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { key, value } = body;

    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1)
      .get();

    if (existing) {
      await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .run();
    } else {
      await db.insert(siteSettings).values({
        id: `setting-${Date.now()}`,
        key,
        value,
      }).run();
    }

    return new Response(JSON.stringify({
      success: true,
      data: { key, value }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Update setting error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to update setting' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// POST - Save all settings at once
export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'INVALID_BODY', message: 'Settings object is required' }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    for (const [key, valueObj] of Object.entries(settings)) {
      const value = typeof valueObj === 'object' && valueObj !== null
        ? JSON.stringify(valueObj)
        : String(valueObj);

      const existing = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1)
        .get();

      if (existing) {
        await db.update(siteSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettings.key, key))
          .run();
      } else {
        await db.insert(siteSettings)
          .values({ id: key, key, value })
          .run();
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Settings saved successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'SAVE_ERROR', message: error.message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
