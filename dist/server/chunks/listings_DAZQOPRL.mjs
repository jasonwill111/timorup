globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { d as categories, b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const GET = async ({ params, url }) => {
  const db = await getDb();
  const slug = params.slug;
  const page2 = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "6");
  const offset = (page2 - 1) * limit;
  const entityType = url.searchParams.get("type");
  if (!slug) {
    return new Response(JSON.stringify({ error: "Category slug required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const category = await db.select().from(categories).where(eq(categories.slug, slug)).get();
  if (!category) {
    return new Response(JSON.stringify({ error: "Category not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  const fetchLimit = entityType ? limit * 3 : limit;
  let query = db.select({
    id: businessPages.id,
    title: businessPages.title,
    slug: businessPages.slug,
    entityType: businessPages.entityType,
    profileImageId: businessPages.profileImageId,
    address: businessPages.address,
    tags: businessPages.tags
  }).from(businessPages).where(eq(businessPages.categoryId, category.id)).orderBy(desc(businessPages.likes)).limit(fetchLimit).offset(offset);
  let listings = await query.all();
  if (entityType) {
    listings = listings.filter((l) => l.entityType === entityType).slice(0, limit);
  }
  return new Response(JSON.stringify({
    category: category.slug,
    listings: listings.map((l) => ({
      ...l,
      tags: l.tags ? JSON.parse(l.tags) : []
    })),
    page: page2,
    hasMore: listings.length === limit
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
