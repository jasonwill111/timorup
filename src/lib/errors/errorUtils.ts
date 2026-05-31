/**
 * Error utility functions for consistent error handling
 */
import { ErrorCode } from './errorCodes';
import type { AppError } from './AppError';

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Extract error message from any error type
 * Replaces multiple inline getErrorMessage functions across actions
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Get error code from any error type
 */
export function getErrorCode(error: unknown): string | null {
  // Check for AppError by name since we can't import due to circular dep
  if (error && (error as AppError).name === 'AppError') {
    return (error as AppError).code;
  }
  if (error instanceof Error && 'code' in error) {
    return String((error as unknown as { code: string }).code);
  }
  return null;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(code: ErrorCode | string, message: string): ErrorResponse {
  return {
    success: false,
    error: {
      code: typeof code === 'string' ? code : code,
      message,
    },
  };
}

/**
 * Wrap unknown error with fallback message
 */
export function wrapError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallbackMessage);
}