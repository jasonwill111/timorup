globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { f as adBanners } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function GET() {
  try {
    const db = await getDb();
    const banners = await db.select({
      id: adBanners.id,
      title: adBanners.title,
      description: adBanners.description,
      imageId: adBanners.imageId,
      linkedBusinessPageId: adBanners.linkedBusinessPageId,
      externalUrl: adBanners.externalUrl
    }).from(adBanners).where(eq(adBanners.isActive, true)).limit(5).all();
    const bannersWithImages = banners.map((banner) => ({
      ...banner,
      imageUrl: banner.imageId ? `/api/media/${banner.imageId}` : "/images/default-banner.jpg",
      linkUrl: banner.externalUrl || (banner.linkedBusinessPageId ? `/business/${banner.linkedBusinessPageId}` : null)
    }));
    return new Response(JSON.stringify({ success: true, data: bannersWithImages }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "FETCH_ERROR", message: error instanceof Error ? error.message : "Unknown error" }
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
