/**
 * Avatar utilities for consistent avatar rendering across the app
 */

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarClasses {
  container: string;
  image: string;
  fallback: string;
}

/**
 * Size class mappings
 */
export const AVATAR_SIZES: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

/**
 * Get CSS classes for a given avatar size
 */
export function getAvatarClass(size: AvatarSize = 'md'): string {
  return AVATAR_SIZES[size];
}

/**
 * Get all avatar CSS classes for rendering
 */
export function getAvatarClasses(size: AvatarSize = 'md'): AvatarClasses {
  return {
    container: `inline-flex shrink-0 overflow-hidden rounded-full bg-muted ${AVATAR_SIZES[size]}`,
    image: 'aspect-square h-full w-full object-cover',
    fallback: 'flex h-full w-full items-center justify-center font-medium text-muted-foreground',
  };
}

/**
 * Extract initials from a name (1-2 characters)
 */
export function getUserInitials(name: string | null | undefined): string {
  if (!name) return '?';

  const trimmed = name.trim();
  if (trimmed.length === 0) return '?';

  // Handle "First Last" pattern
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Single word - take first 2 chars
  return trimmed.slice(0, 2).toUpperCase();
}

/**
 * Get brand color for avatar background based on name
 * Returns a deterministic color from a predefined set
 */
export function getAvatarColor(name: string | null | undefined): string {
  if (!name) return 'bg-gray-400';

  // Generate a number from the name for color selection
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-brand-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Generate inline avatar HTML string (for dynamic client-side rendering)
 */
export function createAvatarHtml(
  src: string | null | undefined,
  fallback: string,
  size: AvatarSize = 'md',
  extraClass: string = ''
): string {
  const classes = getAvatarClasses(size);

  if (src) {
    const sizeNum = AVATAR_SIZES[size].match(/h-(\d+)/)?.[1] || '10';
    const px = parseInt(sizeNum) * 4;
    return `<img src="${src}" alt="${fallback || 'Avatar'}" class="${classes.container} ${classes.image} ${extraClass}" width="${px}" height="${px}" loading="lazy" decoding="async" />`;
  }

  const initials = getUserInitials(fallback);
  const bgColor = getAvatarColor(fallback);

  return `<span class="${classes.container} ${bgColor} flex items-center justify-center ${extraClass}">
    <span class="text-white font-medium">${initials}</span>
  </span>`;
}

/**
 * Get media URL from profileImageId
 */
export function getMediaUrl(profileImageId: string | null | undefined): string | null {
  if (!profileImageId) return null;
  return `/api/media/${profileImageId}`;
}
