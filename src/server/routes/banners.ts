// Banners API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { adBanners } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const bannersApp = new Hono();

bannersApp.use('/*', cors());

// Get active banners (for homepage carousel)
bannersApp.get('/active', async (c) => {
  try {
    const now = new Date();
    
    const banners = await db.select({
      id: adBanners.id,
      title: adBanners.title,
      description: adBanners.description,
      imageId: adBanners.imageId,
      linkedBusinessPageId: adBanners.linkedBusinessPageId,
      externalUrl: adBanners.externalUrl,
    })
    .from(adBanners)
    .where(
      and(
        eq(adBanners.isActive, true),
        // Start date check (null means always active from start)
        eq(adBanners.startDate, null)
      )
    )
    .limit(5);
    
    // Fetch images for each banner
    const bannersWithImages = await Promise.all(
      banners.map(async (banner) => {
        let imageUrl = '/images/default-banner.jpg';
        
        if (banner.imageId) {
          // Fetch media URL
          const media = await db.select({ url: adBanners.imageId })
            .from(adBanners)
            .where(eq(adBanners.id, banner.id))
            .limit(1);
          
          if (media.length > 0) {
            imageUrl = `/api/media/${banner.imageId}`;
          }
        }
        
        return {
          ...banner,
          imageUrl,
          linkUrl: banner.externalUrl || (banner.linkedBusinessPageId ? `/business/${banner.linkedBusinessPageId}` : null),
        };
      })
    );
    
    return c.json({ success: true, data: bannersWithImages });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get all banners (admin)
bannersApp.get('/', async (c) => {
  try {
    const banners = await db.select()
      .from(adBanners)
      .orderBy(adBanners.createdAt);
    
    return c.json({ success: true, data: banners });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Create banner
bannersApp.post('/', async (c) => {
  const body = await c.req.json();
  
  try {
    const [newBanner] = await db.insert(adBanners).values({
      title: body.title,
      description: body.description || null,
      imageId: body.imageId || null,
      linkedBusinessPageId: body.linkedBusinessPageId || null,
      externalUrl: body.externalUrl || null,
      isActive: body.isActive ?? true,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    }).returning();
    
    return c.json({ success: true, data: newBanner }, 201);
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Update banner
bannersApp.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  try {
    const [updated] = await db.update(adBanners)
      .set({
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(adBanners.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Banner not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete banner
bannersApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await db.delete(adBanners).where(eq(adBanners.id, id));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

export default bannersApp;
