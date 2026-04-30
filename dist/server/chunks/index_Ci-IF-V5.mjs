globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { r as reviews, b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
async function GET({ url }) {
  try {
    const db = await getDb();
    const businessPageId = url.searchParams.get("businessPageId");
    const page2 = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page2 - 1) * limit;
    let conditions = [];
    if (businessPageId) {
      conditions.push(eq(reviews.businessPageId, businessPageId));
    }
    const reviewsResult = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isEdited: reviews.isEdited,
      createdAt: reviews.createdAt,
      reply: reviews.reply,
      repliedAt: reviews.repliedAt,
      repliedBy: reviews.repliedBy
    }).from(reviews).where(conditions.length > 0 ? conditions[0] : void 0).orderBy(desc(reviews.createdAt)).limit(limit).offset(offset);
    let avgRating = 0;
    if (businessPageId) {
      const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})` }).from(reviews).where(eq(reviews.businessPageId, businessPageId));
      avgRating = Number(avgResult[0]?.avg) || 0;
    }
    const countResult = await db.select({ count: sql`count(*)` }).from(reviews).where(conditions.length > 0 ? conditions[0] : void 0);
    return new Response(JSON.stringify({
      success: true,
      data: reviewsResult,
      averageRating: avgRating,
      total: Number(countResult[0]?.count) || 0,
      page: page2,
      limit
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Reviews error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: error instanceof Error ? error.message : "Failed to fetch reviews" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function POST({ request }) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { businessPageId, userId, rating, comment } = body;
    if (!businessPageId || !userId || !rating) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "businessPageId, userId, and rating are required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const business = await db.select().from(businessPages).where(eq(businessPages.id, businessPageId)).limit(1);
    if (business.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Business not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const id = `review-${Date.now()}`;
    const newReview = await db.insert(reviews).values({
      id,
      businessPageId,
      userId,
      rating,
      comment: comment || ""
    }).returning();
    const avgResult = await db.select({ avg: sql`AVG(${reviews.rating})`, count: sql`COUNT(*)` }).from(reviews).where(eq(reviews.businessPageId, businessPageId));
    await db.update(businessPages).set({
      ratingAverage: Number(avgResult[0]?.avg) || rating,
      ratingCount: Number(avgResult[0]?.count) || 1
    }).where(eq(businessPages.id, businessPageId));
    return new Response(JSON.stringify({
      success: true,
      data: newReview[0]
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Create review error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: error instanceof Error ? error.message : "Failed to create review" }
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
