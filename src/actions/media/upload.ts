// Media Upload Server Action - R2 upload with deduplication
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { media, businessPages, plans } from '@/db/schema';
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

function buildR2Key(params: {
  entityType: string;
  entityId: string;
  category: string;
  filename: string;
  timestamp: number;
  id: string;
}): string {
  const { entityType, entityId, category, filename, timestamp, id } = params;
  const ext = filename.split('.').pop() || 'webp';
  const safeFilename = `${timestamp}-${id}.${ext}`;

  if (entityType === 'general') {
    return `general/${category}/${safeFilename}`;
  }

  if (entityType === 'business' || entityType === 'nonprofit') {
    const folder = `listings/${entityType}/${entityId}`;
    if (category === 'sku') {
      return `${folder}/sku-${entityId}/${safeFilename}`;
    }
    return `${folder}/${category}/${safeFilename}`;
  }

  if (entityType === 'blog') {
    return `blogs/${entityId}/${safeFilename}`;
  }

  return `pages/${entityId}/${safeFilename}`;
}

export const uploadMedia = defineAction({
  accept: 'form',
  input: z.object({
    file: z.any(),
    entityType: z.string().optional().default('general'),
    entityId: z.string().optional().default(''),
    category: z.string().optional().default('gallery'),
    hash: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    businessId: z.string().optional(),
  }),
  handler: async (input) => {
    const db = await getDb();
    const auth = await initAuth();
    const { user } = await auth.api.getSession({ headers: { cookie: '' } }).catch(() => ({ user: null, session: null }));

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
            },
            isDuplicate: true,
          };
        }
      }

      // Check business limits
      if (input.businessId) {
        const [business] = await db.select({ planType: businessPages.planType, ownerId: businessPages.ownerId })
          .from(businessPages)
          .where(eq(businessPages.id, input.businessId))
          .limit(1);

        if (business && business.ownerId !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
          return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied to this business' } };
        }

        const limits = await getPlanLimits(business?.planType || null) || DEFAULT_LIMITS;

        const imageCountResult = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.businessId, input.businessId), eq(media.type, 'image')))
          .get();
        const videoCountResult = await db.select({ count: count() })
          .from(media)
          .where(and(eq(media.businessId, input.businessId), eq(media.type, 'video')))
          .get();

        if (isImage && (imageCountResult?.count || 0) >= limits.maxBusinessImages) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxBusinessImages} images allowed` } };
        }
        if (isVideo && (videoCountResult?.count || 0) >= limits.maxBusinessVideos) {
          return { success: false, error: { code: 'LIMIT_REACHED', message: `Maximum ${limits.maxBusinessVideos} videos allowed` } };
        }
      }

      // Build R2 key
      const r2Key = buildR2Key({
        entityType: input.entityType || 'general',
        entityId: input.entityId || '',
        category: input.category || 'gallery',
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
            contentType: 'image/webp',
            cacheControl: 'public, max-age=31536000, immutable',
          },
        });
        finalUrl = `${getR2PublicUrl()}/${r2Key}`;
        storedPath = r2Key;
        finalMimeType = 'image/webp';
        finalSize = buffer.length;
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
        type: isImage ? 'image' : 'video',
        businessId: input.entityId || null,
        createdById: user.id,
        hash: input.hash || null,
        entityType: input.entityType || 'general',
        entityId: input.entityId || null,
        category: input.category || 'gallery',
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
          type: isImage ? 'image' : 'video',
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