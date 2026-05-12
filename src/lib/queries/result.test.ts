/**
 * Result type tests
 */
import { describe, it, expect } from 'vitest';
import { success, error, isSuccess, isError, unwrap, unwrapOr } from './result';

describe('Result', () => {
  describe('success', () => {
    it('creates success result with data', () => {
      const result = success({ id: '1', name: 'Test' });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: '1', name: 'Test' });
    });

    it('has never error type on success', () => {
      const result = success('hello');
      if (result.success) {
        // Type check: result.error should never be accessed on success
        // Just verify data is accessible
        expect(result.data).toBe('hello');
      }
    });
  });

  describe('error', () => {
    it('creates error result with error message', () => {
      const result = error(new Error('Not found'));
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Not found');
    });

    it('handles string errors', () => {
      const result = error<string, string>('Something went wrong');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Something went wrong');
    });
  });

  describe('isSuccess', () => {
    it('returns true for success result', () => {
      const result = success(42);
      expect(isSuccess(result)).toBe(true);
    });

    it('returns false for error result', () => {
      const result = error(new Error('fail'));
      expect(isSuccess(result)).toBe(false);
    });
  });

  describe('isError', () => {
    it('returns true for error result', () => {
      const result = error(new Error('fail'));
      expect(isError(result)).toBe(true);
    });

    it('returns false for success result', () => {
      const result = success(42);
      expect(isError(result)).toBe(false);
    });
  });

  describe('unwrap', () => {
    it('returns data on success', () => {
      const result = success({ key: 'value' });
      expect(unwrap(result)).toEqual({ key: 'value' });
    });

    it('throws error on error result', () => {
      const err = new Error('Test error');
      const result = error(err);
      expect(() => unwrap(result)).toThrow(err);
    });
  });

  describe('unwrapOr', () => {
    it('returns data on success', () => {
      const result = success('actual');
      expect(unwrapOr(result, 'default')).toBe('actual');
    });

    it('returns default on error', () => {
      const result = error(new Error('fail'));
      expect(unwrapOr(result, 'default')).toBe('default');
    });
  });
});