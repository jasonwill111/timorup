// Optimized Image Component for React
// Uses R2 CDN with responsive srcset for optimal loading

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  sizes?: string;
}

// R2 public URL from environment
const R2_PUBLIC_URL = typeof window !== 'undefined' 
  ? (import.meta.env.PUBLIC_R2_PUBLIC_URL || `https://${import.meta.env.PUBLIC_R2_BUCKET || 'timorbiz-media'}.r2.cloudflarestorage.com`)
  : '';

// Generate responsive srcset for R2 images
function generateSrcset(src: string): string {
  if (!src) return '';
  
  // If it's a data URL or external URL, no srcset
  if (src.startsWith('data:') || (src.startsWith('http') && !src.includes('r2.cloudflarestorage'))) {
    return '';
  }
  
  // Extract the key from R2 URL
  let key = src;
  if (src.includes(R2_PUBLIC_URL)) {
    key = src.replace(`${R2_PUBLIC_URL}/`, '');
  }
  
  // Generate srcset with different widths
  const widths = [320, 640, 960, 1280];
  const cdnBase = 'https://timorbiz.com/cdn-cgi/image';
  
  const srcsetParts = widths.map(w => {
    // Using Cloudflare Images CDN transformation
    const cdnUrl = `${cdnBase}/width=${w},quality=75,format=webp/${R2_PUBLIC_URL}/${key} ${w}w`;
    return cdnUrl;
  });
  
  return srcsetParts.join(', ');
}

// Get the full URL for the image
function getImageUrl(src: string): string {
  if (!src) return '/placeholder.svg';
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  return `${R2_PUBLIC_URL}/${src}`;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}: OptimizedImageProps) {
  const imageUrl = getImageUrl(src);
  const srcset = generateSrcset(src);
  
  return (
    <img
      src={imageUrl}
      srcSet={srcset || undefined}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={`optimized-image ${className}`}
      loading={loading}
      decoding={decoding}
    />
  );
}
