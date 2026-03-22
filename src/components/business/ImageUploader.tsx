// Image Uploader Component for Business Banner and Profile Images
import { useState, useRef } from 'react';
import { Button } from '../ui/button';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange?: (url: string) => void;
  aspectRatio?: string;
  circular?: boolean;
  maxSize?: number; // in bytes
  accept?: string;
}

// Compression settings
const COMPRESSION_QUALITY = 0.8;
const MAX_DIMENSION = 1920; // Max width or height

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Scale down if needed
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = (height / width) * MAX_DIMENSION;
            width = MAX_DIMENSION;
          } else {
            width = (width / height) * MAX_DIMENSION;
            height = MAX_DIMENSION;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          COMPRESSION_QUALITY
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio,
  circular = false,
  maxSize = 2 * 1024 * 1024, // 2MB default (matches server limit)
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    const validTypes = accept.split(',').map(t => t.trim());
    if (!validTypes.some(type => file.type === type || file.type.startsWith(type.replace('*', '')))) {
      setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size before compression
    if (file.size > maxSize * 2) {
      // Allow some headroom for compression
      setError(`Image must be less than ${Math.round(maxSize / (1024 * 1024)) * 2}MB before compression`);
      return;
    }

    // Compress the image before upload
    let processedFile: File;
    try {
      if (file.type !== 'image/jpeg' || file.size > maxSize) {
        processedFile = await compressImage(file);
      } else {
        processedFile = file;
      }
    } catch (compressError) {
      console.error('Compression failed, using original:', compressError);
      processedFile = file;
    }

    // Validate compressed file size
    if (processedFile.size > maxSize) {
      setError(`Compressed image still too large. Please use a smaller image (max ${Math.round(maxSize / (1024 * 1024))}MB)`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(processedFile);

    // Upload to server
    await uploadFile(processedFile);
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.url) {
        setPreview(data.data.url);
        onChange?.(data.data.url);
      } else {
        // Fallback: use base64 preview even if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreview(result);
          onChange?.(result);
        };
        reader.readAsDataURL(file);
        setError(null); // Don't show error, we can use local preview
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback: use base64 preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange?.(result);
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <div
            className={`relative overflow-hidden ${circular ? 'rounded-full' : 'rounded-lg'} ${
              aspectRatio === '3:1' ? 'aspect-[3/1]' : 'aspect-square'
            } w-full max-w-md bg-muted`}
          >
            <img
              src={preview}
              alt={label}
              className={`w-full h-full object-cover ${circular ? 'rounded-full' : 'rounded-lg'}`}
            />
          </div>
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Change'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={loading}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg ${
            aspectRatio === '3:1' ? 'aspect-[3/1]' : 'aspect-square'
          } w-full max-w-md flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50`}
        >
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">
                Click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP • Max {Math.round(maxSize / (1024 * 1024))}MB (auto-compressed)
              </p>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
