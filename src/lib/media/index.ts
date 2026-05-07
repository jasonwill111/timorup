// Media module exports
// Re-exports all media utilities

// Types
export * from './types';

// Hash utilities (client/server)
export { sha256, sha256FromBuffer } from './hash';

// Compression utilities (client-side only)
export {
  compressImage,
  validateFileSize,
  isImage,
  isVideo,
  type CompressionResult,
} from './compress';

// R2 operations (server-side)
export {
  getR2Bucket,
  getR2PublicUrl,
  buildR2Key,
  deleteFromR2,
  deleteByPrefix,
  listByPrefix,
  getPublicMediaUrl,
} from './r2';

// Client-side upload utilities
export { uploadMedia, uploadMultiple, type UploadOptions } from './client';
