/**
 * Result/Either type pattern for error handling
 * Provides consistent error handling across all query functions
 */

/**
 * Union type for success/error states
 * @template T - Success data type
 * @template E - Error type (defaults to Error)
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Create a successful Result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Create an error Result
 */
export function error<T = never, E = Error>(error: E): Result<T, E> {
  return { success: false, error };
}

/**
 * Type guard for success
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard for error
 */
export function isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Unwrap Result, throwing if error
 */
export function unwrap<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}

/**
 * Unwrap with default value
 */
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  return result.success ? result.data : defaultValue;
}