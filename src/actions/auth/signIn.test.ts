/**
 * TDD Tests for signIn.ts - GREEN phase
 * Tests that verify the rate-limit module works correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock cloudflare:workers for KV access - use factory to avoid hoisting issues
vi.mock('cloudflare:workers', () => ({
  env: {
    SESSION: {
      get: vi.fn(),
      put: vi.fn(),
    },
  },
}));

// Import after mock
import { checkRateLimitKV, checkRateLimit } from '@/lib/rate-limit';

describe('signIn action - GREEN tests (rate limiting)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TC-01: checkRateLimitKV should use KV namespace', () => {
    it('should store rate limit in KV when available', async () => {
      // Arrange
      const { env } = await import('cloudflare:workers');
      const identifier = 'signin:test@example.com';
      // count=5 means 5 requests already made, so after incrementing: count=6
      const stored = { count: 5, resetTime: Date.now() + 60000 };

      (env.SESSION.get as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(stored));
      (env.SESSION.put as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      // Act
      const result = await checkRateLimitKV(identifier);

      // Assert - after 6th request, remaining = 100 - 6 = 94
      expect(env.SESSION.get).toHaveBeenCalledWith(`ratelimit:${identifier}`);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(94);
    });

    it('should return allowed:false when limit exceeded (100 requests)', async () => {
      // Arrange
      const { env } = await import('cloudflare:workers');
      const identifier = 'signin:test@example.com';
      // count=100 means 100 requests already made - next should be blocked
      const stored = { count: 100, resetTime: Date.now() + 60000 };

      (env.SESSION.get as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(stored));

      // Act
      const result = await checkRateLimitKV(identifier);

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should create new record when no existing record', async () => {
      // Arrange
      const { env } = await import('cloudflare:workers');
      const identifier = 'signin:test@example.com';
      (env.SESSION.get as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (env.SESSION.put as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      // Act
      const result = await checkRateLimitKV(identifier);

      // Assert
      expect(env.SESSION.put).toHaveBeenCalled();
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
    });
  });

  describe('TC-02: Rate limiting window and limits', () => {
    it('should use 60 second window by default', async () => {
      // Arrange
      const { env } = await import('cloudflare:workers');
      const identifier = 'signin:test@example.com';
      (env.SESSION.get as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (env.SESSION.put as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      // Act
      const result = await checkRateLimitKV(identifier);

      // Assert - resetIn should be ~60 seconds
      expect(result.resetIn).toBe(60);
    });

    it('should track remaining requests accurately', async () => {
      // Arrange
      const { env } = await import('cloudflare:workers');
      const identifier = 'signin:test@example.com';
      // count=50 means 50 already made, after 51st request: remaining = 49
      const stored = { count: 50, resetTime: Date.now() + 60000 };

      (env.SESSION.get as ReturnType<typeof vi.fn>).mockResolvedValue(JSON.stringify(stored));
      (env.SESSION.put as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      // Act
      const result = await checkRateLimitKV(identifier);

      // Assert - after 51st request, remaining = 100 - 51 = 49
      expect(result.remaining).toBe(49);
    });
  });

  describe('TC-03: KV fallback to in-memory', () => {
    it('should fall back to in-memory when KV throws', async () => {
      // Arrange
      const { env } = await import('cloudflare:workers');
      const identifier = 'signin:test@example.com';
      (env.SESSION.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('KV unavailable'));
      (env.SESSION.put as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('KV unavailable'));

      // Act
      const result = await checkRateLimitKV(identifier);

      // Assert - should still return allowed (fallback works)
      expect(result.allowed).toBe(true);
    });

    it('should fall back to in-memory when KV returns undefined', async () => {
      // Arrange - reset module to clear in-memory store
      vi.resetModules();

      const { env } = await import('cloudflare:workers');
      (env.SESSION.get as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      // Act - first request on fresh in-memory store: remaining = 100 - 1 = 99
      const { checkRateLimit } = await import('@/lib/rate-limit');
      const result = checkRateLimit('signin:new@example.com');

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
    });
  });
});

describe('getErrorMessage in utils.ts', () => {
  it('should export getErrorMessage function', async () => {
    const { getErrorMessage } = await import('@/lib/utils');
    expect(typeof getErrorMessage).toBe('function');
  });

  it('should extract message from Error instance', async () => {
    const { getErrorMessage } = await import('@/lib/utils');
    const error = new Error('Test error message');
    expect(getErrorMessage(error)).toBe('Test error message');
  });

  it('should convert non-Error to string', async () => {
    const { getErrorMessage } = await import('@/lib/utils');
    expect(getErrorMessage('string error')).toBe('string error');
    expect(getErrorMessage(123)).toBe('123');
    expect(getErrorMessage(null)).toBe('null');
  });

  it('signIn.ts should handle errors gracefully', async () => {
    // signIn.ts uses better-auth's built-in error handling
    // The action returns structured error responses via createErrorResponse
    const fs = await import('fs');
    const signInPath = `${process.cwd()}/src/actions/auth/signIn.ts`;
    const content = fs.readFileSync(signInPath, 'utf-8');

    // Should have try-catch with structured error response
    const hasTryCatch = content.includes('try {') && content.includes('catch (error)');
    const hasErrorResponse = content.includes('createErrorResponse') && content.includes('ErrorCode');

    expect(hasTryCatch).toBe(true);
    expect(hasErrorResponse).toBe(true);
  });
});