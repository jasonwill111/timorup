/**
 * Public Settings API — GET /api/settings/public
 *
 * Returns public site settings (e.g., payment QR code) without authentication.
 * AC-US1-03: Returns { payment_qr: string | null }
 */

export const prerender = false;

import { getDb } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const [result] = await db
      .select({ value: siteSettings.value })
      .from(siteSettings)
      .where(eq(siteSettings.key, 'payment_qr'))
      .limit(1);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payment_qr: result?.value ?? null,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Public settings error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: 'Failed to fetch settings' },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
