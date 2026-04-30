// File validation schemas using Zod v4
import * as z from 'zod';

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Zod v4 file validation with refine (z.file maxSize may not work in Node environments)
// Using refine for both MIME type and size validation for cross-environment compatibility
export const ImageFileSchema = z.file()
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    { error: `Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}` }
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    { error: `File too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB` }
  );

export const VideoFileSchema = z.file()
  .refine(
    (file) => ALLOWED_VIDEO_TYPES.includes(file.type),
    { error: `Invalid video type. Allowed: ${ALLOWED_VIDEO_TYPES.join(', ')}` }
  )
  .refine(
    (file) => file.size <= MAX_VIDEO_SIZE,
    { error: `File too large. Maximum size: ${MAX_VIDEO_SIZE / 1024 / 1024}MB` }
  );

// Generic file schema with options
export const createFileSchema = (options: {
  mime?: string[];
  maxSize?: number;
  minSize?: number;
}) => {
  let schema = z.file();
  if (options.mime && options.mime.length > 0) {
    schema = schema.refine(
      (file) => options.mime!.includes(file.type),
      { error: `Invalid file type. Allowed: ${options.mime!.join(', ')}` }
    );
  }
  if (options.maxSize) {
    schema = schema.refine(
      (file) => file.size <= options.maxSize!,
      { error: `File too large. Maximum size: ${options.maxSize! / 1024 / 1024}MB` }
    );
  }
  if (options.minSize) {
    schema = schema.refine(
      (file) => file.size >= options.minSize!,
      { error: `File too small. Minimum size: ${options.minSize! / 1024}KB` }
    );
  }
  return schema;
};

// Parse and validate file with Zod v4
export const validateImageFile = (file: File) => {
  const result = ImageFileSchema.safeParse(file);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      valid: false,
      error: issue?.message || 'Invalid image file',
    };
  }
  return { valid: true, error: null };
};

export const validateVideoFile = (file: File) => {
  const result = VideoFileSchema.safeParse(file);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      valid: false,
      error: issue?.message || 'Invalid video file',
    };
  }
  return { valid: true, error: null };
};
