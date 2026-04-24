// Banners API - GET all, POST create
export const prerender = false;

import { db } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const isActive = url.searchParams.get('active') === 'true';

  try {
    if (isActive) {
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

      const bannersWithImages = await Promise.all(
        banners.map(async (banner) => ({
          ...banner,
          imageUrl: banner.imageId ? `/api/media/${banner.imageId}` : '/images/default-banner.jpg',
          linkUrl: banner.externalUrl || (banner.linkedBusinessPageId ? `/business/${banner.linkedBusinessPageId}` : null),
        }))
      );

      return new Response(JSON.stringify({ success: true, data: bannersWithImages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const banners = await db.select().from(adBanners).orderBy(desc(adBanners.createdAt)).all();
    return new Response(JSON.stringify({ success: true, data: banners }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { title, description, imageId, linkedBusinessPageId, externalUrl, isActive, startDate, endDate } = body;

    const [newBanner] = await db.insert(adBanners).values({
      title,
      description: description || null,
      imageId: imageId || null,
      linkedBusinessPageId: linkedBusinessPageId || null,
      externalUrl: externalUrl || null,
      isActive: isActive ?? true,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    }).returning().get();

    return new Response(JSON.stringify({ success: true, data: newBanner }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'CREATE_ERROR', message: error.message }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
