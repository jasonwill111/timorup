globalThis.process ??= {};
globalThis.process.env ??= {};
import { P as POST } from "./sign-up_BOCxoR7r.mjs";
import { P as POST$1 } from "./sign-in_CpgFnyx8.mjs";
import { P as POST$2 } from "./sign-out_CgliH0_6.mjs";
import { G as GET } from "./session_BxImY7FV.mjs";
import { v as vi, b as beforeEach, d as describe, i as it, g as globalExpect } from "./test.DNmyFkvJ_1zHBiLrT.mjs";
function buildSelectChain(result) {
  return vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve(result))
      }))
    }))
  }));
}
const mockSelect = vi.hoisted(() => buildSelectChain([]));
const mockInsert = vi.hoisted(() => vi.fn(() => ({
  values: vi.fn(() => Promise.resolve())
})));
const mockDelete = vi.hoisted(() => vi.fn(() => ({
  where: vi.fn(() => Promise.resolve())
})));
vi.mock("@/lib/db", () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete
  },
  getDb: vi.fn(() => Promise.resolve({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete
  }))
}));
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn()
    }
  },
  getAuth: vi.fn(() => ({
    client: {
      signIn: { useEmailAndPassword: vi.fn() },
      signUp: { useEmailAndPassword: vi.fn() },
      signOut: { use: vi.fn() }
    }
  })),
  initAuth: vi.fn(() => Promise.resolve({
    client: {
      signIn: { useEmailAndPassword: vi.fn() },
      signUp: { useEmailAndPassword: vi.fn() },
      signOut: { use: vi.fn() }
    }
  })),
  createAuth: vi.fn()
}));
vi.mock("@/db/schema", () => ({
  users: { id: "id", email: "email", name: "name", password: "password" },
  sessions: { token: "token", userId: "userId", expiresAt: "expiresAt" },
  accounts: {},
  verifications: {}
}));
beforeEach(() => {
  vi.clearAllMocks();
  mockSelect.mockImplementation(buildSelectChain([]));
  mockInsert.mockImplementation(() => ({
    values: vi.fn(() => Promise.resolve())
  }));
  mockDelete.mockImplementation(() => ({
    where: vi.fn(() => Promise.resolve())
  }));
});
function createRequest(body, cookies) {
  return {
    request: new Request("http://localhost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...cookies ? { "Cookie": cookies } : {}
      },
      body: body ? JSON.stringify(body) : void 0
    })
  };
}
describe("Auth API - Sign Up Validation (TC-001, TC-002, TC-003)", () => {
  describe("TC-001: Missing required fields", () => {
    it("returns 400 when email is missing", async () => {
      const response = await POST(createRequest({
        password: "password123",
        name: "Test User"
        // email is missing
      }));
      globalExpect(response.status).toBe(400);
      const body = await response.json();
      globalExpect(body.success).toBe(false);
    });
  });
  describe("TC-002: Missing password", () => {
    it("returns 400 when password is missing", async () => {
      const response = await POST(createRequest({
        email: "test@example.com",
        name: "Test User"
        // password is missing
      }));
      globalExpect(response.status).toBe(400);
      const body = await response.json();
      globalExpect(body.success).toBe(false);
    });
  });
  describe("TC-003: Missing name", () => {
    it("returns 400 when name is missing", async () => {
      const response = await POST(createRequest({
        email: "test@example.com",
        password: "password123"
        // name is missing
      }));
      globalExpect(response.status).toBe(400);
      const body = await response.json();
      globalExpect(body.success).toBe(false);
    });
  });
});
describe("Auth API - Sign In Validation (TC-004, TC-005, TC-006)", () => {
  describe("TC-004: Valid request format", () => {
    it("handles valid sign-in request", async () => {
      const response = await POST$1(createRequest({
        email: "test@example.com",
        password: "password123"
      }));
      globalExpect(response.status).not.toBe(500);
    });
  });
  describe("TC-005: Missing email", () => {
    it("returns 400 when email is missing", async () => {
      const response = await POST$1(createRequest({
        password: "password123"
      }));
      globalExpect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
  describe("TC-006: Missing password", () => {
    it("returns 400 when password is missing", async () => {
      const response = await POST$1(createRequest({
        email: "test@example.com"
      }));
      globalExpect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
describe("Auth API - Sign Out (TC-007)", () => {
  it("TC-007: invalidates session", async () => {
    mockDelete.mockImplementation(() => ({
      where: vi.fn(() => Promise.resolve())
    }));
    const response = await POST$2(createRequest(void 0, "better-auth.session_token=test-token"));
    globalExpect(response.status).toBe(200);
    const body = await response.json();
    globalExpect(body.success).toBe(true);
  });
});
describe("Auth API - Session (TC-008)", () => {
  it("returns session for valid token", async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    mockSelect.mockImplementation(buildSelectChain([{
      token: "valid-token",
      userId: "user-1",
      expiresAt: futureDate
    }]));
    const response = await GET({ request: new Request("http://localhost", {
      headers: { "Cookie": "better-auth.session_token=valid-token" }
    }) });
    globalExpect(response.status).not.toBe(500);
  });
});
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
