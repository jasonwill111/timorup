/**
 * Type Utilities for Cloudflare Workers + Astro SSR
 * Provides safe type assertions and guards for strict mode
 */

/**
 * Assert value is non-null/undefined
 * Throws if value is null or undefined
 */
export function assertNonNull<T>(
  val: T | null | undefined,
  message = 'Value is null or undefined'
): asserts val is T {
  if (val == null) {
    throw new Error(message);
  }
}

/**
 * Assert value is non-null after condition check
 * Use in if blocks where TypeScript can't infer nullability
 */
export function requireNonNull<T>(
  val: T | null | undefined,
  message = 'Required value is null'
): T {
  if (val == null) {
    throw new Error(message);
  }
  return val;
}

/**
 * Safe unwrap with default value
 */
export function unwrapOr<T>(
  val: T | null | undefined,
  defaultVal: T
): T {
  return val ?? defaultVal;
}

/**
 * Assert array is non-empty (for TS noUncheckedIndexedAccess)
 */
export function assertNonEmpty<T>(
  arr: T[],
  message = 'Array is empty'
): T[] {
  if (arr.length === 0) {
    throw new Error(message);
  }
  return arr;
}

/**
 * Get array element with bounds check
 */
export function getArrayElement<T>(
  arr: T[],
  index: number,
  defaultVal: T
): T {
  if (index < 0 || index >= arr.length) {
    return defaultVal;
  }
  return arr[index];
}

/**
 * Type-safe object property access
 */
export function getProp<T, K extends keyof T>(
  obj: T,
  key: K
): NonNullable<T[K]> {
  const val = obj[key];
  if (val == null) {
    throw new Error(`Property ${String(key)} is null or undefined`);
  }
  return val;
}

/**
 * Merge types, making optional fields required
 */
export type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Convert possibly undefined to Result
 */
export function toResult<T>(
  val: T | null | undefined,
  errorMessage = 'Value is null'
): Result<T> {
  if (val == null) {
    return { success: false, error: new Error(errorMessage) };
  }
  return { success: true, data: val };
}

/**
 * Assert environment variable is set
 */
export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return val;
}