globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function POST({ params, request }) {
  const db = await getDb();
  try {
    const { slug } = params;
    const body = await request.json();
    const { action } = body;
    const business = await db.select().from(businessPages).where(eq(businessPages.slug, slug)).limit(1).get();
    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Business not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    if (action === "like") {
      await db.update(businessPages).set({ likes: (business.likes || 0) + 1 }).where(eq(businessPages.id, business.id)).run();
      return new Response(JSON.stringify({
        success: true,
        data: { likes: (business.likes || 0) + 1 }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (action === "save") {
      await db.update(businessPages).set({ saves: (business.saves || 0) + 1 }).where(eq(businessPages.id, business.id)).run();
      return new Response(JSON.stringify({
        success: true,
        data: { saves: (business.saves || 0) + 1 }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Invalid action" }
    }), { status: 400, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Like/Save error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to process request" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
