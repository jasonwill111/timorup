// R2 operations for media storage
// Uses Cloudflare Workers R2 binding

import { env } from 'cloudflare:workers';
import type { EntityType, MediaCategory, MediaUploadParams } from './types';

/**
 * Get R2 bucket from Workers binding
 */
export function getR2Bucket(): R2Bucket {
  const bucket = env.MEDIA_BUCKET as R2Bucket | undefined;
  if (!bucket) {
    throw new Error('R2 bucket not configured (MEDIA_BUCKET binding missing)');
  }
  return bucket;
}

/**
 * Get R2 public URL for serving files
 */
export function getR2PublicUrl(): string {
  return (env.R2_PUBLIC_URL as string) || `https://timorlist-media.r2.cloudflarestorage.com`;
}

/**
 * Build R2 key from upload parameters
 * Structure:
 * - general/{category}/{filename}
 * - listings/business/{id}/{category}/{filename}
 * - listings/nonprofit/{id}/{category}/{filename}
 * - blogs/{id}/{filename}
 * - pages/{slug}/{filename}
 */
export function buildR2Key(params: MediaUploadParams): string {
  const { entityType, entityId, category, filename } = params;

  // Sanitize filename - remove path traversal, keep extension
  const safeFilename = sanitizeFilename(filename);

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

/**
 * Sanitize filename to prevent path traversal
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and parent directory references
  const name = filename.split('/').pop() || filename;
  const clean = name.replace(/\.\./g, '').replace(/[<>:"|?*]/g, '_');
  return clean || `media-${Date.now()}`;
}

/**
 * Delete a single file from R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const bucket = getR2Bucket();
    await bucket.delete(key);
    return true;
  } catch (error) {
    console.error('Error deleting from R2:', error);
    return false;
  }
}

/**
 * Delete all files with a given prefix (folder)
 */
export async function deleteByPrefix(prefix: string): Promise<boolean> {
  try {
    const bucket = getR2Bucket();
    let cursor: string | undefined;

    do {
      const result = await bucket.list({ prefix, cursor, limit: 1000 });
      for (const obj of result.objects ?? []) {
        if (obj.key) {
          await bucket.delete(obj.key);
        }
      }
      cursor = result.truncated ? result.cursor : undefined;
    } while (cursor);

    return true;
  } catch (error) {
    console.error('Error deleting prefix from R2:', error);
    return false;
  }
}

/**
 * List files with a given prefix
 */
export async function listByPrefix(prefix: string, limit = 100): Promise<R2Object[]> {
  const bucket = getR2Bucket();
  const result = await bucket.list({ prefix, limit });
  return result.objects;
}

/**
 * Get public URL for a media file
 */
export function getPublicMediaUrl(key: string): string {
  if (key.startsWith('http')) {
    return key;
  }
  return `${getR2PublicUrl()}/${key}`;
}
