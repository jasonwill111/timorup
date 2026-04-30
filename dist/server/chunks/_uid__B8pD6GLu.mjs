globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { c as checkRateLimit, g as getRateLimitHeaders } from "./rate-limit_Dfqy25j0.mjs";
import { a as auth } from "./index_CFTvhP5W.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { o as object, s as string } from "./sequence_RDixOVvO.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}
async function requireAuth(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" }
    }), { status: 401, headers: { "Content-Type": "application/json" } }) };
  }
  try {
    const authApi = auth.api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` }
    });
    if (!user) {
      return { authorized: false, error: new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      }), { status: 401, headers: { "Content-Type": "application/json" } }) };
    }
    return { authorized: true, user };
  } catch {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" }
    }), { status: 401, headers: { "Content-Type": "application/json" } }) };
  }
}
const ParamsSchema = object({
  uid: string().min(1)
});
async function GET({ params, request }) {
  const db = await getDb();
  const authResult = await requireAuth(request);
  if (!authResult.authorized) return authResult.error;
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
        ...getRateLimitHeaders(rateLimit)
      }
    });
  }
  const parseResult = ParamsSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Invalid user ID" }
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { uid } = parseResult.data;
  try {
    const businesses = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      status: businessPages.status,
      entityType: businessPages.entityType,
      categoryId: businessPages.categoryId,
      createdAt: businessPages.createdAt,
      ratingAverage: businessPages.ratingAverage,
      views: businessPages.views,
      planType: businessPages.planType
    }).from(businessPages).where(eq(businessPages.ownerId, uid)).orderBy(desc(businessPages.createdAt)).all();
    const categoryMap = /* @__PURE__ */ new Map();
    const cats = await db.select().from(categories).all();
    cats.forEach((cat) => categoryMap.set(cat.id, cat.name));
    const businessesWithCategory = businesses.map((biz) => ({
      ...biz,
      categoryName: biz.categoryId ? categoryMap.get(biz.categoryId) || "Uncategorized" : "Uncategorized"
    }));
    return new Response(JSON.stringify({
      success: true,
      data: businessesWithCategory
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
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
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
