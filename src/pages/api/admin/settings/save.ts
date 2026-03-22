// Admin API - Save Settings
export const prerender = false;

import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
      // Handle both formats:
      // 1. { site_name: "value" } - simple string
      // 2. { site_name: { value: "value" } } - wrapper object
      let value: string;
      if (typeof valueObj === 'object' && valueObj !== null && 'value' in valueObj) {
        // Wrapper object format: { value: "..." }
        value = String(valueObj.value ?? '');
      } else if (typeof valueObj === 'object' && valueObj !== null && 'qrCode' in valueObj) {
        // Special case for payment_info: { qrCode: "..." }
        value = String((valueObj as any).qrCode ?? '');
      } else {
        value = String(valueObj ?? '');
      }
      
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
