globalThis.process ??= {};
globalThis.process.env ??= {};
import { G as GET } from "./index_Be93IwCm.mjs";
import { v as vi, b as beforeEach, d as describe, i as it, g as globalExpect } from "./test.DNmyFkvJ_1zHBiLrT.mjs";
const mockSelect = vi.hoisted(
  () => vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve([])) }))
    }))
  }))
);
const mockDb = vi.hoisted(() => ({ select: mockSelect }));
vi.mock("@/lib/db", () => ({ db: mockDb }));
vi.mock("@/db/schema", () => ({
  siteSettings: { key: "key", value: "value" }
}));
beforeEach(() => {
  mockSelect.mockReset();
  mockSelect.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve([])) }))
    }))
  }));
});
function buildMockChain(result) {
  mockSelect.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve(result)) }))
    }))
  }));
}
function buildMockError(err) {
  mockSelect.mockImplementation(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({ limit: vi.fn(() => Promise.reject(err)) }))
    }))
  }));
}
describe("TC-001: payment_qr key exists", () => {
  it("returns 200 with payment_qr URL when key exists", async () => {
    buildMockChain([{ key: "payment_qr", value: "https://r2.example.com/qr.png" }]);
    const response = await GET();
    const body = await response.json();
    globalExpect(response.status).toBe(200);
    globalExpect(body.success).toBe(true);
    globalExpect(body.data.payment_qr).toBe("https://r2.example.com/qr.png");
  });
});
describe("TC-002: payment_qr key missing", () => {
  it("returns 200 with null payment_qr when key does not exist", async () => {
    buildMockChain([]);
    const response = await GET();
    const body = await response.json();
    globalExpect(response.status).toBe(200);
    globalExpect(body.success).toBe(true);
    globalExpect(body.data.payment_qr).toBeNull();
  });
});
describe("TC-003: DB throws error", () => {
  it("returns 500 with error when DB throws", async () => {
    buildMockError(new Error("DB connection failed"));
    const response = await GET();
    const body = await response.json();
    globalExpect(response.status).toBe(500);
    globalExpect(body.success).toBe(false);
    globalExpect(body.error).toBeDefined();
  });
});
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
