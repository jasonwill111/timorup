// Banners API - PUT update, DELETE
export const prerender = false;

import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT({ request }: { request: Request }) {
  const db = await getDb();
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  try {
    const body = await request.json();
    const { title, description, imageId, linkedBusinessPageId, externalUrl, isActive, startDate, endDate } = body;

    const updated = await db.update(adBanners)
      .set({
        title,
        description,
        imageId,
        linkedBusinessPageId,
        externalUrl,
        isActive,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(adBanners.id, id))
      .returning()
      .get();

    if (!updated) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Banner not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UPDATE_ERROR', message: error.message }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE({ request }: { request: Request }) {
  const db = await getDb();
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  try {
    await db.delete(adBanners).where(eq(adBanners.id, id)).run();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'DELETE_ERROR', message: error.message }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
