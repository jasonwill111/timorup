// Media API Routes - File uploads to Cloudflare R2 with optimization
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie } from 'hono/cookie';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { media, users, businessPages } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Media configuration
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Plan limits
const PLAN_LIMITS: Record<string, { maxProducts: number; maxImages: number; maxVideos: number }> = {
  basic: { maxProducts: 10, maxImages: 10, maxVideos: 1 },
  pro: { maxProducts: 30, maxImages: 10, maxVideos: 1 },
  max: { maxProducts: 60, maxImages: 10, maxVideos: 1 },
};

const mediaApp = new Hono();

// Get allowed origins
const getAllowedOrigins = () => {
  const appUrl = process.env.APP_URL || 'http://localhost:4321';
  return process.env.ALLOWED_ORIGINS?.split(',').map((o: string) => o.trim()) || [appUrl];
};

mediaApp.use('/*', cors({
  origin: (origin) => {
    const allowed = getAllowedOrigins();
    if (!origin) return origin;
    if (allowed.includes(origin)) return origin;
    if (origin?.startsWith('http://localhost:')) return origin;
    return allowed[0] || 'http://localhost:4321';
  },
  credentials: true,
}));

// Helper: Get current user
async function getCurrentUser(c: any) {
  const token = getCookie(c, 'better-auth.session_token');
  if (!token) return null;
  try {
    const { user } = await auth.api.getSession({
      headers: { cookie: `better-auth.session_token=${token}` },
    });
    return user;
  } catch { return null; }
}

// Helper: Get plan limits for a business
async function getBusinessPlanLimits(businessId: string) {
  const [business] = await db.select({ planType: businessPages.planType })
    .from(businessPages)
    .where(eq(businessPages.id, businessId))
    .limit(1);
  
  const plan = business?.planType || 'basic';
  return PLAN_LIMITS[plan] || PLAN_LIMITS.basic;
}

// Helper: Count existing media for a business
async function countBusinessMedia(businessId: string) {
  const imageCount = await db.select({ count: sql<number>`count(*)` })
    .from(media)
    .where(and(
      eq(media.businessId, businessId),
      eq(media.type, 'image')
    ));
  
  const videoCount = await db.select({ count: sql<number>`count(*)` })
    .from(media)
    .where(and(
      eq(media.businessId, businessId),
      eq(media.type, 'video')
    ));
  
  return {
    images: imageCount[0]?.count || 0,
    videos: videoCount[0]?.count || 0,
  };
}

// Get all media (for user or business)
mediaApp.get('/', async (c) => {
  const user = await getCurrentUser(c);
  const { businessId, userId } = c.req.query();
  
  if (!user && !userId) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }
  
  try {
    let whereCondition;
    if (businessId) {
      whereCondition = eq(media.businessId, businessId);
    } else if (userId) {
      whereCondition = eq(media.createdById, userId);
    }
    
    const allMedia = await db.select()
      .from(media)
      .where(whereCondition)
      .orderBy(media.createdAt);
    
    return c.json({ success: true, data: allMedia });
  } catch (error: any) {
    console.error('Error fetching media:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get media count for a business (for UI display)
mediaApp.get('/count/:businessId', async (c) => {
  const businessId = c.req.param('businessId');
  const user = await getCurrentUser(c);
  
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }
  
  try {
    // Check ownership
    const [business] = await db.select({ ownerId: businessPages.ownerId })
      .from(businessPages)
      .where(eq(businessPages.id, businessId))
      .limit(1);
    
    if (!business || business.ownerId !== user.id) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, 403);
    }
    
    const counts = await countBusinessMedia(businessId);
    const limits = await getBusinessPlanLimits(businessId);
    
    return c.json({
      success: true,
      data: {
        images: counts.images,
        videos: counts.videos,
        limits: limits,
        canAddImage: counts.images < limits.maxImages,
        canAddVideo: counts.videos < limits.maxVideos,
      }
    });
  } catch (error: any) {
    console.error('Error counting media:', error);
    return c.json({ success: false, error: { code: 'COUNT_ERROR', message: error.message } }, 500);
  }
});

// Get single media
mediaApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const item = await db.select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);
    
    if (item.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } }, 404);
    }
    
    return c.json({ success: true, data: item[0] });
  } catch (error: any) {
    console.error('Error fetching media:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Delete media
mediaApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const user = await getCurrentUser(c);
  
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }
  
  try {
    const item = await db.select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);
    
    if (item.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } }, 404);
    }
    
    const mediaItem = item[0];
    
    // Check ownership
    if (mediaItem.createdById !== user.id) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, 403);
    }
    
    // Delete from R2 if it's not a data URL (base64)
    if (mediaItem.url && !mediaItem.url.startsWith('data:')) {
      const { deleteFromR2 } = await import('@/lib/media');
      await deleteFromR2(mediaItem.url);
    }
    
    await db.delete(media).where(eq(media.id, id));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting media:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

// Presign upload URL (for direct browser to R2 upload)
mediaApp.post('/presign', async (c) => {
  const body = await c.req.json();
  const { filename, mimeType, businessId } = body;
  const user = await getCurrentUser(c);
  
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }
  
  if (!filename || !mimeType || !businessId) {
    return c.json({ success: false, error: { code: 'MISSING_PARAMS', message: 'filename, mimeType, and businessId are required' } }, 400);
  }
  
  try {
    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);
    
    if (!isImage && !isVideo) {
      return c.json({ success: false, error: { code: 'INVALID_TYPE', message: 'File type not allowed' } }, 400);
    }
    
    // Validate plan limits
    const limits = await getBusinessPlanLimits(businessId);
    const counts = await countBusinessMedia(businessId);
    
    if (isImage && counts.images >= limits.maxImages) {
      return c.json({ success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxImages} images allowed` } }, 400);
    }
    
    if (isVideo && counts.videos >= limits.maxVideos) {
      return c.json({ success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxVideos} video allowed` } }, 400);
    }
    
    // Generate unique ID
    const id = crypto.randomUUID();
    const ext = filename.split('.').pop() || 'bin';
    const timestamp = Date.now();
    const key = `uploads/${user.id}/${businessId}/${timestamp}-${id}.${ext}`;
    
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    
    // Create DB record with pending status
    const [created] = await db.insert(media).values({
      id,
      url: key,
      filename,
      mimeType,
      size: 0,
      type: isImage ? 'image' : 'video',
      businessId,
      createdById: user.id,
    }).returning();
    
    const uploadEndpoint = '/api/media/upload';
    
    return c.json({
      success: true,
      data: {
        uploadUrl: uploadEndpoint,
        mediaId: id,
        key,
        maxSize,
        fields: {
          key,
          'Content-Type': mimeType,
        }
      }
    });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Direct upload handler (for development / production)
mediaApp.post('/upload', async (c) => {
  const user = await getCurrentUser(c);
  const { businessId } = c.req.query();
  
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }
  
  try {
    const body = await c.req.parseBody();
    const file = body.file as File;
    
    if (!file) {
      return c.json({ success: false, error: { code: 'NO_FILE', message: 'No file provided' } }, 400);
    }
    
    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    
    if (!isImage && !isVideo) {
      return c.json({ success: false, error: { code: 'INVALID_TYPE', message: 'File type not allowed' } }, 400);
    }
    
    // Validate file size
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return c.json({ 
        success: false, 
        error: { 
          code: 'FILE_TOO_LARGE', 
          message: `File must be less than ${maxSize / 1024 / 1024}MB` 
        } 
      }, 400);
    }
    
    // Validate plan limits if businessId provided
    if (businessId) {
      const limits = await getBusinessPlanLimits(businessId);
      const counts = await countBusinessMedia(businessId);
      
      if (isImage && counts.images >= limits.maxImages) {
        return c.json({ success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxImages} images allowed` } }, 400);
      }
      
      if (isVideo && counts.videos >= limits.maxVideos) {
        return c.json({ success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxVideos} video allowed` } }, 400);
      }
    }
    
    // Generate unique ID and key
    const id = crypto.randomUUID();
    const ext = file.name.split('.').pop() || 'bin';
    const timestamp = Date.now();
    const key = `uploads/${user.id}/${businessId || 'general'}/${timestamp}-${id}.${ext}`;
    
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to R2 (or use base64 for development without R2 credentials)
    let finalUrl: string;
    const hasR2Credentials = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID;
    
    if (hasR2Credentials) {
      // Production: Upload to Cloudflare R2
      const { uploadToR2 } = await import('@/lib/media');
      const result = await uploadToR2(buffer, key, file.type, file.size);
      finalUrl = result.url;
    } else {
      // Development: Store as base64 (fallback)
      const base64 = buffer.toString('base64');
      finalUrl = `data:${file.type};base64,${base64}`;
    }
    
    // Create DB record
    const [created] = await db.insert(media).values({
      id,
      url: hasR2Credentials ? key : finalUrl,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      type: isImage ? 'image' : 'video',
      businessId: businessId || null,
      createdById: user.id,
    }).returning();
    
    return c.json({
      success: true,
      data: {
        id: created.id,
        url: finalUrl,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        type: isImage ? 'image' : 'video',
      }
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return c.json({ success: false, error: { code: 'UPLOAD_ERROR', message: error.message } }, 500);
  }
});

// Update media metadata after upload
mediaApp.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { url, width, height, alt, businessId } = body;
  const user = await getCurrentUser(c);
  
  if (!user) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);
  }
  
  try {
    const [existing] = await db.select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);
    
    if (!existing || existing.createdById !== user.id) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, 403);
    }
    
    const [updated] = await db.update(media)
      .set({
        url: url || existing.url,
        width: width || existing.width,
        height: height || existing.height,
        alt: alt || existing.alt,
        businessId: businessId || existing.businessId,
      })
      .where(eq(media.id, id))
      .returning();
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating media:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

export default mediaApp;
