/**
 * Tests for error handling module
 */
import { describe, it, expect } from 'vitest';
import { ErrorCode } from './errorCodes';
import { AppError, isAppError } from './AppError';
import {
  getErrorMessage,
  createErrorResponse,
  getErrorCode,
} from './errorUtils';

describe('ErrorCode', () => {
  it('should have auth error codes', () => {
    expect(ErrorCode.AUTH_REQUIRED).toBe('AUTH_REQUIRED');
    expect(ErrorCode.AUTH_INVALID).toBe('AUTH_INVALID');
    expect(ErrorCode.AUTH_RATE_LIMITED).toBe('AUTH_RATE_LIMITED');
    expect(ErrorCode.AUTH_USER_EXISTS).toBe('AUTH_USER_EXISTS');
  });

  it('should have business error codes', () => {
    expect(ErrorCode.BUSINESS_NOT_FOUND).toBe('BUSINESS_NOT_FOUND');
    expect(ErrorCode.BUSINESS_FORBIDDEN).toBe('BUSINESS_FORBIDDEN');
    expect(ErrorCode.BUSINESS_LIMIT_REACHED).toBe('BUSINESS_LIMIT_REACHED');
  });

  it('should have validation error codes', () => {
    expect(ErrorCode.VALIDATION_INVALID_INPUT).toBe('VALIDATION_INVALID_INPUT');
    expect(ErrorCode.VALIDATION_JSON_ERROR).toBe('VALIDATION_JSON_ERROR');
  });

  it('should have server error codes', () => {
    expect(ErrorCode.SERVER_ERROR).toBe('SERVER_ERROR');
    expect(ErrorCode.SERVER_DB_ERROR).toBe('SERVER_DB_ERROR');
  });
});

describe('AppError', () => {
  it('should create error with code and message', () => {
    const error = new AppError(ErrorCode.AUTH_INVALID, 'Invalid credentials');

    expect(error.message).toBe('Invalid credentials');
    expect(error.code).toBe(ErrorCode.AUTH_INVALID);
    expect(error.name).toBe('AppError');
    expect(error.statusCode).toBe(401);
  });

  it('should map error code to HTTP status', () => {
    const authError = new AppError(ErrorCode.AUTH_REQUIRED, 'Auth required');
    expect(authError.statusCode).toBe(401);

    const notFoundError = new AppError(ErrorCode.BUSINESS_NOT_FOUND, 'Not found');
    expect(notFoundError.statusCode).toBe(404);

    const serverError = new AppError(ErrorCode.SERVER_ERROR, 'Server error');
    expect(serverError.statusCode).toBe(500);

    const rateLimitError = new AppError(ErrorCode.AUTH_RATE_LIMITED, 'Rate limited');
    expect(rateLimitError.statusCode).toBe(429);
  });

  it('should serialize to JSON', () => {
    const error = new AppError(ErrorCode.BUSINESS_NOT_FOUND, 'Business not found');
    const json = error.toJSON();

    expect(json).toEqual({
      success: false,
      error: {
        code: 'BUSINESS_NOT_FOUND',
        message: 'Business not found',
      },
    });
  });

  it('should be instance of Error', () => {
    const error = new AppError(ErrorCode.SERVER_ERROR, 'Server error');
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });
});

describe('isAppError', () => {
  it('should return true for AppError instance', () => {
    const error = new AppError(ErrorCode.SERVER_ERROR, 'Error');
    expect(isAppError(error)).toBe(true);
  });

  it('should return false for regular Error', () => {
    const error = new Error('Regular error');
    expect(isAppError(error)).toBe(false);
  });

  it('should return false for non-Error values', () => {
    expect(isAppError('string')).toBe(false);
    expect(isAppError(123)).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError({})).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('should extract message from Error', () => {
    const error = new Error('Test error message');
    expect(getErrorMessage(error)).toBe('Test error message');
  });

  it('should extract message from AppError', () => {
    const error = new AppError(ErrorCode.AUTH_INVALID, 'Invalid credentials');
    expect(getErrorMessage(error)).toBe('Invalid credentials');
  });

  it('should convert non-Error values to string', () => {
    expect(getErrorMessage('string error')).toBe('string error');
    expect(getErrorMessage(123)).toBe('123');
    expect(getErrorMessage(null)).toBe('null');
    expect(getErrorMessage(undefined)).toBe('undefined');
  });

  it('should handle objects', () => {
    const error = { message: 'Object error' };
    expect(getErrorMessage(error)).toBe('[object Object]');
  });
});

describe('getErrorCode', () => {
  it('should extract code from AppError', () => {
    const error = new AppError(ErrorCode.BUSINESS_NOT_FOUND, 'Not found');
    expect(getErrorCode(error)).toBe('BUSINESS_NOT_FOUND');
  });

  it('should extract code from error with code property', () => {
    const error = new Error('Test') as Error & { code: string };
    error.code = 'CUSTOM_CODE';
    expect(getErrorCode(error)).toBe('CUSTOM_CODE');
  });

  it('should return null for regular Error without code', () => {
    const error = new Error('Regular error');
    expect(getErrorCode(error)).toBeNull();
  });
});

describe('createErrorResponse', () => {
  it('should create standardized error response', () => {
    const response = createErrorResponse(
      ErrorCode.BUSINESS_NOT_FOUND,
      'Business not found'
    );

    expect(response).toEqual({
      success: false,
      error: {
        code: 'BUSINESS_NOT_FOUND',
        message: 'Business not found',
      },
    });
  });

  it('should work with string code', () => {
    const response = createErrorResponse('CUSTOM_CODE', 'Custom message');

    expect(response).toEqual({
      success: false,
      error: {
        code: 'CUSTOM_CODE',
        message: 'Custom message',
      },
    });
  });

  it('should be compatible with action error format', () => {
    const response = createErrorResponse(
      ErrorCode.AUTH_RATE_LIMITED,
      'Too many requests'
    );

    // Action handlers expect this exact format
    expect(response.success).toBe(false);
    expect(response.error.code).toBeTruthy();
    expect(response.error.message).toBeTruthy();
  });
});