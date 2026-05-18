// Media Upload Server Action - R2 upload with deduplication
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media, businesses } from '@/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { getPlanLimits } from '@/lib/subscription';
import { getMediaLimits, isAllowedImageType, isAllowedVideoType } from '@/lib/media-limits';
import { getR2PublicUrl, isR2Available, getR2Bucket } from '@/lib/media';

const DEFAULT_LIMITS = { maxImages: 5, maxVideos: 1, maxBusinessImages: 16, maxBusinessVideos: 2 };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
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
  const { type, filename, timestamp, id } = params;
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
if (!db) throw new Error("Database not available");
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

      // Use centralized limits based on entity type
      const entityType = input.type.split('/')[0] || 'default';
      const limits = getMediaLimits(entityType);

      const isImage = isAllowedImageType(file.type);
      const isVideo = isAllowedVideoType(file.type);

      if (!isImage && !isVideo) {
        const allowedTypes = [...limits.allowedImageTypes, ...limits.allowedVideoTypes].join(', ');
        return { success: false, error: { code: 'INVALID_TYPE', message: `File type not allowed. Allowed: ${allowedTypes}` } };
      }

      const maxSize = isImage ? limits.maxImageSize : limits.maxVideoSize;
      if (file.size > maxSize) {
        const maxMB = (maxSize / 1024 / 1024).toFixed(1);
        return { success: false, error: { code: 'FILE_TOO_LARGE', message: `File must be less than ${maxMB}MB` } };
      }

      const id = crypto.randomUUID();
      const timestamp = Date.now();

      // Check deduplication by hash
      if (input.hash) {
        const existing = await db.select().from(media).where(eq(media.hash, input.hash)).limit(1);
        if (existing.length > 0 && existing[0]) {
          const rec = existing[0];
          return {
            success: true,
            data: {
              id: rec.id,
              r2Key: rec.r2Key,
              filename: rec.filename,
              mimeType: rec.mimeType,
              size: rec.size,
              entityType: rec.entityType,
              entityId: rec.entityId,
            },
            isDuplicate: true,
          };
        }
      }

      // Parse type to check business limits
      // type format: 'businesses/{id}/profile'
      const typeParts = input.type.split('/');

      if (entityType === 'businesses') {
        // Check ownership
        const [business] = await db.select({ planType: businesses.planType, ownerId: businesses.ownerId })
          .from(businesses)
          .where(eq(businesses.id, input.typeId))
          .limit(1);

        if (!business) {
          return { success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } };
        }

        if (business.ownerId !== user.id && (user as { role?: string }).role !== 'admin' && (user as { role?: string }).role !== 'super_admin') {
          return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied to this business' } };
        }

        const limits = await getPlanLimits(business?.planType || null) || DEFAULT_LIMITS;

        // Check image/video limits by entity
        const imageCountResult = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.entityType, entityType), eq(media.entityId, input.typeId)))
          .get() ?? undefined;

        if (isImage && limits.maxBusinessImages > 0 && (imageCountResult?.count || 0) >= limits.maxBusinessImages) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxBusinessImages} images allowed` } };
        }

        if (isVideo && limits.maxBusinessVideos > 0 && (imageCountResult?.count || 0) >= limits.maxBusinessVideos) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxBusinessVideos} videos allowed` } };
        }
      } else {
        // Non-business entities use default limits (0 = unlimited)
        const entityMediaCount = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.entityType, entityType), eq(media.entityId, input.typeId)))
          .get() ?? undefined;

        if (isImage && limits.maxImages > 0 && (entityMediaCount?.count || 0) >= limits.maxImages) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxImages} images allowed` } };
        }

        if (isVideo && limits.maxVideos > 0 && (entityMediaCount?.count || 0) >= limits.maxVideos) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxVideos} videos allowed` } };
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
        r2Key: storedPath,
        filename: file.name,
        mimeType: finalMimeType,
        size: finalSize,
        width: input.width || null,
        height: input.height || null,
        entityType: input.type,
        entityId: input.typeId,
        purpose: 'content',
        createdById: user.id,
        hash: input.hash || null,
      }).returning();

      if (!created) {
        return { success: false, error: { code: 'INSERT_ERROR', message: 'Failed to create media record' } };
      }

      return {
        success: true,
        data: {
          id: created.id,
          r2Key: created.r2Key,
          filename: file.name,
          mimeType: finalMimeType,
          size: finalSize,
          entityType: created.entityType,
          entityId: created.entityId,
          width: input.width ?? null,
          height: input.height ?? null,
        },
        isDuplicate: false,
      };
    } catch (error) {
      return { success: false, error: { code: 'UPLOAD_ERROR', message: getErrorMessage(error) } };
    }
  },
});
