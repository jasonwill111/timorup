globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { u as users, b as businessPages, o as orders, d as categories, a as sessions } from "./index_CI1oSuTR.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
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
async function GET({ request }) {
  const db = await getDb();
  const authResult = await requireAdminAuth(request);
  if (!authResult.authorized) return authResult.error;
  try {
    const usersResult = await db.select({ count: sql`count(*)` }).from(users).get();
    const totalUsers = Number(usersResult?.count) || 0;
    const businessesResult = await db.select({ count: sql`count(*)` }).from(businessPages).get();
    const totalBusinesses = Number(businessesResult?.count) || 0;
    const liveBusinessesResult = await db.select({ count: sql`count(*)` }).from(businessPages).where(eq(businessPages.status, "live")).get();
    const liveBusinesses = Number(liveBusinessesResult?.count) || 0;
    const ordersResult = await db.select({ count: sql`count(*)` }).from(orders).get();
    const totalOrders = Number(ordersResult?.count) || 0;
    const revenueResult = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(orders).where(eq(orders.status, "paid")).get();
    const totalRevenue = Number(revenueResult?.total) || 0;
    const categoriesResult = await db.select({ count: sql`count(*)` }).from(categories).get();
    const totalCategories = Number(categoriesResult?.count) || 0;
    return new Response(JSON.stringify({
      success: true,
      data: {
        totalUsers,
        totalBusinesses,
        liveBusinesses,
        totalOrders,
        totalRevenue,
        totalCategories,
        pendingBusinesses: totalBusinesses - liveBusinesses
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to fetch stats" }
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
