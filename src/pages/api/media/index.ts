// Media API - File uploads to Cloudflare R2
export const prerender = false;

import { getDb } from '@/lib/db';
import { media, businessPages } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const PLAN_LIMITS: Record<string, { maxProducts: number; maxImages: number; maxVideos: number }> = {
  basic: { maxProducts: 10, maxImages: 10, maxVideos: 1 },
  pro: { maxProducts: 30, maxImages: 10, maxVideos: 1 },
  max: { maxProducts: 60, maxImages: 10, maxVideos: 1 },
};

async function getCurrentUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) return null;
  try {
    const authApi = (auth as unknown as { api: typeof auth.api }).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    return user;
  } catch { return null; }
}

async function getBusinessPlanLimits(businessId: string) {
  const [business] = await db.select({ planType: businessPages.planType })
    .from(businessPages)
    .where(eq(businessPages.id, businessId))
    .limit(1);
  const plan = business?.planType || 'basic';
  return PLAN_LIMITS[plan] || PLAN_LIMITS.basic;
}

async function countBusinessMedia(businessId: string) {
  const imageCount = await db.select({ count: sql<number>`count(*)` })
    .from(media)
    .where(and(eq(media.businessId, businessId), eq(media.type, 'image')));
  const videoCount = await db.select({ count: sql<number>`count(*)` })
    .from(media)
    .where(and(eq(media.businessId, businessId), eq(media.type, 'video')));
  return {
    images: imageCount[0]?.count || 0,
    videos: videoCount[0]?.count || 0,
  };
}

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const user = await getCurrentUser(request);

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const businessId = url.searchParams.get('businessId');
    const userId = url.searchParams.get('userId');
    const id = url.pathname.split('/').pop();

    if (id && id !== 'media') {
      const item = await db.select().from(media).where(eq(media.id, id)).limit(1);
      if (item.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Media not found' }
        }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ success: true, data: item[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let whereCondition;
    if (businessId) {
      whereCondition = eq(media.businessId, businessId);
    } else if (userId) {
      whereCondition = eq(media.createdById, userId);
    }

    const allMedia = await db.select().from(media).where(whereCondition).orderBy(media.createdAt);
    return new Response(JSON.stringify({ success: true, data: allMedia }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'FETCH_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST({ request }: { request: Request }) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const user = await getCurrentUser(request);

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    if (lastPart === 'upload') {
      const businessId = url.searchParams.get('businessId');
      const body = await request.parseBody();
      const file = (body as Record<string, unknown>).file as File;

      if (!file) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'NO_FILE', message: 'No file provided' }
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'INVALID_TYPE', message: 'File type not allowed' }
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: 'FILE_TOO_LARGE', message: `File must be less than ${maxSize / 1024 / 1024}MB` }
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      if (businessId) {
        const limits = await getBusinessPlanLimits(businessId);
        const counts = await countBusinessMedia(businessId);
        if (isImage && counts.images >= limits.maxImages) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxImages} images allowed` }
          }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (isVideo && counts.videos >= limits.maxVideos) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxVideos} video allowed` }
          }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
      }

      const id = crypto.randomUUID();
      const ext = file.name.split('.').pop() || 'bin';
      const timestamp = Date.now();
      const key = `uploads/${user.id}/${businessId || 'general'}/${timestamp}-${id}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let finalUrl: string;
      const hasR2Credentials = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID;

      if (hasR2Credentials) {
        const { uploadToR2 } = await import('@/lib/media');
        const result = await uploadToR2(buffer, key, file.type, file.size);
        finalUrl = result.url;
      } else {
        const base64 = buffer.toString('base64');
        finalUrl = `data:${file.type};base64,${base64}`;
      }

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

      return new Response(JSON.stringify({
        success: true,
        data: {
          id: created.id,
          url: finalUrl,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          type: isImage ? 'image' : 'video',
        }
      }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
    }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT({ request }: { request: Request }) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const user = await getCurrentUser(request);

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const { url: newUrl, width, height, alt, businessId } = body;

    const [existing] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!existing || existing.createdById !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const [updated] = await db.update(media)
      .set({
        url: newUrl || existing.url,
        width: width || existing.width,
        height: height || existing.height,
        alt: alt || existing.alt,
        businessId: businessId || existing.businessId,
      })
      .where(eq(media.id, id))
      .returning();

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UPDATE_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE({ request }: { request: Request }) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  const user = await getCurrentUser(request);

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const item = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (item.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Media not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const mediaItem = item[0];
    if (mediaItem.createdById !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    if (mediaItem.url && !mediaItem.url.startsWith('data:')) {
      const { deleteFromR2 } = await import('@/lib/media');
      await deleteFromR2(mediaItem.url);
    }

    await db.delete(media).where(eq(media.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'DELETE_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
