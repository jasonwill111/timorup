// Media Upload Server Action - R2 upload with deduplication
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media, businesses } from '@/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { env } from 'cloudflare:workers';
import { getPlanLimits } from '@/lib/subscription';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const DEFAULT_LIMITS = { maxImages: 5, maxVideos: 1, maxBusinessImages: 16, maxBusinessVideos: 2 };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getR2Bucket(): R2Bucket | undefined {
  return env.MEDIA_BUCKET as R2Bucket | undefined;
}

function getR2PublicUrl(): string {
  return (env.R2_PUBLIC_URL as string) || `https://timorlist-media.r2.cloudflarestorage.com`;
}

// Build R2 key from type and typeId
// type = R2 path prefix (e.g., 'businesses/biz-123/profile')
// typeId = entity ID
function buildR2Key(params: {
  type: string;      // R2 path prefix
  typeId: string;    // entity ID
  filename: string;
  timestamp: number;
  id: string;
}): string {
  const { type, typeId, filename, timestamp, id } = params;
  const ext = filename.split('.').pop() || 'webp';
  const safeFilename = `${timestamp}-${id}.${ext}`;

  // type already contains the full path prefix
  return `${type}/${safeFilename}`;
}

// Parse type prefix to extract media category (profile, banner, gallery, etc.)
function getMediaTypeFromPrefix(prefix: string): string {
  // prefix format: 'businesses/{id}/profile' -> 'image' or 'video'
  // Actually, we store the full prefix as 'type' and use it directly
  return prefix;
}

export const uploadMedia = defineAction({
  accept: 'form',
  input: z.object({
    file: z.any(),
    type: z.string(),           // R2 path prefix (e.g., 'businesses/biz-123/profile')
    typeId: z.string(),        // entity ID
    hash: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  handler: async (input) => {
    const db = await getDb();
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => null);
    const user = session?.user ?? null;

    if (!user) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
    }

    try {
      const file = input.file as File;
      if (!file) {
        return { success: false, error: { code: 'NO_FILE', message: 'No file provided' } };
      }

      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        return { success: false, error: { code: 'INVALID_TYPE', message: 'File type not allowed' } };
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        return { success: false, error: { code: 'FILE_TOO_LARGE', message: `File must be less than ${maxSize / 1024 / 1024}MB` } };
      }

      const id = crypto.randomUUID();
      const timestamp = Date.now();

      // Check deduplication by hash
      if (input.hash) {
        const existing = await db.select().from(media).where(eq(media.hash, input.hash)).limit(1);
        if (existing.length > 0) {
          return {
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
          };
        }
      }

      // Parse type to check business limits
      // type format: 'businesses/{id}/profile'
      const typeParts = input.type.split('/');
      const entityType = typeParts[0];

      if (entityType === 'businesses') {
        // Check ownership
        const [business] = await db.select({ planType: businesses.planType, ownerId: businesses.ownerId })
          .from(businesses)
          .where(eq(businesses.id, input.typeId))
          .limit(1);

        if (!business) {
          return { success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } };
        }

        if (business.ownerId !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
          return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied to this business' } };
        }

        const limits = await getPlanLimits(business?.planType || null) || DEFAULT_LIMITS;

        // Check image/video limits by type prefix
        const imagePrefix = `${input.type.split('/').slice(0, -1).join('/')}`;
        const imageCountResult = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.type, imagePrefix), eq(media.typeId, input.typeId)))
          .get();

        if (isImage && (imageCountResult?.count || 0) >= limits.maxBusinessImages) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxBusinessImages} images allowed` } };
        }
      }

      // Build R2 key
      const r2Key = buildR2Key({
        type: input.type,
        typeId: input.typeId,
        filename: file.name,
        timestamp,
        id,
      });

      let finalUrl: string;
      let finalSize = file.size;
      let finalMimeType = file.type;
      let storedPath: string;

      const bucket = getR2Bucket();
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
        width: input.width || null,
        height: input.height || null,
        type: input.type,
        typeId: input.typeId,
        createdById: user.id,
        hash: input.hash || null,
        r2Key: storedPath,
      }).returning();

      return {
        success: true,
        data: {
          id: created.id,
          url: finalUrl,
          filename: file.name,
          mimeType: finalMimeType,
          size: finalSize,
          type: created.type,
          typeId: created.typeId,
          width: input.width || null,
          height: input.height || null,
        },
        isDuplicate: false,
      };
    } catch (error) {
      return { success: false, error: { code: 'UPLOAD_ERROR', message: getErrorMessage(error) } };
    }
  },
});
