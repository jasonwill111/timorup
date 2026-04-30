globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { c as checkRateLimit, g as getRateLimitHeaders } from "./rate-limit_Dfqy25j0.mjs";
import { e as eq, y as or, o as like, a as and } from "./conditions_GHdPwyYE.mjs";
import { d as desc, k as asc } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}
const CACHE_TTL_LIST = 30;
async function getCachedResponse(cacheKey) {
  try {
    const cache = caches.default;
    return await cache.match(cacheKey);
  } catch {
    return null;
  }
}
async function cacheResponse(cacheKey, response, ttl) {
  try {
    const cache = caches.default;
    const clonedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        "Cache-Control": `public, max-age=${ttl}`
      }
    });
    await cache.put(cacheKey, clonedResponse);
  } catch {
  }
}
async function GET({ url, request }) {
  const db = await getDb();
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`list:${clientIP}`);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Rate limit exceeded. Please try again later." }
    }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": rateLimit.resetIn.toString(),
        ...getRateLimitHeaders(rateLimit)
      }
    });
  }
  const cacheKey = `/api/businesses${url.search}`;
  const hasSearch = url.searchParams.get("search");
  if (!hasSearch) {
    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  try {
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const sort = url.searchParams.get("sort") || "recent";
    const page2 = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const offset = (page2 - 1) * limit;
    const type = url.searchParams.get("type") || "";
    const organizationType = url.searchParams.get("organizationType") || "";
    const conditions = [eq(businessPages.status, "live")];
    if (type === "organization") {
      conditions.push(eq(businessPages.entityType, "organization"));
    } else if (type === "business") {
      conditions.push(eq(businessPages.entityType, "business"));
    }
    if (organizationType) {
      conditions.push(eq(businessPages.organizationType, organizationType));
    }
    if (search) {
      conditions.push(or(
        like(businessPages.title, `%${search}%`),
        like(businessPages.aboutUs, `%${search}%`),
        like(businessPages.tags, `%${search}%`)
      ));
    }
    if (category) {
      const cat = await db.select().from(categories).where(eq(categories.slug, category)).limit(1).all();
      if (cat.length > 0) {
        conditions.push(eq(businessPages.categoryId, cat[0].id));
      }
    }
    let orderBy;
    switch (sort) {
      case "popular":
        orderBy = desc(sql`(likes * 3 + saves * 1 + views * 0.01)`);
        break;
      case "rating":
        orderBy = desc(businessPages.ratingAverage);
        break;
      case "name":
        orderBy = asc(businessPages.title);
        break;
      default:
        orderBy = desc(businessPages.createdAt);
    }
    const allBusinesses = await db.select().from(businessPages).where(and(...conditions)).orderBy(orderBy).limit(limit).offset(offset).all();
    const totalResult = await db.select({ count: sql`count(*)` }).from(businessPages).where(and(...conditions)).get();
    const total = Number(totalResult?.count) || 0;
    const categoryMap = /* @__PURE__ */ new Map();
    const allCategories = await db.select().from(categories).all();
    allCategories.forEach((cat) => categoryMap.set(cat.id, cat));
    const businessesWithCategory = allBusinesses.map((biz) => ({
      ...biz,
      categoryName: categoryMap.get(biz.categoryId)?.name || "Business"
    }));
    const response = new Response(JSON.stringify({
      success: true,
      data: businessesWithCategory,
      pagination: {
        page: page2,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!hasSearch) {
      await cacheResponse(cacheKey, response, CACHE_TTL_LIST);
    }
    return response;
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
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
