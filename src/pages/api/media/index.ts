// Media API - File uploads to Cloudflare R2
export const prerender = false;

import { getDb } from '@/lib/db';
import { media, businessPages, plans } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { env } from 'cloudflare:workers';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Get R2 bucket from Workers binding
function getR2Bucket(): R2Bucket | undefined {
  return env.MEDIA_BUCKET as R2Bucket | undefined;
}

// Get R2 public URL
function getR2PublicUrl(): string {
  return (env.R2_PUBLIC_URL as string) || `https://timorlist-media.r2.cloudflarestorage.com`;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const DEFAULT_LIMITS = { maxImages: 5, maxVideos: 1 };

async function getPlanLimits(planType: string | null): Promise<{ maxImages: number; maxVideos: number }> {
  if (!planType) return DEFAULT_LIMITS;

  const db = await getDb();
  const plan = await db.select({
    maxImages: plans.maxImages,
    maxVideos: plans.maxVideos,
  })
    .from(plans)
    .where(eq(plans.id, planType))
    .limit(1)
    .get();

  return plan ? { maxImages: plan.maxImages, maxVideos: plan.maxVideos } : DEFAULT_LIMITS;
}

async function getCurrentUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) return null;
  try {
    const authApi = (await initAuth()).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    return user;
  } catch { return null; }
}

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const user = await getCurrentUser(request);

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const businessId = url.searchParams.get('businessId');
    const userId = url.searchParams.get('userId');
    const entityType = url.searchParams.get('entityType');
    const entityId = url.searchParams.get('entityId');
    const category = url.searchParams.get('category');
    const id = url.pathname.split('/').pop();
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

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

    // Build query with filters
    const allMedia = await db.select().from(media);

    // Apply filters
    let filtered = allMedia;
    if (businessId) {
      filtered = filtered.filter(m => m.businessId === businessId);
    } else if (userId) {
      filtered = filtered.filter(m => m.createdById === userId);
    }
    if (entityType) {
      filtered = filtered.filter(m => m.entityType === entityType);
    }
    if (entityId) {
      filtered = filtered.filter(m => m.entityId === entityId);
    }
    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }

    // Sort by createdAt desc
    filtered.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });

    // Paginate
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return new Response(JSON.stringify({
      success: true,
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }), {
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
  try {
    const db = await getDb();
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
        const [business] = await db.select({ planType: businessPages.planType })
          .from(businessPages)
          .where(eq(businessPages.id, businessId))
          .limit(1);
        const limits = await getPlanLimits(business?.planType || null);

        const imageCount = await db.select({ count: sql<number>`count(*)` })
          .from(media)
          .where(and(eq(media.businessId, businessId), eq(media.type, 'image')));
        const videoCount = await db.select({ count: sql<number>`count(*)` })
          .from(media)
          .where(and(eq(media.businessId, businessId), eq(media.type, 'video')));

        if (isImage && (imageCount[0]?.count || 0) >= limits.maxImages) {
          return new Response(JSON.stringify({
            success: false,
            error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxImages} images allowed` }
          }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (isVideo && (videoCount[0]?.count || 0) >= limits.maxVideos) {
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
      const r2PublicUrl = getR2PublicUrl();
      let finalUrl: string;
      let storedPath: string;

      const bucket = getR2Bucket();
      if (bucket) {
        await bucket.put(key, arrayBuffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000, immutable',
          },
        });
        finalUrl = `${r2PublicUrl}/${key}`;
        storedPath = key;
      } else {
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        finalUrl = `data:${file.type};base64,${base64}`;
        storedPath = finalUrl;
      }

      const [created] = await db.insert(media).values({
        id,
        url: storedPath,
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
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const user = await getCurrentUser(request);

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

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
  try {
    const db = await getDb();
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

    // Delete from R2 if URL is R2 path (not data: URL)
    if (mediaItem.url && !mediaItem.url.startsWith('data:') && !mediaItem.url.startsWith('http')) {
      const bucket = getR2Bucket();
      if (bucket) {
        try {
          await bucket.delete(mediaItem.url);
        } catch (e) {
          console.error('Failed to delete from R2:', e);
        }
      }
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