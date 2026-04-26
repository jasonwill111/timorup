// Media handling utilities for Cloudflare R2 storage
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Configuration
const R2_ENDPOINT = process.env.R2_ENDPOINT || process.env.CF_R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.CF_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.CF_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'timorlist-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com`;

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_TOTAL_IMAGES = 10;
export const MAX_VIDEOS = 1;

// Plan limits
export const PLAN_LIMITS = {
  basic: { maxProducts: 10, maxImages: 10, maxVideos: 1 },
  pro: { maxProducts: 30, maxImages: 10, maxVideos: 1 },
  max: { maxProducts: 60, maxImages: 10, maxVideos: 1 },
};

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Initialize S3 client for R2
let s3Client: S3Client | null = null;

// Export for testing - allows injection of mock client
export function createS3Client(config?: { endpoint?: string; credentials?: { accessKeyId: string; secretAccessKey: string } }): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: config?.endpoint || R2_ENDPOINT,
    credentials: config?.credentials || {
      accessKeyId: R2_ACCESS_KEY_ID || '',
      secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
  });
}

export function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = createS3Client();
  }
  return s3Client;
}

// Reset S3 client for testing
export function resetS3Client(): void {
  s3Client = null;
}

// Validate file type
export function validateFileType(mimeType: string): { valid: boolean; type: 'image' | 'video' | null } {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return { valid: true, type: 'image' };
  }
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return { valid: true, type: 'video' };
  }
  return { valid: false, type: null };
}

// Validate file size
export function validateFileSize(size: number, type: 'image' | 'video'): { valid: boolean; maxSize: number } {
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  return {
    valid: size <= maxSize,
    maxSize,
  };
}

// Generate unique file key
export function generateFileKey(userId: string, fileId: string, ext: string): string {
  const timestamp = Date.now();
  return `uploads/${userId}/${timestamp}-${fileId}.${ext}`;
}

// Upload file to R2 with compression metadata
export async function uploadToR2(
  file: Buffer | Uint8Array,
  key: string,
  mimeType: string,
  originalSize: number
): Promise<{ url: string; size: number; width?: number; height?: number }> {
  const client = getS3Client();
  
  // For images, we store the original - Cloudflare Images can resize on-the-fly
  // For videos, we accept as-is (compression should happen client-side or via external service)
  const upload = new Upload({
    client,
    params: {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
      // Set cache control for better performance
      CacheControl: 'public, max-age=31536000',
    },
  });

  await upload.done();

  // Return the public URL
  const url = `${R2_PUBLIC_URL}/${key}`;
  
  return {
    url,
    size: originalSize,
  };
}

// Delete file from R2
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const client = getS3Client();
    await client.send(new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (error) {
    console.error('Error deleting from R2:', error);
    return false;
  }
}

// Get signed URL for private files (if needed)
export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  // For R2 with public access, we just return the public URL
  // If using private bucket, would need to generate presigned URL
  return `${R2_PUBLIC_URL}/${key}`;
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
  
  // If using Cloudflare Images, construct transformation URL
  // Format: https://example.com/cdn-cgi/image/width=800,quality=80,format=webp/https://bucket.r2.cloudflarestorage.com/key
  
  if (!originalUrl.includes(R2_PUBLIC_URL)) {
    // Not an R2 URL, return as-is
    return originalUrl;
  }
  
  const key = originalUrl.replace(`${R2_PUBLIC_URL}/`, '');
  const transforms = [];
  
  if (width) transforms.push(`width=${width}`);
  if (height) transforms.push(`height=${height}`);
  transforms.push(`quality=${quality}`);
  transforms.push(`format=${format}`);
  
  return `https://timorlist.com/cdn-cgi/image/${transforms.join(',')}/${R2_PUBLIC_URL}/${key}`;
}

// Check if running in Cloudflare environment
export function isCloudflareEnvironment(): boolean {
  return typeof process.env.CF_PAGES !== 'undefined' || 
         typeof process.env.CF_FUNCTION !== 'undefined' ||
         process.env.NODE_ENV === 'cloudflare';
}

// Get public URL for media
export function getPublicMediaUrl(key: string): string {
  if (key.startsWith('http')) {
    return key;
  }
  return `${R2_PUBLIC_URL}/${key}`;
}
