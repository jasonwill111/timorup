globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { f as adBanners } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function PUT({ request }) {
  const db = await getDb();
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  try {
    const body = await request.json();
    const { title, description, imageId, linkedBusinessPageId, externalUrl, isActive, startDate, endDate } = body;
    const updated = await db.update(adBanners).set({
      title,
      description,
      imageId,
      linkedBusinessPageId,
      externalUrl,
      isActive,
      startDate: startDate ? new Date(startDate) : void 0,
      endDate: endDate ? new Date(endDate) : void 0,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(adBanners.id, id)).returning().get();
    if (!updated) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NOT_FOUND", message: "Banner not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "UPDATE_ERROR", message: error.message }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function DELETE({ request }) {
  const db = await getDb();
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  try {
    await db.delete(adBanners).where(eq(adBanners.id, id)).run();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "DELETE_ERROR", message: error.message }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
