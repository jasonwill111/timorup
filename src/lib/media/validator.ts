/**
 * Media validation utilities
 * Reusable validation functions for media upload pipeline
 */
import { getMediaLimits, type MediaLimits } from '@/lib/media-limits';
import { isAllowedImageType, isAllowedVideoType, formatFileSize } from '@/lib/media-limits';
import { ErrorCode } from '@/lib/errors';

/**
 * Result of media file validation
 */
export interface MediaValidationResult {
  valid: boolean;
  isImage: boolean;
  isVideo: boolean;
  error?: {
    code: ErrorCode;
    message: string;
  };
}

/**
 * Validate a media file against entity limits
 *
 * @param file - The File object to validate
 * @param entityType - The entity type (e.g., 'businesses', 'blogs')
 * @returns Validation result with error details if invalid
 */
export function validateMediaFile(
  file: File,
  entityType: string
): MediaValidationResult {
  const limits = getMediaLimits(entityType);

  // Check if file is provided
  if (!file) {
    return {
      valid: false,
      isImage: false,
      isVideo: false,
      error: {
        code: ErrorCode.MEDIA_NO_FILE,
        message: 'No file provided',
      },
    };
  }

  const isImage = isAllowedImageType(file.type);
  const isVideo = isAllowedVideoType(file.type);

  // Check file type
  if (!isImage && !isVideo) {
    const allowedTypes = [
      ...limits.allowedImageTypes,
      ...limits.allowedVideoTypes,
    ].join(', ');
    return {
      valid: false,
      isImage: false,
      isVideo: false,
      error: {
        code: ErrorCode.MEDIA_TYPE_NOT_ALLOWED,
        message: `File type not allowed. Allowed: ${allowedTypes}`,
      },
    };
  }

  // Check file size
  const maxSize = isImage ? limits.maxImageSize : limits.maxVideoSize;
  if (file.size > maxSize) {
    const maxMB = formatFileSize(maxSize);
    const actualMB = formatFileSize(file.size);
    return {
      valid: false,
      isImage,
      isVideo,
      error: {
        code: ErrorCode.MEDIA_SIZE_TOO_LARGE,
        message: `File must be less than ${maxMB} (got ${actualMB})`,
      },
    };
  }

  return {
    valid: true,
    isImage,
    isVideo,
  };
}

/**
 * Build R2 key for media storage
 */
export function buildR2Key(params: {
  type: string;
  filename: string;
  timestamp: number;
  id: string;
}): string {
  const { type, filename, timestamp, id } = params;
  const ext = filename.split('.').pop() || 'webp';
  const safeFilename = `${timestamp}-${id}.${ext}`;
  return `${type}/${safeFilename}`;
}

/**
 * Parse media type from R2 key prefix
 */
export function getMediaTypeFromPrefix(prefix: string): string {
  return prefix;
}