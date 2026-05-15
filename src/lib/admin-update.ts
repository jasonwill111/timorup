/**
 * Admin Update Utilities
 * DRY field mapping for admin actions
 */

export type FieldTransform =
  | 'direct'        // Pass through as-is
  | 'json'          // JSON.stringify
  | 'emptyToNull'   // Empty string → null
  | 'date';         // Convert to Date

export type UpdateConfig<T> = {
  [K in keyof T]?: FieldTransform;
};

/**
 * Build update data object from input, applying transforms.
 *
 * @param data - The input data object
 * @param config - Transform configuration per field
 * @returns Record ready for db.update().set()
 *
 * @example
 * const updateData = buildUpdateData(data, {
 *   tags: 'json',
 *   email: 'emptyToNull',
 *   expiryDate: 'date',
 * });
 */
export function buildUpdateData<T extends Record<string, unknown>>(
  data: T,
  config: UpdateConfig<T>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;

    const transform = config[key as keyof T] || 'direct';

    switch (transform) {
      case 'direct':
        result[key] = value;
        break;
      case 'json':
        result[key] = value !== null ? JSON.stringify(value) : null;
        break;
      case 'emptyToNull':
        result[key] = value === '' ? null : value;
        break;
      case 'date':
        result[key] = value ? new Date(value as number) : null;
        break;
    }
  }

  return result;
}

/**
 * Common field configs reused across admin actions.
 */
export const FIELD_CONFIGS = {
  /** Fields that should be JSON.stringified */
  json: ['tags', 'openingHours', 'socialLinks'] as const,

  /** Fields that should convert empty string to null */
  emptyToNull: ['email', 'registrationUrl'] as const,

  /** Fields that should be converted to Date */
  date: ['expiryDate'] as const,
} as const;

/**
 * Create update config from array of field names with transform type.
 *
 * @example
 * const config = createConfig({
 *   tags: 'json',
 *   email: 'emptyToNull',
 *   name: 'direct', // default
 * });
 */
export function createConfig<T extends Record<string, unknown>>(
  transforms: Partial<Record<keyof T, FieldTransform>>
): UpdateConfig<T> {
  return transforms as UpdateConfig<T>;
}