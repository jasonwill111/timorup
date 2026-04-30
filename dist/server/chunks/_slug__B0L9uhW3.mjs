globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { i as initAuth } from "./index_CFTvhP5W.mjs";
import { b as businessPages, d as categories, p as products, r as reviews } from "./index_CI1oSuTR.mjs";
import { c as checkRateLimit, g as getRateLimitHeaders } from "./rate-limit_Dfqy25j0.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
const CACHE_TTL = 60;
const CACHE_TTL_404 = 300;
function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}
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
        "Cache-Control": `public, max-age=${ttl}, s-maxage=${ttl * 5}`
      }
    });
    await cache.put(cacheKey, clonedResponse);
  } catch {
  }
}
async function purgeCache(cacheKey) {
  try {
    const cache = caches.default;
    await cache.delete(cacheKey);
  } catch {
  }
}
async function GET({ params, request }) {
  const db = await getDb();
  const { slug } = params;
  const cacheKey = `/api/businesses/${slug}`;
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`biz:${clientIP}`);
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
  const cachedResponse = await getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const business = await db.select().from(businessPages).where(eq(businessPages.slug, slug)).limit(1).get();
    if (!business) {
      const notFoundResponse = new Response(JSON.stringify({
        success: false,
        error: { message: "Business not found" }
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
      await cacheResponse(cacheKey, notFoundResponse, CACHE_TTL_404);
      return notFoundResponse;
    }
    let categoryName = "Business";
    let categorySlug = "business";
    if (business.categoryId) {
      const cat = await db.select().from(categories).where(eq(categories.id, business.categoryId)).limit(1).get();
      if (cat) {
        categoryName = cat.name;
        categorySlug = cat.slug;
      }
    }
    let businessProducts = [];
    let businessReviews = [];
    if (business.entityType !== "organization") {
      businessProducts = await db.select().from(products).where(eq(products.businessPageId, business.id)).all();
      businessReviews = await db.select().from(reviews).where(eq(reviews.businessPageId, business.id)).orderBy(desc(reviews.createdAt)).all();
    }
    const response = new Response(JSON.stringify({
      success: true,
      data: {
        ...business,
        categoryName,
        categorySlug,
        products: businessProducts,
        reviews: businessReviews
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
    await cacheResponse(cacheKey, response, CACHE_TTL);
    return response;
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function PUT({ params, request }) {
  const db = await getDb();
  try {
    const { slug } = params;
    const cookieHeader = request.headers.get("cookie") || "";
    const authApi = (await initAuth()).api;
    const session = await authApi.getSession({
      headers: { cookie: cookieHeader }
    });
    if (!session?.user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be logged in to update a business" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const userId = session.user.id;
    const existing = await db.select().from(businessPages).where(eq(businessPages.slug, slug)).limit(1).get();
    if (!existing) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Business not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    if (existing.ownerId !== userId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "You do not have permission to edit this business" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    const body = await request.json();
    const {
      title,
      slug: newSlug,
      categoryId,
      contactName,
      contactNumber,
      countryCode,
      email,
      address,
      aboutUs,
      tags,
      openingHours,
      latitude,
      longitude,
      yearOfEstablishment,
      latestUpdates
    } = body;
    const updateValues = {};
    if (title !== void 0) updateValues.title = title;
    if (newSlug !== void 0) updateValues.slug = newSlug;
    if (categoryId !== void 0) updateValues.categoryId = categoryId || null;
    if (contactName !== void 0) updateValues.contactName = contactName || null;
    if (contactNumber !== void 0) updateValues.contactNumber = contactNumber || null;
    if (countryCode !== void 0) updateValues.countryCode = countryCode || "+670";
    if (email !== void 0) updateValues.email = email || null;
    if (address !== void 0) updateValues.address = address || null;
    if (aboutUs !== void 0) updateValues.aboutUs = aboutUs || null;
    if (tags !== void 0) updateValues.tags = Array.isArray(tags) ? JSON.stringify(tags) : tags || null;
    if (openingHours !== void 0) updateValues.openingHours = openingHours ? JSON.stringify(openingHours) : null;
    if (latitude !== void 0) updateValues.locationLat = latitude || null;
    if (longitude !== void 0) updateValues.locationLng = longitude || null;
    if (yearOfEstablishment !== void 0) updateValues.yearOfEstablishment = yearOfEstablishment || null;
    if (latestUpdates !== void 0) updateValues.latestUpdates = latestUpdates || null;
    if (Object.keys(updateValues).length > 0) {
      updateValues.updatedAt = Math.floor(Date.now() / 1e3);
      await db.update(businessPages).set(updateValues).where(eq(businessPages.slug, slug)).run();
      await purgeCache(`/api/businesses/${slug}`);
    }
    const updated = await db.select().from(businessPages).where(eq(businessPages.slug, slug)).limit(1).get();
    return new Response(JSON.stringify({
      success: true,
      data: updated
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
