globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { o as orders, b as businessPages } from "./index_CI1oSuTR.mjs";
import { c as checkRateLimit, g as getRateLimitHeaders } from "./rate-limit_Dfqy25j0.mjs";
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
const ParamsSchema = object({
  uid: string().min(1)
});
async function GET({ params, request }) {
  const db = await getDb();
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`sub:${clientIP}`);
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
    const userOrders = await db.select({
      id: orders.id,
      businessPageId: orders.businessPageId,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      expiryDate: orders.expiryDate,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt
    }).from(orders).where(eq(orders.userId, uid)).orderBy(desc(orders.createdAt)).all();
    const businessMap = /* @__PURE__ */ new Map();
    const bizIds = [...new Set(userOrders.map((o) => o.businessPageId))];
    if (bizIds.length > 0) {
      const businesses = await db.select({
        id: businessPages.id,
        title: businessPages.title
      }).from(businessPages).all();
      businesses.forEach((biz) => {
        if (bizIds.includes(biz.id)) {
          businessMap.set(biz.id, biz.title);
        }
      });
    }
    const ordersWithBusiness = userOrders.map((order) => ({
      ...order,
      businessTitle: businessMap.get(order.businessPageId) || "Unknown Business"
    }));
    const activeSubscription = userOrders.find(
      (o) => o.status === "paid" && o.expiryDate && new Date(o.expiryDate) > /* @__PURE__ */ new Date()
    );
    return new Response(JSON.stringify({
      success: true,
      data: {
        orders: ordersWithBusiness,
        activeSubscription: activeSubscription || null,
        hasActivePlan: !!activeSubscription
      }
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
