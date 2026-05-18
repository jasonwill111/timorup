// Media handling utilities for Cloudflare R2 storage
// Uses Workers R2 binding - no credentials needed!

import { env } from 'cloudflare:workers';

// Sharp is NOT compatible with Cloudflare Workers - use dynamic import with fallback
async function getSharp() {
  try {
    // Dynamic import - only load when actually needed (for image processing)
    const sharp = await import('sharp');
    return sharp.default;
  } catch (error) {
    console.warn('Sharp not available in this environment, image processing disabled');
    return null;
  }
}

// Get R2 bucket from Workers binding
export function getR2Bucket(): R2Bucket | undefined {
  const bucket = env.MEDIA_BUCKET;
  if (!bucket) {
    return undefined;
  }
  return bucket as R2Bucket;
}

// Get R2 public URL
export function getR2PublicUrl(): string {
  return (env.R2_PUBLIC_URL as string) || `https://timorlist-media.r2.cloudflarestorage.com`;
}

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE = 8 * 1024 * 1024; // 8MB

export const PLAN_LIMITS = {
  basic: { maxProducts: 10, maxImages: 10, maxVideos: 1 },
  pro: { maxProducts: 30, maxImages: 10, maxVideos: 1 },
  max: { maxProducts: 60, maxImages: 10, maxVideos: 1 },
};

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Folder structure:
// /business/{id}/ - business images
// /gov/{id}/ - government images
// /ngo/{id}/ - NGO images
// /blog/{id}/ - blog images
// /hero/ - homepage banners
// /category/ - category icons
// /page/{name}/ - page-specific files
// /system/ - logo, favicon (PROTECTED)
// /files/ - PDFs, documents

export type MediaType = 'image' | 'video' | 'document';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

// Upload file to R2
export async function uploadToR2(
  data: Buffer | ArrayBuffer,
  key: string,
  mimeType: string
): Promise<{ url: string; size: number }> {
  const bucket = getR2Bucket();
  const publicUrl = getR2PublicUrl();

  try {
    await bucket.put(key, data, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    return {
      url: `${publicUrl}/${key}`,
      size: data instanceof Buffer ? data.length : data.byteLength,
    };
  } catch (error) {
    console.error('R2 upload failed:', error);
    throw new Error(`Failed to upload to R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Process and upload image
export async function uploadImageToR2(
  file: File | Buffer,
  key: string
): Promise<UploadResult> {
  let inputBuffer: Buffer;
  let mimeType: string;

  try {
    if (file instanceof File) {
      inputBuffer = Buffer.from(await file.arrayBuffer());
      mimeType = file.type;
    } else {
      inputBuffer = file;
      mimeType = 'image/webp';
    }

    // Dynamic sharp import - fails gracefully if not available
    const sharpModule = await getSharp();
    let processed: { data: Buffer; info: { width: number; height: number } };

    if (sharpModule) {
      processed = await sharpModule(inputBuffer)
        .resize(MAX_IMAGE_WIDTH, null, { withoutEnlargement: true })
        .webp({ quality: IMAGE_QUALITY })
        .toBuffer({ resolveWithObject: true }) as { data: Buffer; info: { width: number; height: number } };
    } else {
      // Sharp not available - use original image
      processed = {
        data: inputBuffer,
        info: { width: 0, height: 0 }
      };
    }

    const bucket = getR2Bucket();
    const publicUrl = getR2PublicUrl();

    await bucket.put(key, processed.data, {
      httpMetadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    return {
      url: `${publicUrl}/${key}`,
      path: key,
      size: processed.data.length,
      mimeType: 'image/webp',
      width: processed.info.width,
      height: processed.info.height,
    };
  } catch (error) {
    console.error('Image processing/upload failed:', error);
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete single file from R2
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

// Delete folder (all files with prefix) from R2
export async function deleteFolderFromR2(prefix: string): Promise<boolean> {
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
    console.error('Error deleting folder from R2:', error);
    return false;
  }
}

// Get public URL for media
export function getPublicMediaUrl(key: string): string {
  if (key.startsWith('http')) {
    return key;
  }
  return `${getR2PublicUrl()}/${key}`;
}

// Transform image URL for optimization (using Cloudflare's image transformations)
export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string {
  const { width, height, quality = 80, format = 'webp' } = options;
  const r2PublicUrl = getR2PublicUrl();

  if (!originalUrl.includes(r2PublicUrl) && !originalUrl.includes('r2.cloudflarestorage.com')) {
    return originalUrl;
  }

  // Extract key from URL
  let key = originalUrl;
  if (originalUrl.includes(r2PublicUrl)) {
    key = originalUrl.replace(`${r2PublicUrl}/`, '');
  } else if (originalUrl.includes('r2.cloudflarestorage.com')) {
    const match = originalUrl.match(/timorlist-media\.r2\.cloudflarestorage\.com\/(.+)/);
    if (match) key = match[1];
  }

  const transforms = [];
  if (width) transforms.push(`width=${width}`);
  if (height) transforms.push(`height=${height}`);
  transforms.push(`quality=${quality}`);
  transforms.push(`format=${format}`);

  return `${env.SITE_URL || 'https://timorlist.com'}/cdn-cgi/image/${transforms.join(',')}/${r2PublicUrl}/${key}`;
}

// Check if running in Cloudflare environment
export function isCloudflareEnvironment(): boolean {
  return typeof process.env.CF_PAGES !== 'undefined' ||
         typeof process.env.CF_FUNCTION !== 'undefined';
}

// Validate file type
export function isAllowedImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}

export function isAllowedVideoType(mimeType: string): boolean {
  return ALLOWED_VIDEO_TYPES.includes(mimeType);
}

// Get folder path based on entity type
export function getMediaFolder(params: {
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

// Check if R2 is available
export function isR2Available(): boolean {
  try {
    getR2Bucket();
    return true;
  } catch {
    return false;
  }
}

// Build R2 key from upload parameters
// Structure:
// - general/{category}/{filename}
// - listings/business/{id}/{category}/{filename}
// - listings/nonprofit/{id}/{category}/{filename}
// - blogs/{id}/{filename}
// - pages/{slug}/{filename}
export function buildR2Key(params: {
  entityType: string;
  entityId: string;
  category: string;
  filename: string;
}): string {
  const { entityType, entityId, category, filename } = params;

  // Sanitize filename - remove path traversal, keep extension
  const safeFilename = filename.split('/').pop()?.replace(/\.\./g, '').replace(/[<>:"|?*]/g, '_') || `media-${Date.now()}`;

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

// List files with a given prefix
export async function listByPrefix(prefix: string, limit = 100): Promise<R2Object[]> {
  const bucket = getR2Bucket();
  const result = await bucket.list({ prefix, limit });
  return result.objects;
}