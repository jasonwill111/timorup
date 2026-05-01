// Video compression using ffmpeg.wasm
// Compresses videos to smaller size before upload

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loading = false;
let preloaded = false;

// Target settings for compression
const MAX_VIDEO_SIZE = 8 * 1024 * 1024;

export interface CompressionProgress {
  progress: number;
  stage: 'loading' | 'compressing' | 'complete' | 'error';
  message: string;
}

export type ProgressCallback = (progress: CompressionProgress) => void;

async function loadFFmpeg(onProgress?: ProgressCallback): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }

  if (loading) {
    // Wait for existing load
    while (loading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return ffmpeg!;
  }

  loading = true;
  onProgress?.({ progress: 0, stage: 'loading', message: 'Loading video processor...' });

  ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    // Only report progress during actual compression, not loading
    if (preloaded) {
      onProgress?.({
        progress: Math.round(progress * 100),
        stage: 'compressing',
        message: `Compressing... ${Math.round(progress * 100)}%`
      });
    }
  });

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    preloaded = true;
    onProgress?.({ progress: 100, stage: 'complete', message: 'Processor ready' });
  } catch (error) {
    onProgress?.({ progress: 0, stage: 'error', message: 'Failed to load video processor' });
    throw error;
  } finally {
    loading = false;
  }

  return ffmpeg;
}

// Preload ffmpeg.wasm in background (call on page load)
export async function preloadFFmpeg(): Promise<void> {
  if (typeof window === 'undefined') return; // SSR guard
  if (ffmpeg?.loaded || preloaded) return;

  // Silent preload, don't report progress
  try {
    await loadFFmpeg();
  } catch {
    // Silently fail, user will see error on actual compression
  }
}

// Check if ffmpeg is ready
export function isFFmpegReady(): boolean {
  return preloaded || (ffmpeg !== null && ffmpeg.loaded);
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  withinLimit: boolean;
}

export async function compressVideo(
  file: File,
  options: {
    maxSize?: number;
    onProgress?: ProgressCallback;
    signal?: AbortSignal;
  } = {}
): Promise<CompressionResult> {
  const { maxSize = MAX_VIDEO_SIZE, onProgress, signal } = options;

  // Skip if too small
  if (file.size < 500 * 1024) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 1,
      withinLimit: true,
    };
  }

  const originalSize = file.size;
  const alreadySmall = file.size <= maxSize * 0.6;

  try {
    // If already preloaded, skip loading message
    const showLoadingProgress = !preloaded;
    if (showLoadingProgress) {
      onProgress?.({ progress: 0, stage: 'loading', message: 'Loading video processor...' });
    } else {
      onProgress?.({ progress: 0, stage: 'compressing', message: 'Starting compression...' });
    }

    const ff = await loadFFmpeg(onProgress);

    if (signal?.aborted) {
      throw new Error('Compression cancelled');
    }

    if (!showLoadingProgress) {
      onProgress?.({ progress: 0, stage: 'compressing', message: 'Starting compression...' });
    }

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    await ff.writeFile(inputName, await fetchFile(file));

    if (signal?.aborted) {
      await ff.deleteFile(inputName).catch(() => {});
      throw new Error('Compression cancelled');
    }

    // Adjust quality based on original size
    // Small files (already < 3.5MB): lighter compression, preserve quality
    // Large files: aggressive compression to fit within limit
    const isSmallFile = alreadySmall;
    const crf = isSmallFile ? '24' : '28'; // Lower CRF = better quality but larger
    const videoBitrate = isSmallFile ? '800k' : '500k';
    const audioBitrate = isSmallFile ? '96k' : '64k';
    const targetWidth = isSmallFile ? 1080 : TARGET_WIDTH;
    const targetHeight = isSmallFile ? 720 : TARGET_HEIGHT;

    await ff.exec([
      '-i', inputName,
      '-vf', `scale='min(${targetWidth},iw)':min'(${targetHeight},ih)':force_original_aspect_ratio=decrease`,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', crf,
      '-b:v', videoBitrate,
      '-c:a', 'aac',
      '-b:a', audioBitrate,
      '-movflags', '+faststart',
      '-y',
      outputName
    ]);

    if (signal?.aborted) {
      await ff.deleteFile(inputName).catch(() => {});
      await ff.deleteFile(outputName).catch(() => {});
      throw new Error('Compression cancelled');
    }

    let data = await ff.readFile(outputName);
    let blob = new Blob([data], { type: 'video/mp4' });

    // If still over limit, do second pass with more compression
    if (blob.size > maxSize) {
      onProgress?.({ progress: 80, stage: 'compressing', message: 'Further compressing...' });

      await ff.exec([
        '-i', outputName,
        '-vf', `scale='min(640,iw)':min'(${480},ih)':force_original_aspect_ratio=decrease`,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '32',
        '-b:v', '300k',
        '-c:a', 'aac',
        '-b:a', '48k',
        '-movflags', '+faststart',
        '-y',
        'output2.mp4'
      ]);

      const data2 = await ff.readFile('output2.mp4');
      const blob2 = new Blob([data2], { type: 'video/mp4' });

      await ff.deleteFile('output2.mp4').catch(() => {});

      if (blob2.size < blob.size) {
        blob = blob2;
      }
    }

    // Cleanup
    await ff.deleteFile(inputName).catch(() => {});
    await ff.deleteFile(outputName).catch(() => {});

    const compressedSize = blob.size;
    const finalRatio = compressedSize / originalSize;
    const withinLimit = compressedSize <= maxSize;

    onProgress?.({
      progress: 100,
      stage: withinLimit ? 'complete' : 'error',
      message: withinLimit
        ? `Done! ${formatBytes(compressedSize)} (saved ${formatBytes(originalSize - compressedSize)})`
        : `Too large: ${formatBytes(compressedSize)} (max ${formatBytes(maxSize)})`
    });

    return {
      file: new File([blob], file.name.replace(/\.[^.]+$/, '.mp4'), { type: 'video/mp4' }),
      originalSize,
      compressedSize,
      compressionRatio: finalRatio,
      withinLimit,
    };

  } catch (error) {
    onProgress?.({ progress: 0, stage: 'error', message: `Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    throw error;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Check if browser supports ffmpeg.wasm
export function isCompressionSupported(): boolean {
  if (typeof window === 'undefined') return false;

  // SharedArrayBuffer requires secure context
  const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
  const hasWebAssembly = typeof WebAssembly !== 'undefined';

  // COOP/COEP headers needed for SharedArrayBuffer
  // Most modern browsers support it with proper headers
  return hasWebAssembly && (hasSharedArrayBuffer || typeof CrossOriginIsolation !== 'undefined');
}