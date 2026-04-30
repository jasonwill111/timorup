globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { r as reviews, b as businessPages, a as sessions, u as users } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
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
async function DELETE({ request, params }) {
  const db = await getDb();
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "Admin access required" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    const reviewId = params.id;
    if (!reviewId) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "BAD_REQUEST", message: "Review ID is required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1).get();
    if (!review) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NOT_FOUND", message: "Review not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const businessPageId = review.businessPageId;
    await db.delete(reviews).where(eq(reviews.id, reviewId)).run();
    const remainingReviews = await db.select().from(reviews).where(eq(reviews.businessPageId, businessPageId));
    let newAvg = 0;
    let newCount = 0;
    if (remainingReviews.length > 0) {
      const sum = remainingReviews.reduce((acc, r) => acc + r.rating, 0);
      newAvg = sum / remainingReviews.length;
      newCount = remainingReviews.length;
    }
    await db.update(businessPages).set({
      ratingAverage: newAvg,
      ratingCount: newCount
    }).where(eq(businessPages.id, businessPageId)).run();
    return new Response(JSON.stringify({
      success: true,
      message: "Review deleted",
      updatedRating: {
        average: newAvg,
        count: newCount
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin delete review error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to delete review" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
