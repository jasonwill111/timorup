globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
async function GET() {
  const db = await getDb();
  const featuredBusinesses = await db.select({
    id: businessPages.id,
    title: businessPages.title,
    slug: businessPages.slug,
    categoryId: businessPages.categoryId,
    status: businessPages.status,
    bannerImageId: businessPages.bannerImageId,
    profileImageId: businessPages.profileImageId,
    contactName: businessPages.contactName,
    contactNumber: businessPages.contactNumber,
    countryCode: businessPages.countryCode,
    email: businessPages.email,
    address: businessPages.address,
    aboutUs: businessPages.aboutUs,
    tags: businessPages.tags,
    likes: businessPages.likes,
    saves: businessPages.saves,
    ratingAverage: businessPages.ratingAverage,
    ratingCount: businessPages.ratingCount,
    views: businessPages.views,
    planType: businessPages.planType
  }).from(businessPages).where(eq(businessPages.status, "live")).orderBy(sql`(likes * 3 + saves * 1 + views * 0.01) DESC`).limit(8);
  const categoryMap = /* @__PURE__ */ new Map();
  const allCategories = await db.select().from(categories);
  allCategories.forEach((cat) => categoryMap.set(cat.id, cat));
  const businessesWithCategory = featuredBusinesses.map((biz) => ({
    ...biz,
    categoryName: categoryMap.get(biz.categoryId)?.name || "Business"
  }));
  const cacheHeaders = { "Cache-Control": "no-store" };
  return new Response(JSON.stringify({
    success: true,
    data: businessesWithCategory
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...cacheHeaders
    }
  });
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
