/**
 * Select utility library for generating select HTML strings
 * Supports dark mode with bg-background class
 */

/**
 * Base classes for select elements
 */
export const selectBaseClass = 'h-9 px-3 rounded-md border bg-background text-sm';

/**
 * Extended classes for form selects (larger variant)
 */
export const selectFormClass = 'w-full px-3 py-2 border rounded-md text-sm bg-background';

/**
 * Option interface
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * Select attributes interface
 */
export interface SelectAttrs {
  id?: string;
  name?: string;
  class?: string;
  disabled?: boolean;
  required?: boolean;
  'data-slot'?: string;
  [key: string]: string | boolean | undefined;
}

/**
 * Generate select HTML string
 */
export function createSelectHtml(
  options: SelectOption[],
  attrs: SelectAttrs = {}
): string {
  const {
    id,
    name,
    class: extraClass = '',
    disabled = false,
    required = false,
    'data-slot': slot = 'select',
    ...rest
  } = attrs;

  const classes = [selectBaseClass, extraClass].filter(Boolean).join(' ');

  const optionsHtml = options
    .map((opt) => {
      const disabledAttr = opt.disabled ? ' disabled' : '';
      const selectedAttr = opt.selected ? ' selected' : '';
      return `<option value="${opt.value}"${disabledAttr}${selectedAttr}>${opt.label}</option>`;
    })
    .join('');

  const disabledAttr = disabled ? ' disabled' : '';
  const requiredAttr = required ? ' required' : '';
  const idAttr = id ? ` id="${id}"` : '';
  const nameAttr = name ? ` name="${name}"` : '';
  const slotAttr = ` data-slot="${slot}"`;
  const restAttrs = Object.entries(rest)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

  return `<select class="${classes}"${disabledAttr}${requiredAttr}${idAttr}${nameAttr}${slotAttr} ${restAttrs}>${optionsHtml}</select>`;
}

// ============ Preset Options ============

/**
 * Entity type options (Business / Non-Profit)
 */
export const ENTITY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'business', label: 'Business' },
  { value: 'nonprofit', label: 'Non-Profit' },
];

/**
 * Category level options
 */
export const CATEGORY_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'parent', label: 'Industries (Top-level)' },
  { value: 'child', label: 'Sub-categories' },
];

/**
 * Status options for listings
 */
export const LISTING_STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'rejected', label: 'Rejected' },
];

/**
 * Subscription status options
 */
export const SUBSCRIPTION_STATUS_OPTIONS: SelectOption[] = [
  { value: 'trial', label: 'Trial' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

/**
 * User role options
 */
export const USER_ROLE_OPTIONS: SelectOption[] = [
  { value: 'user', label: 'User' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

/**
 * Filter options for entity type (includes "All" option)
 */
export function createEntityTypeFilterOptions(): SelectOption[] {
  return [
    { value: '', label: 'All Types' },
    ...ENTITY_TYPE_OPTIONS,
  ];
}

/**
 * Filter options for category level (includes "All" option)
 */
export function createCategoryLevelFilterOptions(): SelectOption[] {
  return [
    { value: '', label: 'All Levels' },
    ...CATEGORY_LEVEL_OPTIONS,
  ];
}

/**
 * Create "All" wrapped options
 */
export function createAllFilterOptions(options: SelectOption[], allLabel = 'All'): SelectOption[] {
  return [
    { value: '', label: allLabel },
    ...options,
  ];
}

/**
 * Build parent category dropdown options from category data
 */
export function buildParentCategoryOptions(
  categories: Array<{ id: string; name: string; icon?: string | null }>,
  includeEmpty = true,
  emptyLabel = 'Top-level (Industry)'
): SelectOption[] {
  const opts: SelectOption[] = includeEmpty
    ? [{ value: '', label: emptyLabel }]
    : [];

  categories.forEach((cat) => {
    const iconPrefix = cat.icon ? cat.icon.replace('emoji:', '') + ' ' : '';
    opts.push({ value: cat.id, label: iconPrefix + cat.name });
  });

  return opts;
}
