/**
 * Client-side image compression utilities
 * Uses browser-image-compression for lightweight compression
 */

import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;           // Default: 1MB
  maxWidthOrHeight?: number;     // Default: 1920
  quality?: number;              // Default: 0.8
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  quality: 0.8,
};

/**
 * Compress image file before upload
 * Reduces file size while maintaining reasonable quality
 *
 * @param file - Original File object
 * @param options - Compression options
 * @returns Compressed File object
 *
 * @example
 * const compressed = await compressImage(file);
 * // Upload compressed instead of original
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Only compress images, not videos or other types
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: mergedOptions.maxSizeMB,
      maxWidthOrHeight: mergedOptions.maxWidthOrHeight,
      useWebWorker: true,
      fileType: 'image/webp', // Convert to webp for better compression
    });

    // Return with original name but compressed content
    return new File(
      [compressedFile],
      file.name.replace(/\.[^.]+$/, '.webp'),
      { type: 'image/webp' }
    );
  } catch (error) {
    console.warn('Compression failed, using original:', error);
    return file;
  }
}

/**
 * Get image dimensions from File
 *
 * @param file - Image File object
 * @returns Promise with width and height
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Compress and get dimensions before upload
 *
 * @param file - Original File object
 * @param options - Compression options
 * @returns Object with compressed file and dimensions
 *
 * @example
 * const { file, width, height } = await prepareForUpload(originalFile);
 * // Use file for upload, width/height for metadata
 */
export async function prepareForUpload(
  file: File,
  options: CompressionOptions = {}
): Promise<{
  file: File;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}> {
  const originalSize = file.size;
  const dimensions = await getImageDimensions(file);

  // Compress if image
  const compressed = await compressImage(file, options);

  return {
    file: compressed,
    width: dimensions.width,
    height: dimensions.height,
    originalSize,
    compressedSize: compressed.size,
  };
}
