/**
 * Unit tests for GET /api/settings/public endpoint (T-002)
 *
 * Test plan:
 * TC-001: Given payment_qr key exists with valid URL → response 200 + { payment_qr: "https://..." }
 * TC-002: Given payment_qr key does not exist → response 200 + { payment_qr: null }
 * TC-003: Given DB throws error → response 500 + { success: false, error: {...} }
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './index';

// Use vi.hoisted so mock is available when vi.mock factory runs
const mockSelect = vi.hoisted(() =>
  vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve([])) })),
    })),
  }))
);

const mockDb = vi.hoisted(() => ({ select: mockSelect }));

vi.mock('@/lib/db', () => ({ db: mockDb }));

vi.mock('@/db/schema', () => ({
  siteSettings: { key: 'key', value: 'value' },
}));

beforeEach(() => {
  // Reset mock and set a default valid chain
  mockSelect.mockReset();
  mockSelect.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve([])) })),
    })),
  }));
});

function buildMockChain(result: unknown[]) {
  mockSelect.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve(result)) })),
    })),
  }));
}

function buildMockError(err: Error) {
  mockSelect.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.reject(err)) })),
    })),
  }));
}

describe('TC-001: payment_qr key exists', () => {
  it('returns 200 with payment_qr URL when key exists', async () => {
    buildMockChain([{ key: 'payment_qr', value: 'https://r2.example.com/qr.png' }]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.payment_qr).toBe('https://r2.example.com/qr.png');
  });
});

describe('TC-002: payment_qr key missing', () => {
  it('returns 200 with null payment_qr when key does not exist', async () => {
    buildMockChain([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.payment_qr).toBeNull();
  });
});

describe('TC-003: DB throws error', () => {
  it('returns 500 with error when DB throws', async () => {
    buildMockError(new Error('DB connection failed'));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
  });
});
