globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { a as sessions, u as users, b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function POST({ request }) {
  const db = await getDb();
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (!tokenMatch) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be logged in to create a page" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const session = await db.select().from(sessions).where(eq(sessions.token, tokenMatch[1])).limit(1).get();
    if (!session || !session.expiresAt || new Date(session.expiresAt) < /* @__PURE__ */ new Date()) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Session expired. Please log in again." }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const user = await db.select().from(users).where(eq(users.id, session.userId)).limit(1).get();
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User not found" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const userId = user.id;
    const body = await request.json();
    const {
      title,
      slug,
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
      entityType,
      registrationUrl,
      publishNow
    } = body;
    const validTypes = ["business", "government", "nonprofit"];
    const finalEntityType = validTypes.includes(entityType) ? entityType : "business";
    const existingListing = await db.select().from(businessPages).where(eq(businessPages.ownerId, userId)).limit(1).get();
    if (existingListing) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: "LIMIT_REACHED",
          message: `You already have a ${existingListing.entityType} listing. Each account can only create one listing.`
        }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!title) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Title is required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const businessSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    const existingSlug = await db.select().from(businessPages).where(eq(businessPages.slug, businessSlug)).limit(1).get();
    if (existingSlug) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "A page with this name already exists" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const id = `biz-${Date.now()}`;
    const pageStatus = publishNow ? "live" : "draft";
    await db.insert(businessPages).values({
      id,
      title,
      slug: businessSlug,
      ownerId: userId,
      categoryId: categoryId || null,
      entityType: finalEntityType,
      contactName: contactName || null,
      contactNumber: contactNumber || null,
      countryCode: countryCode || "+670",
      email: email || null,
      address: address || null,
      aboutUs: aboutUs || null,
      tags: tags ? JSON.stringify(tags) : null,
      openingHours: openingHours ? JSON.stringify(openingHours) : null,
      locationLat: latitude || null,
      locationLng: longitude || null,
      registrationUrl: registrationUrl || null,
      status: pageStatus
    }).run();
    return new Response(JSON.stringify({
      success: true,
      data: { id, title, slug: businessSlug, entityType: finalEntityType }
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Create page error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to create page" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
export {
  POST as P,
  _page as _
};
