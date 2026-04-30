globalThis.process ??= {};
globalThis.process.env ??= {};
import { P as POST } from "./create_DQ1r_HD8.mjs";
import { v as vi, b as beforeEach, d as describe, i as it, g as globalExpect } from "./test.DNmyFkvJ_1zHBiLrT.mjs";
function buildAllChain(result) {
  return {
    all: vi.fn(() => Promise.resolve(result)),
    get: vi.fn(() => Promise.resolve(Array.isArray(result) && result.length === 0 ? void 0 : result))
  };
}
function buildWhereLimitChain(result) {
  return {
    where: vi.fn(() => ({
      limit: vi.fn(() => buildAllChain(result))
    }))
  };
}
const mockSelect = vi.hoisted(() => vi.fn(() => ({
  from: vi.fn(() => buildWhereLimitChain(void 0))
})));
vi.mock("@/lib/db", () => ({
  db: {
    select: mockSelect,
    insert: vi.fn()
  }
}));
vi.mock("@/db/schema", () => ({
  businessPages: {
    id: "id",
    title: "title",
    slug: "slug",
    ownerId: "ownerId",
    status: "status",
    entityType: "entityType",
    likes: "likes",
    saves: "saves",
    views: "views",
    ratingAverage: "ratingAverage",
    categoryId: "categoryId",
    aboutUs: "aboutUs",
    tags: "tags",
    createdAt: "createdAt"
  },
  categories: {
    id: "id",
    name: "name",
    slug: "slug"
  },
  users: { id: "id", name: "name" },
  sessions: { token: "token", userId: "userId", expiresAt: "expiresAt" },
  accounts: {},
  verifications: {}
}));
beforeEach(() => {
  vi.clearAllMocks();
});
function createRequest(body, cookies) {
  return {
    request: new Request("http://localhost", {
      method: body ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        ...cookies ? { "Cookie": cookies } : {}
      },
      body: body ? JSON.stringify(body) : void 0
    })
  };
}
describe("Business API - Create Auth (TC-001, TC-002)", () => {
  describe("TC-001: POST without auth returns 401", () => {
    it("returns 401 when no session cookie", async () => {
      const response = await POST(createRequest({ title: "Test Business" }));
      globalExpect(response.status).toBe(401);
      const body = await response.json();
      globalExpect(body.success).toBe(false);
      globalExpect(body.error.code).toBe("UNAUTHORIZED");
    });
  });
  describe("TC-002: POST with invalid session returns 401", () => {
    it("returns 401 when session not found", async () => {
      mockSelect.mockImplementation(() => ({
        from: vi.fn(() => buildWhereLimitChain(void 0))
      }));
      const response = await POST(createRequest(
        { title: "Test Business" },
        "better-auth.session_token=invalid-token"
      ));
      globalExpect(response.status).toBe(401);
      const body = await response.json();
      globalExpect(body.success).toBe(false);
    });
  });
});
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
