// Banners API - GET all, POST create
export const prerender = false;

import { getDb } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const isActive = url.searchParams.get('active') === 'true';

  try {
    const db = await getDb();

    if (isActive) {
      // Get active banners by position, sorted by sortOrder, max 4 per position
      const banners = await db.select({
        id: adBanners.id,
        title: adBanners.title,
        description: adBanners.description,
        imageId: adBanners.imageId,
        linkUrl: adBanners.linkUrl,
        linkType: adBanners.linkType,
        position: adBanners.position,
        sortOrder: adBanners.sortOrder,
      })
      .from(adBanners)
      .where(eq(adBanners.isActive, true))
      .orderBy(desc(adBanners.sortOrder))
      .limit(16) // 4 positions * 4 max per position
      .all();

      const bannersWithImages = await Promise.all(
        banners.map(async (banner) => ({
          ...banner,
          imageUrl: banner.imageId ? `/api/media/${banner.imageId}` : '/images/default-banner.jpg',
          // Build link based on linkType
          link: banner.linkType === 'listing'
            ? `/listing/${banner.linkUrl}`
            : banner.linkType === 'product'
            ? `/products-services/${banner.linkUrl}`
            : `/business/${banner.linkUrl}`,
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
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'FETCH_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const db = await getDb();
    const body = await request.json();
    const { title, description, imageId, linkUrl, linkType, position, sortOrder, orderId, isActive, startDate, endDate } = body;

    const [newBanner] = await db.insert(adBanners).values({
      title,
      description: description || null,
      imageId: imageId || null,
      linkUrl: linkUrl || null,
      linkType: linkType || 'business',
      position: position || 'homepage',
      sortOrder: sortOrder || 0,
      orderId: orderId || null,
      isActive: isActive ?? true,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    }).returning().get();

    return new Response(JSON.stringify({ success: true, data: newBanner }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'CREATE_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
