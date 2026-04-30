globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { r as reviews, b as businessPages, u as users, a as sessions } from "./index_CI1oSuTR.mjs";
import { e as eq, j as gte, q as lte, a as and } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
async function requireAdminAuth(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" }
    }), { status: 401, headers: { "Content-Type": "application/json" } }) };
  }
  const db = await getDb();
  const session = await db.select().from(sessions).where(eq(sessions.token, tokenMatch[1])).limit(1).get();
  if (!session || !session.expiresAt || new Date(session.expiresAt) < /* @__PURE__ */ new Date()) {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Session expired" }
    }), { status: 401, headers: { "Content-Type": "application/json" } }) };
  }
  const user = await db.select().from(users).where(eq(users.id, session.userId)).limit(1).get();
  if (!user || user.role !== "admin") {
    return { authorized: false, error: new Response(JSON.stringify({
      success: false,
      error: { code: "FORBIDDEN", message: "Admin access required" }
    }), { status: 403, headers: { "Content-Type": "application/json" } }) };
  }
  return { authorized: true, user };
}
async function isAdmin(request) {
  const result = await requireAdminAuth(request);
  return result.authorized;
}
async function GET({ url, request }) {
  const db = await getDb();
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "Admin access required" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    const search = url.searchParams.get("search") || "";
    const rating = url.searchParams.get("rating");
    const fromDate = url.searchParams.get("from");
    const toDate = url.searchParams.get("to");
    const page2 = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page2 - 1) * limit;
    const conditions = [];
    if (rating && ["1", "2", "3", "4", "5"].includes(rating)) {
      conditions.push(eq(reviews.rating, parseInt(rating)));
    }
    if (fromDate) {
      const fromTimestamp = new Date(fromDate).getTime();
      if (!isNaN(fromTimestamp)) {
        conditions.push(gte(reviews.createdAt, new Date(fromTimestamp)));
      }
    }
    if (toDate) {
      const toTimestamp = new Date(toDate).getTime();
      if (!isNaN(toTimestamp)) {
        conditions.push(lte(reviews.createdAt, new Date(toTimestamp)));
      }
    }
    const reviewsList = await db.select().from(reviews).where(conditions.length > 0 ? and(...conditions) : void 0).orderBy(desc(reviews.createdAt)).limit(limit).offset(offset);
    const businessIds = [...new Set(reviewsList.map((r) => r.businessPageId))];
    const businesses = businessIds.length > 0 ? await db.select({ id: businessPages.id, title: businessPages.title }).from(businessPages).where(sql`${businessPages.id} IN (${sql.join(businessIds.map((id) => sql`${id}`), sql`, `)})`) : [];
    const businessMap = new Map(businesses.map((b) => [b.id, b.title]));
    const userIds = [...new Set(reviewsList.map((r) => r.userId))];
    const userList = userIds.length > 0 ? await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(sql`${users.id} IN (${sql.join(userIds.map((id) => sql`${id}`), sql`, `)})`) : [];
    const userMap = new Map(userList.map((u) => [u.id, u]));
    const enrichedReviews = reviewsList.map((review) => ({
      ...review,
      businessTitle: businessMap.get(review.businessPageId) || "Unknown",
      userName: userMap.get(review.userId)?.name || "Unknown",
      userEmail: userMap.get(review.userId)?.email || ""
    }));
    let filteredReviews = enrichedReviews;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReviews = enrichedReviews.filter(
        (r) => r.comment?.toLowerCase().includes(searchLower) || r.businessTitle.toLowerCase().includes(searchLower) || r.userName.toLowerCase().includes(searchLower) || r.userEmail.toLowerCase().includes(searchLower)
      );
    }
    const countResult = await db.select({ count: sql`count(*)` }).from(reviews);
    return new Response(JSON.stringify({
      success: true,
      data: filteredReviews,
      total: Number(countResult[0]?.count) || 0,
      page: page2,
      limit
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin reviews error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to fetch reviews" }
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
