// Vitest Setup - Global Mocks for Cloudflare Workers Testing
import { vi, type Mock, beforeAll, afterAll } from 'vitest';

// ==================== ASTRO ACTIONS MOCK ====================

// Mock astro:actions - critical for action testing
// Uses dynamic mock factory to avoid hoisting issues
vi.mock('astro:actions', () => {
  // Simple mock that just returns a wrapper around the handler
  return {
    defineAction: vi.fn((config: { input?: unknown; accept?: string; handler: Function }) => {
      const handler = config.handler;
      const schema = config.input;

      // Return a mock action that validates input then calls handler
      return {
        input: config.input,
        accept: config.accept,
        handler: async (input: unknown, context: { request?: Request } = {}) => {
          // Validate input with Zod if schema exists
          if (schema && typeof schema.safeParse === 'function') {
            const result = schema.safeParse(input);
            if (!result.success) {
              // Zod v4 uses .issues, not .errors
              const issues = result.error.issues || result.error.errors || [];
              const firstIssue = issues[0];
              const message = firstIssue?.message || firstIssue?.path?.join('.') || 'Validation failed';
              return {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: message,
                },
              };
            }
          }
          return handler(input, context);
        },
        _rawHandler: handler,
      };
    }),
  };
});

// ==================== IMPORT.META ENV MOCK ====================

// Mock import.meta.env for SSR code
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      NODE_ENV: 'test',
      TEST_MODE: 'true',
      SITE_URL: 'http://localhost:8787',
      APP_URL: 'http://localhost:8787',
    },
  },
  writable: true,
  configurable: true,
});

// ==================== CLOUDFLARE WORKERS MOCK ====================

// Mock cloudflare:workers module
vi.mock('cloudflare:workers', () => ({
  env: {
    DB: createMockD1Database(),
    SESSION: createMockKVNamespace(),
  },
}));

// ==================== MOCK FACTORIES ====================

function createMockD1Database() {
  const data: Record<string, Record<string, unknown>[]> = {};
  const mockD1Db = {
    prepare: vi.fn((query: string) => ({
      bind: vi.fn().mockReturnThis(),
      run: vi.fn(async () => ({ success: true, results: [], meta: { changes: 0 } })),
      first: vi.fn(async () => null),
      all: vi.fn(async () => ({ success: true, results: [], meta: {} })),
      iterate: vi.fn(() => ({
        [Symbol.asyncIterator]: async function* () {}()
      })),
    })),
    exec: vi.fn(async () => [{ success: true }]),
    dump: vi.fn(async () => null),
    batch: vi.fn(async (stmts) => stmts.map(() => ({ success: true }))),
    prepared: vi.fn(),
  };
  return mockD1Db;
}

function createMockKVNamespace() {
  const store = new Map<string, string>();
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => { store.set(key, value); }),
    delete: vi.fn(async (key: string) => store.delete(key)),
    list: vi.fn(async (opts?: { prefix?: string; limit?: number; cursor?: string }) => {
      const keys = [...store.keys()];
      return { keys: keys.map(k => ({ name: k })), list_complete: true, cursor: '' };
    }),
  };
}

// ==================== ZOD MOCK ====================

vi.mock('zod', async () => {
  const actual = await vi.importActual('zod');
  return {
    ...actual as Record<string, unknown>,
    // Zod is used as-is, no mocking needed
  };
});

// ==================== DRIZZLE MOCK ====================

vi.mock('drizzle-orm/d1', () => ({
  drizzle: vi.fn((db: unknown, _opts?: unknown) => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve([])),
        orderBy: vi.fn(() => Promise.resolve([])),
        limit: vi.fn(() => ({
          get: vi.fn(() => Promise.resolve(null)),
          all: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 'mock-id' }])),
        run: vi.fn(() => Promise.resolve({ success: true })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([])),
          run: vi.fn(() => Promise.resolve({ success: true })),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([])),
        run: vi.fn(() => Promise.resolve({ success: true })),
      })),
    })),
  })),
}));

// ==================== DATABASE MOCK ====================

vi.mock('@/lib/db', () => ({
  getDb: vi.fn(async () => null),
  initDb: vi.fn(() => null),
}));

// ==================== BETTER-AUTH MOCK ====================

vi.mock('@/lib/auth', () => ({
  initAuth: vi.fn(async () => ({
    api: {
      getSession: vi.fn(async () => null),
      signIn: vi.fn(async () => ({ user: null, session: null })),
      signOut: vi.fn(async () => ({ success: true })),
      listSessions: vi.fn(async () => []),
      signUpEmail: vi.fn(async () => ({ user: { id: 'test-id', email: 'test@test.com' } })),
    },
    auth: {
      api: {
        getSession: vi.fn(async () => null),
      },
    },
  })),
  initAuthInstance: vi.fn(() => null),
  createAuthInstance: vi.fn(() => null),
}));

// ==================== RATE LIMIT MOCK ====================

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual('@/lib/rate-limit');
  return {
    ...actual as Record<string, unknown>,
    // Only mock helpers - let checkRateLimitKV use real implementation for integration tests
    getRateLimitHeaders: vi.fn(() => ({})),
  };
});

// ==================== UTILS MOCK ====================

vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual('@/lib/utils');
  return {
    ...actual as Record<string, unknown>,
    getErrorMessage: vi.fn((error: unknown) => {
      if (error instanceof Error) return error.message;
      return String(error);
    }),
  };
});

// ==================== TEST UTILITIES ====================

export const mockUtils = {
  createMockUser: (overrides = {}) => ({
    id: 'user-test-123',
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    role: 'user',
    createdAt: Math.floor(Date.now() / 1000),
    ...overrides,
  }),

  createMockAdmin: (overrides = {}) => ({
    id: 'admin-test-123',
    email: 'admin@timorup.com',
    name: 'Test Admin',
    role: 'super_admin',
    createdAt: Math.floor(Date.now() / 1000),
    ...overrides,
  }),

  createMockSession: (overrides = {}) => ({
    id: 'session-test-123',
    userId: 'user-test-123',
    expiresAt: Math.floor(Date.now() / 1000) + 86400,
    ...overrides,
  }),

  createMockListing: (overrides = {}) => ({
    id: `listing-${Date.now()}`,
    title: 'Test Listing',
    slug: `test-listing-${Date.now()}`,
    ownerId: 'user-test-123',
    status: 'draft',
    categoryId: null,
    createdAt: Math.floor(Date.now() / 1000),
    ...overrides,
  }),

  createMockBusiness: (overrides = {}) => ({
    id: `business-${Date.now()}`,
    title: 'Test Business',
    slug: `test-business-${Date.now()}`,
    ownerId: 'user-test-123',
    status: 'draft',
    categoryId: null,
    createdAt: Math.floor(Date.now() / 1000),
    ...overrides,
  }),
};

// ==================== GLOBAL SETUP ====================

beforeAll(() => {
  // Suppress console.error in tests unless explicitly needed
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});