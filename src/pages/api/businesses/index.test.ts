/**
 * Integration tests for Business API endpoints
 *
 * Test plan:
 * TC-001: POST /api/businesses/create → 401 without auth
 * TC-002: POST /api/businesses/create → 401 with invalid session
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as createPOST } from './create';

// Build Drizzle query chain ending with .all() and .get()
// Note: .get() returns single item (or undefined), .all() returns array
function buildAllChain(result: unknown) {
  return {
    all: vi.fn(() => Promise.resolve(result)),
    get: vi.fn(() => Promise.resolve(Array.isArray(result) && result.length === 0 ? undefined : result)),
  };
}

// Build chain: where().limit().get()
function buildWhereLimitChain(result: unknown) {
  return {
    where: vi.fn(() => ({
      limit: vi.fn(() => buildAllChain(result)),
    })),
  };
}

// Mock db
const mockSelect = vi.hoisted(() => vi.fn(() => ({
  from: vi.fn(() => buildWhereLimitChain(undefined)),
})));

vi.mock('@/lib/db', () => ({
  db: {
    select: mockSelect,
    insert: vi.fn(),
  },
}));

vi.mock('@/db/schema', () => ({
  businessPages: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    ownerId: 'ownerId',
    status: 'status',
    entityType: 'entityType',
    likes: 'likes',
    saves: 'saves',
    views: 'views',
    ratingAverage: 'ratingAverage',
    categoryId: 'categoryId',
    aboutUs: 'aboutUs',
    tags: 'tags',
    createdAt: 'createdAt',
  },
  categories: {
    id: 'id',
    name: 'name',
    slug: 'slug',
  },
  users: { id: 'id', name: 'name' },
  sessions: { token: 'token', userId: 'userId', expiresAt: 'expiresAt' },
  accounts: {},
  verifications: {},
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function createRequest(body?: unknown, cookies?: string) {
  return {
    request: new Request('http://localhost', {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  };
}

describe('Business API - Create Auth (TC-001, TC-002)', () => {
  describe('TC-001: POST without auth returns 401', () => {
    it('returns 401 when no session cookie', async () => {
      const response = await createPOST(createRequest({ title: 'Test Business' }) as any);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('TC-002: POST with invalid session returns 401', () => {
    it('returns 401 when session not found', async () => {
      // Mock: session not found (empty array returns undefined via .get())
      mockSelect.mockImplementation(() => ({
        from: vi.fn(() => buildWhereLimitChain(undefined)),
      }));

      const response = await createPOST(createRequest(
        { title: 'Test Business' },
        'better-auth.session_token=invalid-token'
      ) as any);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
    });
  });
});
