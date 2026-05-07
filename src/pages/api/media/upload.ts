// Media API - Upload endpoint
// Supports: client-side compression, SHA256 deduplication, structured R2 paths
export const prerender = false;

import { getDb } from '@/lib/db';
import { media, businessPages } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { env } from 'cloudflare:workers';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Get R2 bucket from Workers binding
function getR2Bucket(): R2Bucket {
  const bucket = env.MEDIA_BUCKET as R2Bucket | undefined;
  if (!bucket) {
    throw new Error('R2 bucket not configured (MEDIA_BUCKET binding missing)');
  }
  return bucket;
}

// Get R2 public URL
function getR2PublicUrl(): string {
  return (env.R2_PUBLIC_URL as string) || `https://timorlist-media.r2.cloudflarestorage.com`;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const PLAN_LIMITS: Record<string, { maxImages: number; maxVideos: number }> = {
  basic: { maxImages: 10, maxVideos: 1 },
  pro: { maxImages: 10, maxVideos: 1 },
  max: { maxImages: 10, maxVideos: 1 },
};

// Build R2 key from upload parameters
function buildR2Key(params: {
  entityType: string;
  entityId: string;
  category: string;
  filename: string;
  timestamp: number;
  id: string;
}): string {
  const { entityType, entityId, category, filename, timestamp, id } = params;

  // Sanitize filename - keep extension only
  const ext = filename.split('.').pop() || 'webp';
  const safeFilename = `${timestamp}-${id}.${ext}`;

  if (entityType === 'general') {
    return `general/${category}/${safeFilename}`;
  }

  if (entityType === 'business' || entityType === 'nonprofit') {
    const folder = `listings/${entityType}/${entityId}`;

    // SKU images get their own subfolder
    if (category === 'sku') {
      return `${folder}/sku-${entityId}/${safeFilename}`;
    }

    return `${folder}/${category}/${safeFilename}`;
  }

  if (entityType === 'blog') {
    return `blogs/${entityId}/${safeFilename}`;
  }

  // pages
  return `pages/${entityId}/${safeFilename}`;
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

    // Get entity params from formData
    const entityType = (body as Record<string, unknown>).entityType as string || 'general';
    const entityId = (body as Record<string, unknown>).entityId as string || '';
    const category = (body as Record<string, unknown>).category as string || 'gallery';
    const hash = (body as Record<string, unknown>).hash as string | undefined;
    const width = (body as Record<string, unknown>).width as number | undefined;
    const height = (body as Record<string, unknown>).height as number | undefined;

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

    const id = crypto.randomUUID();
    const timestamp = Date.now();

    // Check deduplication by hash
    if (hash) {
      const existing = await db.select()
        .from(media)
        .where(eq(media.hash, hash))
        .limit(1);

      if (existing.length > 0) {
        return new Response(JSON.stringify({
          success: true,
          data: {
            id: existing[0].id,
            url: existing[0].url,
            filename: existing[0].filename,
            mimeType: existing[0].mimeType,
            size: existing[0].size,
            type: existing[0].type,
          },
          isDuplicate: true,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Build R2 key
    const r2Key = buildR2Key({
      entityType,
      entityId,
      category,
      filename: file.name,
      timestamp,
      id,
    });

    let finalUrl: string;
    let finalSize = file.size;
    let finalMimeType = file.type;
    let storedPath: string;

    // Check if R2 bucket is available
    let bucket: R2Bucket | undefined;
    try {
      bucket = getR2Bucket();
    } catch {
      bucket = undefined;
    }

    if (bucket) {
      if (isImage) {
        // Client should have already compressed to WebP
        // Just upload the provided file
        const buffer = Buffer.from(await file.arrayBuffer());

        await bucket.put(r2Key, buffer, {
          httpMetadata: {
            contentType: 'image/webp',
            cacheControl: 'public, max-age=31536000, immutable',
          },
        });

        finalUrl = `${getR2PublicUrl()}/${r2Key}`;
        storedPath = r2Key;
        finalMimeType = 'image/webp';
        finalSize = buffer.length;
      } else {
        // Video - store as-is
        const buffer = Buffer.from(await file.arrayBuffer());

        await bucket.put(r2Key, buffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000, immutable',
          },
        });

        finalUrl = `${getR2PublicUrl()}/${r2Key}`;
        storedPath = r2Key;
      }
    } else {
      // Local dev without R2 - base64 inline
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      finalUrl = `data:${file.type};base64,${base64}`;
      storedPath = finalUrl;
    }

    const [created] = await db.insert(media).values({
      id,
      url: storedPath,
      filename: file.name,
      mimeType: finalMimeType,
      size: finalSize,
      width: width || null,
      height: height || null,
      type: isImage ? 'image' : 'video',
      businessId: entityId || null,
      createdById: user.id,
      // New fields
      hash: hash || null,
      entityType: entityType,
      entityId: entityId || null,
      category: category,
      r2Key: storedPath,
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
        width: width || null,
        height: height || null,
      },
      isDuplicate: false,
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
