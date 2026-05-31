// Media Upload Server Action - R2 upload with deduplication
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media, businesses } from '@/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { getPlanLimits } from '@/lib/subscription';
import { getMediaLimits } from '@/lib/media-limits';
import { getR2PublicUrl, isR2Available, getR2Bucket } from '@/lib/media';
import { validateMediaFile, buildR2Key } from '@/lib/media/validator';
import { getErrorMessage, createErrorResponse, ErrorCode } from '@/lib/errors';

const DEFAULT_LIMITS = { maxImages: 5, maxVideos: 1, maxBusinessImages: 16, maxBusinessVideos: 2 };

export const uploadMedia = defineAction({
  accept: 'form',
  input: z.object({
    file: z.instanceof(File, { error: 'Invalid file' }),
    type: z.string(),           // R2 path prefix (e.g., 'businesses/biz-123/profile')
    typeId: z.string(),        // entity ID
    hash: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  handler: async (input) => {
    const db = await getDb();
    if (!db) return createErrorResponse(ErrorCode.SERVER_DB_ERROR, "Database not available");
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => null);
    const user = session?.user ?? null;

    if (!user) {
      return createErrorResponse(ErrorCode.AUTH_REQUIRED, 'Authentication required');
    }

    try {
      const file = input.file as File;
      if (!file) {
        return createErrorResponse(ErrorCode.MEDIA_NO_FILE, 'No file provided');
      }

      // Use centralized validation
      const validation = validateMediaFile(file, entityType);
      if (!validation.valid) {
        return createErrorResponse(validation.error!.code, validation.error!.message);
      }

      const { isImage, isVideo } = validation;

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
          return createErrorResponse(ErrorCode.BUSINESS_NOT_FOUND, 'Business not found');
        }

        if (business.ownerId !== user.id && (user as { role?: string }).role !== 'admin' && (user as { role?: string }).role !== 'super_admin') {
          return createErrorResponse(ErrorCode.BUSINESS_FORBIDDEN, 'Access denied to this business');
        }

        const limits = await getPlanLimits(business?.planType || null) || DEFAULT_LIMITS;

        // Check image/video limits by entity
        const imageCountResult = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.entityType, entityType), eq(media.entityId, input.typeId)))
          .get() ?? undefined;

        if (isImage && limits.maxBusinessImages > 0 && (imageCountResult?.count || 0) >= limits.maxBusinessImages) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxBusinessImages} images allowed`);
        }

        if (isVideo && limits.maxBusinessVideos > 0 && (imageCountResult?.count || 0) >= limits.maxBusinessVideos) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxBusinessVideos} videos allowed`);
        }
      } else {
        // Non-business entities use default limits (0 = unlimited)
        const entityMediaCount = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.entityType, entityType), eq(media.entityId, input.typeId)))
          .get() ?? undefined;

        if (isImage && limits.maxImages > 0 && (entityMediaCount?.count || 0) >= limits.maxImages) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxImages} images allowed`);
        }

        if (isVideo && limits.maxVideos > 0 && (entityMediaCount?.count || 0) >= limits.maxVideos) {
          return createErrorResponse(ErrorCode.MEDIA_LIMIT_REACHED, `Maximum ${limits.maxVideos} videos allowed`);
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
        return createErrorResponse(ErrorCode.MEDIA_UPLOAD_ERROR, 'Failed to create media record');
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
      return createErrorResponse(ErrorCode.MEDIA_UPLOAD_ERROR, getErrorMessage(error));
    }
  },
});
