globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { f as adBanners } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const prerender = false;
async function GET({ request }) {
  const url = new URL(request.url);
  const isActive = url.searchParams.get("active") === "true";
  try {
    const db = await getDb();
    if (isActive) {
      const banners2 = await db.select({
        id: adBanners.id,
        title: adBanners.title,
        description: adBanners.description,
        imageId: adBanners.imageId,
        linkedBusinessPageId: adBanners.linkedBusinessPageId,
        externalUrl: adBanners.externalUrl
      }).from(adBanners).where(eq(adBanners.isActive, true)).limit(5).all();
      const bannersWithImages = await Promise.all(
        banners2.map(async (banner) => ({
          ...banner,
          imageUrl: banner.imageId ? `/api/media/${banner.imageId}` : "/images/default-banner.jpg",
          linkUrl: banner.externalUrl || (banner.linkedBusinessPageId ? `/business/${banner.linkedBusinessPageId}` : null)
        }))
      );
      return new Response(JSON.stringify({ success: true, data: bannersWithImages }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const banners = await db.select().from(adBanners).orderBy(desc(adBanners.createdAt)).all();
    return new Response(JSON.stringify({ success: true, data: banners }), {
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
async function POST({ request }) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { title, description, imageId, linkedBusinessPageId, externalUrl, isActive, startDate, endDate } = body;
    const [newBanner] = await db.insert(adBanners).values({
      title,
      description: description || null,
      imageId: imageId || null,
      linkedBusinessPageId: linkedBusinessPageId || null,
      externalUrl: externalUrl || null,
      isActive: isActive ?? true,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    }).returning().get();
    return new Response(JSON.stringify({ success: true, data: newBanner }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "CREATE_ERROR", message: error instanceof Error ? error.message : "Unknown error" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
