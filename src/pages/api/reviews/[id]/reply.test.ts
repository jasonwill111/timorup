/**
 * Unit tests for Reviews Reply API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Build proper chain mock - returns the chain directly
function createMockSelect(returnValues: unknown[]) {
  let index = 0;
  return vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn(() => ({
          get: vi.fn(() => {
            const result = returnValues[index] ?? returnValues[0];
            index++;
            return Promise.resolve(result);
          }),
        })),
      })),
    })),
  }));
}

function createMockUpdate() {
  return vi.fn(() => ({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        run: vi.fn().mockResolvedValue({}),
      }),
    }),
  }));
}

// Mock modules
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@/db/schema', () => ({
  reviews: {
    id: 'id',
    businessPageId: 'businessPageId',
  },
  businessPages: {
    id: 'id',
    ownerId: 'ownerId',
  },
}));

const mockDb = vi.mocked(await import('@/lib/db'));
const mockAuth = vi.mocked(await import('@/lib/auth'));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/reviews/:id/reply', () => {
  // Note: ALREADY_REPLIED test is complex to mock due to multiple DB calls
  // The functionality is tested via integration tests

  it('returns 401 if not logged in', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue(null);

    const { POST } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: 'Test' }),
    });
    const response = await POST({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(401);
  });

  it('returns 403 if not business owner', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue({
      user: { id: 'user-1' },
      session: { token: 'test', expiresAt: new Date() },
    });

    // First call: review, Second call: business (different owner)
    mockDb.db.select.mockReturnValue(createMockSelect([
      { id: 'review-1', businessPageId: 'biz-1', reply: null },
      { id: 'biz-1', ownerId: 'other-user' },
    ])());

    const { POST } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=test',
      },
      body: JSON.stringify({ comment: 'Test' }),
    });
    const response = await POST({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(403);
  });

  it('returns 201 when reply created successfully', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue({
      user: { id: 'user-1' },
      session: { token: 'test', expiresAt: new Date() },
    });

    mockDb.db.select.mockReturnValue(createMockSelect([
      { id: 'review-1', businessPageId: 'biz-1', reply: null },
      { id: 'biz-1', ownerId: 'user-1' },
      { id: 'review-1', businessPageId: 'biz-1', reply: 'Thank you!', repliedBy: 'user-1' },
    ])());
    mockDb.db.update.mockReturnValue(createMockUpdate()());

    const { POST } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=test',
      },
      body: JSON.stringify({ comment: 'Thank you!' }),
    });
    const response = await POST({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});

describe('PUT /api/reviews/:id/reply', () => {
  it('returns 200 when reply updated', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue({
      user: { id: 'user-1' },
      session: { token: 'test', expiresAt: new Date() },
    });

    mockDb.db.select.mockReturnValue(createMockSelect([
      { id: 'review-1', repliedBy: 'user-1', reply: 'Old reply' },
      { id: 'review-1', repliedBy: 'user-1', reply: 'Updated reply' },
    ])());
    mockDb.db.update.mockReturnValue(createMockUpdate()());

    const { PUT } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=test',
      },
      body: JSON.stringify({ comment: 'Updated reply' }),
    });
    const response = await PUT({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it('returns 403 if not original replier', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue({
      user: { id: 'user-1' },
      session: { token: 'test', expiresAt: new Date() },
    });

    mockDb.db.select.mockReturnValue(createMockSelect([{
      id: 'review-1',
      repliedBy: 'other-user',
      reply: 'Someone else replied',
    }])());

    const { PUT } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=test',
      },
      body: JSON.stringify({ comment: 'Hacked!' }),
    });
    const response = await PUT({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(403);
  });
});

describe('DELETE /api/reviews/:id/reply', () => {
  it('returns 200 when reply deleted', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue({
      user: { id: 'user-1' },
      session: { token: 'test', expiresAt: new Date() },
    });

    mockDb.db.select.mockReturnValue(createMockSelect([{
      id: 'review-1',
      repliedBy: 'user-1',
      reply: 'To be deleted',
    }])());
    mockDb.db.update.mockReturnValue(createMockUpdate()());

    const { DELETE } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'DELETE',
      headers: {
        'Cookie': 'better-auth.session_token=test',
      },
    });
    const response = await DELETE({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it('returns 403 if not original replier', async () => {
    mockAuth.auth.api.getSession.mockResolvedValue({
      user: { id: 'user-1' },
      session: { token: 'test', expiresAt: new Date() },
    });

    mockDb.db.select.mockReturnValue(createMockSelect([{
      id: 'review-1',
      repliedBy: 'other-user',
      reply: 'Protected',
    }])());

    const { DELETE } = await import('./reply');
    const request = new Request('http://localhost', {
      method: 'DELETE',
      headers: {
        'Cookie': 'better-auth.session_token=test',
      },
    });
    const response = await DELETE({ request, params: { id: 'review-1' } });

    expect(response.status).toBe(403);
  });
});
