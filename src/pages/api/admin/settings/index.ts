// Admin API - Settings Management
export const prerender = false;

import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Get all settings
export async function GET() {
  try {
    const settingsResult = await db.select().from(siteSettings);

    // Convert to key-value object with wrapper format for frontend
    const settings: Record<string, any> = {};
    settingsResult.forEach((s: any) => {
      const key = s.key;
      const value = s.value;
      
      // Special case for payment_info - use qrCode wrapper
      if (key === 'payment_info') {
        settings[key] = { qrCode: value };
      } else {
        // Most settings use value wrapper
        settings[key] = { value: value };
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
  try {
    const body = await request.json();
    const { key, value } = body;

    // Check if setting exists
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      // Update
      await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key));
    } else {
      // Insert
      await db.insert(siteSettings).values({
        id: `setting-${Date.now()}`,
        key,
        value,
      });
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
      
      // Check if exists
      const existing = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(siteSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings)
          .values({ id: key, key, value });
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Settings saved successfully' 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
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
