// Canvas-based image compression utility
// Client-side only - uses browser Canvas API

import { DEFAULT_COMPRESSION_OPTIONS, FILE_SIZE_LIMITS, type CompressionOptions } from './types';

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Compress an image using Canvas API
 * @param file - The image file to compress
 * @param options - Compression options (maxDim, quality)
 * @returns Promise<CompressionResult> with compressed blob and dimensions
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = DEFAULT_COMPRESSION_OPTIONS
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Calculate scaled dimensions
        let { width, height } = img;
        if (width > options.maxDim || height > options.maxDim) {
          const ratio = Math.min(options.maxDim / width, options.maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width, height });
            } else {
              reject(new Error('Compression failed - could not create blob'));
            }
          },
          'image/webp',
          options.quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate file size before upload
 * @param file - The file to validate
 * @param type - 'image' or 'video'
 * @returns true if valid, throws error if not
 */
export function validateFileSize(file: File, type: 'image' | 'video'): true {
  const limit = FILE_SIZE_LIMITS[type];
  if (file.size > limit) {
    const limitMB = limit / (1024 * 1024);
    throw new Error(`${type === 'image' ? 'Image' : 'Video'} must be under ${limitMB}MB`);
  }
  return true;
}

/**
 * Check if file is an image
 * @param file - The file to check
 * @returns true if image type
 */
export function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is a video
 * @param file - The file to check
 * @returns true if video type
 */
export function isVideo(file: File): boolean {
  return file.type.startsWith('video/');
}
