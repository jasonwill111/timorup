// Icon utilities for category icons (Lucide SVG - no emojis)

// Predefined Lucide icons
export const LUCIDE_ICONS = [
  'utensils', 'bed', 'shopping-bag', 'heart', 'car',
  'briefcase', 'graduation-cap', 'music', 'building',
  'store', 'coffee', 'shirt', 'scissors', 'wrench', 'home',
  'globe', 'map-pin', 'star', 'check', 'x', 'info', 'alert-triangle'
] as const;

// Lucide SVG paths (d attribute for each icon)
const LUCIDE_SVG_PATHS: Record<string, string> = {
  utensils: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7',
  bed: 'M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9',
  'shopping-bag': 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  car: 'M5 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5zM14 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5zM5 17h14M5 17a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 11-4 0 2 2 0 014 0zM7 7h10M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2',
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  'graduation-cap': 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5',
  music: 'M9 18V5l12-2v13M9 9l12-2',
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  store: 'M3 3h1l1 6V3H5v6l1 1v10M9 21V9h12v12M9 9h12M9 13h12',
  coffee: 'M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3',
  shirt: 'M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z',
  scissors: 'M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4l-8.5 8.5M20 4L8 16M8.5 15.5L20 4',
  wrench: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10',
  globe: 'M12 21a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z',
  'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  info: 'M12 16v-4M12 8h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z',
  'alert-triangle': 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
};

// Mapping category slugs to Lucide icons (SVG)
export const DEFAULT_CATEGORY_ICONS: Record<string, { type: 'lucide'; value: string }> = {
  'restaurants-cafes': { type: 'lucide', value: 'utensils' },
  'hotels-accommodation': { type: 'lucide', value: 'bed' },
  'shopping': { type: 'lucide', value: 'shopping-bag' },
  'health-beauty': { type: 'lucide', value: 'heart' },
  'automotive': { type: 'lucide', value: 'car' },
  'professional-services': { type: 'lucide', value: 'briefcase' },
  'education': { type: 'lucide', value: 'graduation-cap' },
  'entertainment': { type: 'lucide', value: 'music' },
};

export type IconType = 'lucide';
export type ParsedIcon = { type: IconType; value: string } | null;

/**
 * Get Lucide icon SVG path
 */
export function getLucideIconPath(name: string): string {
  return LUCIDE_SVG_PATHS[name] || LUCIDE_SVG_PATHS.building;
}

/**
 * Parse icon string into structured format
 */
export function parseIcon(icon: string | null | undefined): ParsedIcon {
  if (!icon || icon === '') return null;
  if (icon.startsWith('lucide:')) return { type: 'lucide', value: icon.slice(8) };
  return null;
}

/**
 * Build icon string from type and value
 */
export function buildIcon(type: IconType, value: string): string {
  return `${type}:${value}`;
}

/**
 * Get display icon from database value
 */
export function getDisplayIcon(icon: string | null | undefined, defaultIcon: { type: IconType; value: string } = { type: 'lucide', value: 'building' }): { type: IconType; value: string } {
  const parsed = parseIcon(icon);
  return parsed ?? defaultIcon;
}

/**
 * Check if icon is valid
 */
export function isValidIcon(icon: string, type: IconType): boolean {
  if (type === 'lucide') return LUCIDE_ICONS.includes(icon as typeof LUCIDE_ICONS[number]);
  return false;
}
