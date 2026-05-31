/**
 * Application Error class with standardized error codes
 */
import { ErrorCode, ErrorCodeToStatus } from './errorCodes';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = ErrorCodeToStatus[code] ?? 500;

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

/**
 * Check if error is an AppError instance
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}