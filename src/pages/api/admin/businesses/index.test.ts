/**
 * Integration tests for Admin Business API endpoints
 *
 * Test plan:
 * TC-001: GET /api/admin/businesses → returns paginated list
 * TC-002: GET /api/admin/businesses?status=draft → filters by status
 * TC-003: GET /api/admin/businesses?search=cafe → filters by search
 * TC-004: POST /api/admin/businesses → creates business with admin auth
 * TC-005: POST /api/admin/businesses → 400 without title/slug
 * TC-006: POST /api/admin/businesses → 400 for duplicate slug
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as listGET, POST as createPOST } from './index';

// Build Drizzle query chain ending with .all() and .get()
// Note: .get() returns single item (or undefined), .all() returns array
function buildAllChain(result: unknown) {
  return {
    all: vi.fn(() => Promise.resolve(result)),
    get: vi.fn(() => Promise.resolve(Array.isArray(result) && result.length === 0 ? undefined : result)),
  };
}

// Build chain: where().orderBy().limit().offset().all() (for list queries)
function buildWhereChain(result: unknown) {
  return {
    where: vi.fn(() => ({
      orderBy: vi.fn(() => ({
        limit: vi.fn(() => ({
          offset: vi.fn(() => buildAllChain(result)),
        })),
      })),
    })),
  };
}

// Build chain: where().limit().get() (for check queries)
function buildWhereLimitChain(result: unknown) {
  return {
    where: vi.fn(() => ({
      limit: vi.fn(() => buildAllChain(result)),
    })),
  };
}

// Build chain: limit().get() (for user lookup)
function buildLimitChain(result: unknown) {
  return {
    limit: vi.fn(() => buildAllChain(result)),
  };
}

// Mock db
const mockSelect = vi.hoisted(() => vi.fn(() => ({
  from: vi.fn(() => buildWhereChain([])),
})));

const mockInsert = vi.hoisted(() => vi.fn(() => ({
  values: vi.fn(() => Promise.resolve()),
})));

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(() => Promise.resolve({
        user: { id: 'admin-1', role: 'admin', email: 'admin@test.com' }
      })),
    },
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
  },
}));

vi.mock('@/db/schema', () => ({
  businessPages: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    ownerId: 'ownerId',
    status: 'status',
    email: 'email',
    createdAt: 'createdAt',
    latestUpdates: 'latestUpdates',
    contactNumber: 'contactNumber',
    aboutUs: 'aboutUs',
  },
  categories: { id: 'id', name: 'name' },
  users: { id: 'id', name: 'name' },
  sessions: {},
  accounts: {},
  verifications: {},
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function createMockUrlSearch(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/admin/businesses');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url;
}

// Create GET request with admin auth cookie
function createAdminUrlRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/admin/businesses');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  const request = new Request(url, {
    method: 'GET',
    headers: { 'Cookie': 'better-auth.session_token=valid-admin-token' },
  });
  return { url, request };
}

function createRequest(body?: unknown) {
  return {
    request: new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }),
  };
}

// Create request with admin auth cookie
function createAdminRequest(body?: unknown) {
  return {
    request: new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=valid-admin-token',
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  };
}

describe('Admin Business API - List (TC-001, TC-002, TC-003)', () => {
  const mockBusinesses = [
    { id: 'biz-1', title: 'Cafe Timor', slug: 'cafe-timor', status: 'live', email: 'cafe@example.com' },
    { id: 'biz-2', title: 'Dili Hotel', slug: 'dili-hotel', status: 'draft', email: 'hotel@example.com' },
  ];

  describe('TC-001: GET returns paginated businesses', () => {
    it('returns 200 with businesses array', async () => {
      let callCount = 0;
      mockSelect.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn(() => ({
              leftJoin: vi.fn(() => ({
                leftJoin: vi.fn(() => buildWhereChain(mockBusinesses)),
              })),
            })),
          };
        }
        return {
          from: vi.fn(() => ({
            where: vi.fn(() => buildAllChain({ count: 2 })),
          })),
        };
      });

      const { url, request } = createAdminUrlRequest();
      const response = await listGET({ url, request });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('total');
    });
  });

  describe('TC-002: GET with status filter', () => {
    it('returns filtered businesses by status', async () => {
      let callCount = 0;
      mockSelect.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn(() => ({
              leftJoin: vi.fn(() => ({
                leftJoin: vi.fn(() => buildWhereChain([mockBusinesses[1]])),
              })),
            })),
          };
        }
        return {
          from: vi.fn(() => ({
            where: vi.fn(() => buildAllChain({ count: 1 })),
          })),
        };
      });

      const { url, request } = createAdminUrlRequest({ status: 'draft' });
      const response = await listGET({ url, request });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  describe('TC-003: GET with search filter', () => {
    it('returns filtered businesses by search term', async () => {
      let callCount = 0;
      mockSelect.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn(() => ({
              leftJoin: vi.fn(() => ({
                leftJoin: vi.fn(() => buildWhereChain([mockBusinesses[0]])),
              })),
            })),
          };
        }
        return {
          from: vi.fn(() => ({
            where: vi.fn(() => buildAllChain({ count: 1 })),
          })),
        };
      });

      const { url, request } = createAdminUrlRequest({ search: 'cafe' });
      const response = await listGET({ url, request });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });
});

describe('Admin Business API - Create (TC-004, TC-005, TC-006)', () => {
  describe('TC-004: POST creates business', () => {
    it('returns 201 with created business data', async () => {
      // Track call count for multiple select calls
      let callCount = 0;
      mockSelect.mockImplementation((schema) => {
        callCount++;
        // First call: slug check on businessPages
        // Second call: user lookup
        if (callCount === 1) {
          return {
            from: vi.fn(() => buildWhereLimitChain([])), // Empty = no existing slug
          };
        }
        // Second call: user lookup - from(users).limit(1).get()
        return {
          from: vi.fn(() => buildLimitChain([{ id: 'user-1' }])),
        };
      });

      mockInsert.mockImplementation(() => ({
        values: vi.fn(() => ({
          run: vi.fn(() => Promise.resolve()),
        })),
      }));

      const response = await createPOST(createAdminRequest({
        title: 'New Business',
        slug: 'new-business',
        email: 'new@example.com',
      }) as any);

      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('title');
      expect(body.data).toHaveProperty('slug');
    });
  });

  describe('TC-005: POST without required fields returns 400', () => {
    it('returns 400 when title is missing', async () => {
      const response = await createPOST(createAdminRequest({
        slug: 'test-slug',
      }) as any);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    it('returns 400 when slug is missing', async () => {
      const response = await createPOST(createAdminRequest({
        title: 'Test Title',
      }) as any);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
    });
  });

  describe('TC-006: POST with duplicate slug returns 400', () => {
    it('returns 400 when slug already exists', async () => {
      // Mock: slug exists
      mockSelect.mockImplementation(() => ({
        from: vi.fn(() => buildWhereLimitChain([{ id: 'existing-biz' }])),
      }));

      const response = await createPOST(createAdminRequest({
        title: 'Another Business',
        slug: 'existing-slug',
      }) as any);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('Slug already exists');
    });
  });
});
