// Banners API - GET active banners
export const prerender = false;

import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
    const banners = await db.select({
      id: adBanners.id,
      title: adBanners.title,
      description: adBanners.description,
      imageId: adBanners.imageId,
      linkUrl: adBanners.linkUrl,
      linkType: adBanners.linkType,
    })
    .from(adBanners)
    .where(eq(adBanners.isActive, true))
    .limit(5)
    .all();

    const bannersWithImages = banners.map((banner) => {
      const imageId = banner.imageId;
      const lnkUrl = banner.linkUrl;
      const lnkType = banner.linkType;
      return {
        id: banner.id,
        title: banner.title || '',
        description: banner.description || '',
        imageUrl: imageId ? `/api/media/${imageId}` : '/images/default-banner.jpg',
        linkUrl: lnkUrl || null,
        linkType: lnkType || 'business',
      };
    });

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
