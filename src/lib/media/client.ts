// Client-side media upload utilities
// Uses Canvas compression and SHA256 deduplication

import { sha256 } from './hash';
import { compressImage, validateFileSize, isImage, isVideo } from './compress';
import type { EntityType, MediaCategory, UploadResult } from './types';

export interface UploadOptions {
  entityType: EntityType;
  entityId: string;
  category: MediaCategory;
  filename: string;
  alt?: string;
  onProgress?: (progress: number) => void;
}

const UPLOAD_ENDPOINT = '/api/media/upload';

/**
 * Upload a file with automatic compression and deduplication
 * - Images: compressed via Canvas, SHA256 hash for deduplication
 * - Videos: directly uploaded (no compression in V1)
 */
export async function uploadMedia(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const { entityType, entityId, category, alt } = options;

  // Validate file type
  if (!isImage(file) && !isVideo(file)) {
    return { success: false, error: 'File type not allowed' };
  }

  // Validate file size
  try {
    const type = isImage(file) ? 'image' : 'video';
    validateFileSize(file, type);
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  let fileToUpload = file;
  let width: number | undefined;
  let height: number | undefined;

  // Compress images
  if (isImage(file)) {
    try {
      const result = await compressImage(file);
      fileToUpload = new File([result.blob], file.name, { type: 'image/webp' });
      width = result.width;
      height = result.height;
    } catch (e) {
      console.error('Compression failed, uploading original:', e);
      // Fall back to original file
    }
  }

  // Calculate hash for deduplication
  const hash = await sha256(fileToUpload);

  // Build form data
  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('hash', hash);
  formData.append('entityType', entityType);
  formData.append('entityId', entityId);
  formData.append('category', category);
  if (alt) formData.append('alt', alt);
  if (width) formData.append('width', String(width));
  if (height) formData.append('height', String(height));

  // Upload
  try {
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        media: {
          id: data.data.id,
          url: data.data.url,
          filename: data.data.filename,
          mimeType: data.data.mimeType,
          size: data.data.size,
          width: data.data.width,
          height: data.data.height,
          hash,
          entityType,
          entityId,
          category,
          r2Key: data.data.url,
          createdAt: new Date(),
        },
        isDuplicate: data.isDuplicate,
      };
    } else {
      return { success: false, error: data.error?.message || 'Upload failed' };
    }
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultiple(
  files: File[],
  options: Omit<UploadOptions, 'filename'>
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadMedia(file, {
      ...options,
      filename: file.name,
    });
    results.push(result);
  }

  return results;
}
