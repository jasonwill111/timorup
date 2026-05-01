// Media API - Upload endpoint
export const prerender = false;

import { getDb } from '@/lib/db';
import { media, businessPages } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import sharp from 'sharp';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_VIDEO_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1200;
const IMAGE_QUALITY = 85;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const PLAN_LIMITS: Record<string, { maxImages: number; maxVideos: number }> = {
  basic: { maxImages: 10, maxVideos: 1 },
  pro: { maxImages: 10, maxVideos: 1 },
  max: { maxImages: 10, maxVideos: 1 },
};

// Folder structure: business/{id}/, gov/{id}/, ngo/{id}/, blog/{id}/, hero/, category/, page/{name}/, system/, files/
function getFolderPath(params: {
  entityType?: string;
  businessId?: string;
  category?: string;
  pageName?: string;
}): string {
  const { entityType, businessId, category, pageName } = params;

  if (category === 'hero') return 'hero';
  if (category === 'category') return 'category';
  if (category === 'system') return 'system';
  if (category === 'files') return 'files';
  if (pageName) return `page/${pageName}`;

  if (entityType && businessId) {
    return `${entityType}/${businessId}`;
  }

  return 'general';
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

async function getBusinessPlanLimits(businessId: string) {
  const db = await getDb();
  const [business] = await db.select({ planType: businessPages.planType })
    .from(businessPages)
    .where(eq(businessPages.id, businessId))
    .limit(1);
  const plan = business?.planType || 'basic';
  return PLAN_LIMITS[plan] || PLAN_LIMITS.basic;
}

async function countBusinessMedia(businessId: string) {
  const db = await getDb();
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

export async function POST({ request }: { request: Request }) {
  const db = await getDb();
  const url = new URL(request.url);
  const businessId = url.searchParams.get('businessId');
  const entityType = url.searchParams.get('entityType') || 'business';
  const category = url.searchParams.get('category'); // hero, category, system, files
  const pageName = url.searchParams.get('pageName');
  const skuId = url.searchParams.get('skuId');

  const user = await getCurrentUser(request);

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
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
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'bin';

    let finalUrl: string;
    let finalSize = file.size;
    let finalMimeType = file.type;
    let finalWidth: number | undefined;
    let finalHeight: number | undefined;
    const hasR2Credentials = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID;

    // Build folder path
    const folder = getFolderPath({ entityType, businessId, category, pageName });
    const subFolder = skuId ? `${skuId}/` : '';

    if (isImage && hasR2Credentials) {
      // Optimize image with sharp
      const inputBuffer = Buffer.from(await file.arrayBuffer());
      const processed = await sharp(inputBuffer)
        .resize(MAX_IMAGE_WIDTH, null, { withoutEnlargement: true })
        .webp({ quality: IMAGE_QUALITY })
        .toBuffer({ resolveWithObject: true });

      const key = `${folder}/${subFolder}${timestamp}-${id}.webp`;

      const { uploadToR2 } = await import('@/lib/media');
      const result = await uploadToR2(processed.data, key, 'image/webp', processed.data.length);
      finalUrl = result.url;
      finalSize = processed.data.length;
      finalMimeType = 'image/webp';
      finalWidth = processed.info.width;
      finalHeight = processed.info.height;
    } else if (hasR2Credentials) {
      // Video - store as-is
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `${folder}/${subFolder}${timestamp}-${id}.${ext}`;
      const { uploadToR2 } = await import('@/lib/media');
      const result = await uploadToR2(buffer, key, file.type, file.size);
      finalUrl = result.url;
    } else {
      // Local dev - base64
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      finalUrl = `data:${file.type};base64,${base64}`;
    }

    // Build stored path for DB
    const storedPath = hasR2Credentials
      ? `${folder}/${subFolder}${timestamp}-${id}.${isImage ? 'webp' : ext}`
      : finalUrl;

    const [created] = await db.insert(media).values({
      id,
      url: storedPath,
      filename: file.name,
      mimeType: finalMimeType,
      size: finalSize,
      width: finalWidth,
      height: finalHeight,
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
        mimeType: finalMimeType,
        size: finalSize,
        type: isImage ? 'image' : 'video',
        width: finalWidth,
        height: finalHeight,
      }
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
