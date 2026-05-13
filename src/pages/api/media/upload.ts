// Media API - Upload endpoint
// Supports: client-side compression, SHA256 deduplication, structured R2 paths
export const prerender = false;

import { getDb } from '@/lib/db';
import { media, businesses } from '@/db/schema';
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

const DEFAULT_LIMITS = { maxImages: 5, maxVideos: 1 };

// Build R2 key from type and typeId
// type = R2 path prefix (e.g., 'businesses/biz-123/profile')
function buildR2Key(params: {
  type: string;
  typeId: string;
  filename: string;
  timestamp: number;
  id: string;
}): string {
  const { type, typeId, filename, timestamp, id } = params;

  const ext = filename.split('.').pop() || 'webp';
  const safeFilename = `${timestamp}-${id}.${ext}`;

  return `${type}/${safeFilename}`;
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
    const type = (body as Record<string, unknown>).type as string;
    const typeId = (body as Record<string, unknown>).typeId as string;
    const hash = (body as Record<string, unknown>).hash as string | undefined;
    const width = (body as Record<string, unknown>).width as number | undefined;
    const height = (body as Record<string, unknown>).height as number | undefined;

    if (!type || !typeId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'type and typeId are required' }
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
            typeId: existing[0].typeId,
          },
          isDuplicate: true,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Build R2 key
    const r2Key = buildR2Key({
      type,
      typeId,
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
      const buffer = Buffer.from(await file.arrayBuffer());

      await bucket.put(r2Key, buffer, {
        httpMetadata: {
          contentType: file.type,
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });

      finalUrl = `${getR2PublicUrl()}/${r2Key}`;
      storedPath = r2Key;
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
      type: type,
      typeId: typeId,
      createdById: user.id,
      hash: hash || null,
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
        type: created.type,
        typeId: created.typeId,
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
