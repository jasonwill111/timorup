// Banners API - GET active banners
export const prerender = false;

import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = await getDb();
    const banners = await db.select({
      id: adBanners.id,
      title: adBanners.title,
      description: adBanners.description,
      imageId: adBanners.imageId,
      linkedBusinessPageId: adBanners.linkedBusinessPageId,
      externalUrl: adBanners.externalUrl,
    })
    .from(adBanners)
    .where(eq(adBanners.isActive, true))
    .limit(5)
    .all();

    const bannersWithImages = banners.map((banner) => ({
      ...banner,
      imageUrl: banner.imageId ? `/api/media/${banner.imageId}` : '/images/default-banner.jpg',
      linkUrl: banner.externalUrl || (banner.linkedBusinessPageId ? `/business/${banner.linkedBusinessPageId}` : null),
    }));

    return new Response(JSON.stringify({ success: true, data: bannersWithImages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'FETCH_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
