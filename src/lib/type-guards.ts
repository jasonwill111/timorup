/**
 * Type Guard Utilities
 * Safe type guards for common type assertions
 */

/**
 * Check if value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Check if env object is valid
 */
export function isValidEnv(env: unknown): env is Record<string, unknown> {
  return isObject(env) && Object.keys(env).length > 0;
}

/**
 * Safe get workers env with type guard
 */
export async function getWorkersEnv(): Promise<Record<string, unknown>> {
  try {
    const { env } = await import('cloudflare:workers');
    if (isValidEnv(env)) {
      return env;
    }
  } catch {
    // Fallback for non-Workers environment
  }
  const fallback = (globalThis as unknown as { env?: Record<string, unknown> }).env;
  if (isValidEnv(fallback)) {
    return fallback;
  }
  return {};
}

/**
 * Check if API response has expected shape
 */
export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

/**
 * Validate and cast with type guard
 */
export function castToType<T>(
  value: unknown,
  guard: (v: unknown) => v is T
): T | undefined {
  return guard(value) ? value : undefined;
}
