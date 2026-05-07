// Media types for upload system

export type EntityType = 'business' | 'nonprofit' | 'blog' | 'page' | 'general';
export type MediaCategory = 'profile' | 'banner' | 'gallery' | 'sku' | 'updates' | 'hero' | 'content';
export type MediaType = 'image' | 'video' | 'document';

export interface MediaUploadParams {
  entityType: EntityType;
  entityId: string;
  category: MediaCategory;
  filename: string;
}

export interface MediaRecord {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  hash: string;
  entityType: EntityType;
  entityId: string;
  category: MediaCategory;
  r2Key: string;
  createdAt: Date;
}

export interface UploadResult {
  success: boolean;
  media?: MediaRecord;
  isDuplicate?: boolean;
  error?: string;
}

export interface CompressionOptions {
  maxDim: number;
  quality: number;
}

export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxDim: 1920,
  quality: 0.85,
};

export const FILE_SIZE_LIMITS = {
  image: 2 * 1024 * 1024, // 2MB
  video: 5 * 1024 * 1024, // 5MB
} as const;

export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
} as const;
