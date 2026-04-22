// Icon utilities for category icons (emoji + Lucide)

// Predefined emoji icons
export const EMOJI_ICONS = [
  '🍽️', '🏨', '🛍️', '💆', '🚗', '💼', '📚', '🎭', '🏢'
] as const;

// Predefined Lucide icons
export const LUCIDE_ICONS = [
  'utensils', 'bed', 'shopping-bag', 'heart', 'car',
  'briefcase', 'graduation-cap', 'music', 'building'
] as const;

// Mapping category slugs to default icons
export const DEFAULT_CATEGORY_ICONS: Record<string, { type: 'emoji' | 'lucide'; value: string }> = {
  'restaurants-cafes': { type: 'emoji', value: '🍽️' },
  'hotels-accommodation': { type: 'emoji', value: '🏨' },
  'shopping': { type: 'emoji', value: '🛍️' },
  'health-beauty': { type: 'emoji', value: '💆' },
  'automotive': { type: 'emoji', value: '🚗' },
  'professional-services': { type: 'emoji', value: '💼' },
  'education': { type: 'emoji', value: '📚' },
  'entertainment': { type: 'emoji', value: '🎭' },
};

export type IconType = 'emoji' | 'lucide';
export type ParsedIcon = { type: IconType; value: string } | null;

/**
 * Parse icon string into structured format
 * @param icon - Icon string like 'emoji:🍽️' or 'lucide:utensils' or ''
 */
export function parseIcon(icon: string | null | undefined): ParsedIcon {
  if (!icon || icon === '') return null;
  if (icon.startsWith('emoji:')) return { type: 'emoji', value: icon.slice(6) };
  if (icon.startsWith('lucide:')) return { type: 'lucide', value: icon.slice(8) };
  return null;
}

/**
 * Build icon string from type and value
 * @param type - 'emoji' or 'lucide'
 * @param value - emoji char or lucide icon name
 */
export function buildIcon(type: IconType, value: string): string {
  return `${type}:${value}`;
}

/**
 * Get display icon from database value
 * @param icon - Raw icon value from database
 * @param defaultIcon - Default icon to use if null
 */
export function getDisplayIcon(icon: string | null | undefined, defaultIcon: { type: IconType; value: string } = { type: 'lucide', value: 'building' }): { type: IconType; value: string } {
  const parsed = parseIcon(icon);
  return parsed ?? defaultIcon;
}

/**
 * Check if icon is valid
 */
export function isValidIcon(icon: string, type: IconType): boolean {
  if (type === 'emoji') return EMOJI_ICONS.includes(icon as typeof EMOJI_ICONS[number]);
  if (type === 'lucide') return LUCIDE_ICONS.includes(icon as typeof LUCIDE_ICONS[number]);
  return false;
}
