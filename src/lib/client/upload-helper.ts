/**
 * Client-side upload helper with compression
 * Compresses images before uploading to reduce file size
 *
 * Usage:
 * import { uploadFile } from '@/lib/client/upload-helper';
 * const result = await uploadFile(file, formData, 'businesses', businessId);
 */

import { compressImage, getImageDimensions } from './compression';
import { actions } from 'astro:actions';

export interface UploadOptions {
  type: string;          // R2 path prefix (e.g., 'businesses', 'hero')
  typeId: string;         // Entity ID
  compress?: boolean;     // Enable compression (default: true for images)
  maxSizeMB?: number;      // Max compressed size (default: 1)
  maxWidthOrHeight?: number; // Max dimension (default: 1920)
}

export interface UploadResult {
  success: boolean;
  data?: {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
  };
  error?: {
    code: string;
    message: string;
  };
  isDuplicate?: boolean;
}

/**
 * Upload single file with automatic compression for images
 *
 * @param file - Original File object
 * @param options - Upload options including type and typeId
 * @returns Upload result
 *
 * @example
 * // Simple usage
 * const result = await uploadFile(file, {
 *   type: 'businesses',
 *   typeId: 'biz-123',
 * });
 *
 * // With custom options
 * const result = await uploadFile(file, {
 *   type: 'hero',
 *   typeId: 'hero',
 *   compress: true,
 *   maxSizeMB: 0.5,
 *   maxWidthOrHeight: 1024,
 * });
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const {
    type,
    typeId,
    compress = true,
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
  } = options;

  // Skip compression for videos or if disabled
  if (!file.type.startsWith('image/') || !compress) {
    const dimensions = await getImageDimensions(file);
    return uploadDirect(file, dimensions.width, dimensions.height, type, typeId);
  }

  try {
    // Compress the image
    const compressed = await compressImage(file, {
      maxSizeMB,
      maxWidthOrHeight,
      quality: 0.8,
    });

    const saved = (file.size - compressed.size) / file.size * 100;
    console.log(`📦 Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB (saved ${saved.toFixed(0)}%)`);

    // Get dimensions of compressed file
    const dimensions = await getImageDimensions(compressed);

    // Upload compressed
    return uploadDirect(compressed, dimensions.width, dimensions.height, type, typeId);
  } catch (error) {
    console.warn('Compression failed, uploading original:', error);
    // Fallback: upload original
    const dimensions = await getImageDimensions(file);
    return uploadDirect(file, dimensions.width, dimensions.height, type, typeId);
  }
}

/**
 * Internal: Upload file directly without compression
 */
async function uploadDirect(
  file: File,
  width: number,
  height: number,
  type: string,
  typeId: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('typeId', typeId);
  formData.append('width', String(width));
  formData.append('height', String(height));

  try {
    return await actions.media.uploadMedia(formData) as unknown as UploadResult;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: error instanceof Error ? error.message : 'Upload failed',
      },
    };
  }
}

/**
 * Batch upload multiple files
 *
 * @param files - Array of File objects
 * @param options - Upload options (same for all files)
 * @param onProgress - Optional progress callback
 * @returns Array of results
 *
 * @example
 * const results = await uploadFiles(files, {
 *   type: 'businesses',
 *   typeId: 'biz-123',
 * });
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions,
  onProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    const result = await uploadFile(file, options);
    results.push(result);

    onProgress?.(i + 1, total);

    // Stop on first error
    if (!result.success) {
      break;
    }
  }

  return results;
}

// Legacy export for backward compatibility
// Note: uploadWithCompression removed - use uploadFile instead
export type { UploadOptions, UploadResult } from './upload-helper';
