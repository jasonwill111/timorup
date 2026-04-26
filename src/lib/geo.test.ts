/**
 * Unit tests for src/lib/geo.ts — Nominatim geocoding utility (T-006)
 *
 * Test plan:
 * TC-001: Nominatim returns valid result → resolves to { lat, lng }
 * TC-002: Nominatim returns empty array → resolves to null
 * TC-003: Two rapid calls (within 500ms) → second call waits full 1100ms debounce
 * TC-004: Network error → resolves to null
 * TC-005: Query includes "Timor-Leste" suffix
 * TC-006: Request includes User-Agent: TIMORLIST/1.0 header
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { geocodeAddress, __resetGeoState } from './geo';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
  vi.restoreAllMocks();
  __resetGeoState();
});

describe('TC-001: Nominatim returns valid result', () => {
  it('resolves to { lat, lng } when Nominatim returns a result', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ lat: '-8.5569', lon: '125.5603' }],
    });

    const result = await geocodeAddress('Dili, Timor-Leste');

    expect(result).toEqual({ lat: -8.5569, lng: 125.5603 });
  });
});

describe('TC-002: Nominatim returns empty array', () => {
  it('resolves to null when Nominatim returns []', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await geocodeAddress('NonExistentPlaceXYZ999');

    expect(result).toBeNull();
  });
});

describe('TC-003: Debounce blocks rapid calls', () => {
  // Use fake timers locally for this test only
  it('second call fired within 500ms waits at least 1100ms before network request', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    // Also control Date.now() — Vitest fake timers don't mock it in Node
    let fakeTime = 0;
    const dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => fakeTime);

    try {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ lat: '-8.5', lon: '125.5' }],
      });

      // Fire first call — sets lastCallTime = fakeTime (= 0)
      const p1 = geocodeAddress('Dili');
      // Advance fake time slightly so second call's elapsed < DEBOUNCE_MS
      fakeTime = 500;
      // Fire second call immediately — will need to wait 1100ms
      const p2 = geocodeAddress('Dili');

      // At t=500ms: first fetch has fired (elapsed was 0), second is waiting
      // Advance by 1000ms (fakeTime goes from 500 to 1500) — still within debounce
      await vi.advanceTimersByTimeAsync(1000);
      fakeTime += 1000; // Date.now() now returns 1500
      // Only first fetch should have fired (second is still waiting on its setTimeout)
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Advance to 1100ms from lastCallTime (fakeTime = 1600 total) — debounce satisfied
      await vi.advanceTimersByTimeAsync(100);
      fakeTime += 100; // Date.now() now returns 1600
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Advance remaining pending timers (the json() async calls in mock)
      await vi.advanceTimersByTimeAsync(0);

      const [r1, r2] = await Promise.all([p1, p2]);
      expect(r1).toBeTruthy();
      expect(r2).toBeTruthy();
    } finally {
      dateNowSpy.mockRestore();
      vi.useRealTimers();
    }
  });
});

describe('TC-004: Network error', () => {
  it('resolves to null when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await geocodeAddress('Dili');

    expect(result).toBeNull();
  });
});

describe('TC-005: Query includes Timor-Leste suffix', () => {
  it('appends ", Timor-Leste" to the address in the query string', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ lat: '-8.5', lon: '125.5' }],
    });

    await geocodeAddress('Aileu');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    // encodeURIComponent converts space to %20, comma to %2C
    expect(calledUrl).toContain('q=Aileu%2C%20Timor-Leste');
  });
});

describe('TC-006: User-Agent header', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('includes User-Agent: TIMORLIST/1.0 in the request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ lat: '-8.5', lon: '125.5' }],
    });

    await geocodeAddress('Dili');

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Record<string, string>;
    expect(headers['User-Agent']).toBe('TIMORLIST/1.0');
  });
});
