globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { p as products } from "./index_CI1oSuTR.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const prerender = false;
async function GET() {
  const db = await getDb();
  try {
    const skus = await db.select().from(products).orderBy(desc(products.createdAt)).all();
    return new Response(JSON.stringify({
      success: true,
      data: skus
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin SKUs error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to fetch SKUs" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
