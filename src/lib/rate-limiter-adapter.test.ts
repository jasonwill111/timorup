/**
 * Unit tests for rate limiter adapters
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryRateLimiterAdapter } from './in-memory-rate-limiter-adapter';
import { KVRateLimiterAdapter } from './kv-rate-limiter-adapter';
import { createRateLimiter } from './rate-limiter';

describe('InMemoryRateLimiterAdapter', () => {
  let adapter: InMemoryRateLimiterAdapter;

  beforeEach(() => {
    adapter = new InMemoryRateLimiterAdapter({
      windowMs: 60000,
      maxRequests: 5, // Small limit for testing
    });
  });

  it('allows requests under limit', async () => {
    const result = await adapter.check('test-user');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('blocks requests over limit', async () => {
    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      await adapter.check('test-user');
    }

    // 6th request should be blocked
    const result = await adapter.check('test-user');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('tracks different identifiers separately', async () => {
    await adapter.check('user-1');
    await adapter.check('user-1');
    await adapter.check('user-1');

    const result = await adapter.check('user-2');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4); // user-2 is fresh
  });

  it('resets limit after time window', async () => {
    const adapter2 = new InMemoryRateLimiterAdapter({
      windowMs: 1, // 1ms window
      maxRequests: 3,
    });

    // Exhaust limit
    for (let i = 0; i < 3; i++) {
      await adapter2.check('test-user');
    }
    expect((await adapter2.check('test-user')).allowed).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 10));

    // Should be allowed again
    const result = await adapter2.check('test-user');
    expect(result.allowed).toBe(true);
  });

  it('reset clears the identifier', async () => {
    // Exhaust limit
    for (let i = 0; i < 5; i++) {
      await adapter.check('test-user');
    }

    // Reset
    await adapter.reset('test-user');

    // Should be allowed again
    const result = await adapter.check('test-user');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('clear removes all records', async () => {
    await adapter.check('user-1');
    await adapter.check('user-2');

    adapter.clear();

    expect(adapter.getState('user-1')).toBeUndefined();
    expect(adapter.getState('user-2')).toBeUndefined();
  });
});

describe('KVRateLimiterAdapter', () => {
  let mockKV: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockKV = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
  });

  it('allows first request', async () => {
    mockKV.get.mockResolvedValue(null);

    const adapter = new KVRateLimiterAdapter(mockKV as unknown as KVNamespace);
    const result = await adapter.check('test-user');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(99);
  });

  it('increments existing record', async () => {
    const stored = JSON.stringify({ count: 50, resetTime: Date.now() + 60000 });
    mockKV.get.mockResolvedValue(stored);

    const adapter = new KVRateLimiterAdapter(mockKV as unknown as KVNamespace);
    const result = await adapter.check('test-user');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(49);
    expect(mockKV.put).toHaveBeenCalled();
  });

  it('blocks when limit exceeded', async () => {
    const stored = JSON.stringify({ count: 100, resetTime: Date.now() + 60000 });
    mockKV.get.mockResolvedValue(stored);

    const adapter = new KVRateLimiterAdapter(mockKV as unknown as KVNamespace);
    const result = await adapter.check('test-user');

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('reset deletes the key', async () => {
    mockKV.delete.mockResolvedValue(undefined);

    const adapter = new KVRateLimiterAdapter(mockKV as unknown as KVNamespace);
    await adapter.reset('test-user');

    expect(mockKV.delete).toHaveBeenCalledWith('ratelimit:test-user');
  });
});

describe('createRateLimiter', () => {
  it('returns KV adapter when SESSION is available', () => {
    const env = { SESSION: {} as KVNamespace };
    const adapter = createRateLimiter(env);

    expect(adapter).toBeInstanceOf(KVRateLimiterAdapter);
  });

  it('returns in-memory adapter when SESSION is not available', () => {
    const env = {};
    const adapter = createRateLimiter(env);

    expect(adapter).toBeInstanceOf(InMemoryRateLimiterAdapter);
  });
});