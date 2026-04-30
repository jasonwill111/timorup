globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { r as reviews, b as businessPages } from "./index_CI1oSuTR.mjs";
import { a as auth } from "./index_CFTvhP5W.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { o as object, s as string } from "./sequence_RDixOVvO.mjs";
const prerender = false;
const replySchema = object({
  comment: string().min(1, { error: "Reply comment is required" })
});
async function getUserFromSession(request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  return session?.user || null;
}
async function POST({ request, params }) {
  const db = await getDb();
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be logged in" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
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
    const business = await db.select().from(businessPages).where(eq(businessPages.id, review.businessPageId)).limit(1).get();
    if (!business || business.ownerId !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only reply to reviews on your own business" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    if (review.reply) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "ALREADY_REPLIED", message: "You have already replied to this review" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const body = await request.json();
    const result = replySchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "VALIDATION_ERROR", message: result.error.errors[0]?.message || "Invalid request" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { comment } = result.data;
    await db.update(reviews).set({
      reply: comment,
      repliedAt: /* @__PURE__ */ new Date(),
      repliedBy: user.id
    }).where(eq(reviews.id, reviewId)).run();
    const updatedReview = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1).get();
    return new Response(JSON.stringify({
      success: true,
      data: updatedReview
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Reply error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to create reply" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function PUT({ request, params }) {
  const db = await getDb();
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be logged in" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const reviewId = params.id;
    const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1).get();
    if (!review) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NOT_FOUND", message: "Review not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    if (review.repliedBy !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only edit your own reply" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    const body = await request.json();
    const result = replySchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "VALIDATION_ERROR", message: result.error.errors[0]?.message || "Invalid request" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { comment } = result.data;
    await db.update(reviews).set({
      reply: comment,
      repliedAt: /* @__PURE__ */ new Date()
    }).where(eq(reviews.id, reviewId)).run();
    const updatedReview = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1).get();
    return new Response(JSON.stringify({
      success: true,
      data: updatedReview
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Edit reply error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to edit reply" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function DELETE({ request, params }) {
  const db = await getDb();
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be logged in" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const reviewId = params.id;
    const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1).get();
    if (!review) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NOT_FOUND", message: "Review not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    if (review.repliedBy !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only delete your own reply" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    await db.update(reviews).set({
      reply: null,
      repliedAt: null,
      repliedBy: null
    }).where(eq(reviews.id, reviewId)).run();
    return new Response(JSON.stringify({
      success: true,
      message: "Reply deleted"
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Delete reply error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SERVER_ERROR", message: "Failed to delete reply" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
export {
  _page as _
};
