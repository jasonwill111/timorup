globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, p as products } from "./index_CI1oSuTR.mjs";
import { P as PLAN_LIMITS } from "./media_rgSTBrWs.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
async function GET({ params, url }) {
  const db = await getDb();
  try {
    const { businessPageId } = params;
    const business = await db.select({
      planType: businessPages.planType,
      expiryDate: businessPages.expiryDate,
      status: businessPages.status
    }).from(businessPages).where(eq(businessPages.id, businessPageId)).limit(1).get();
    if (!business) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Business not found" }
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const plan = business.planType || "basic";
    let effectivePlan = plan;
    if (business.expiryDate && new Date(business.expiryDate) < /* @__PURE__ */ new Date()) {
      effectivePlan = "expired";
    }
    const limit = PLAN_LIMITS[effectivePlan]?.maxProducts || PLAN_LIMITS.basic.maxProducts;
    const countResult = await db.select({ count: sql`count(*)` }).from(products).where(eq(products.businessPageId, businessPageId));
    const current = Number(countResult[0]?.count) || 0;
    const remaining = Math.max(0, limit - current);
    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: effectivePlan,
        limit,
        current,
        remaining,
        canAdd: remaining > 0,
        isExpired: effectivePlan === "expired",
        expiryDate: business.expiryDate
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("SKU usage error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to get SKU usage" }
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
