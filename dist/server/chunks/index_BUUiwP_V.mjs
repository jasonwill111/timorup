globalThis.process ??= {};
globalThis.process.env ??= {};
import { o as orders, b as businessPages } from "./index_CI1oSuTR.mjs";
import { i as initAuth } from "./index_CFTvhP5W.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
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
    const authApi = (await initAuth()).api;
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
async function GET({ request }) {
  const authResult = await requireAuth(request);
  if (!authResult.authorized) return authResult.error;
  try {
    const userOrders = await db.select({
      id: orders.id,
      businessPageId: orders.businessPageId,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      expiryDate: orders.expiryDate,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt
    }).from(orders).where(eq(orders.userId, authResult.user.id)).orderBy(desc(orders.createdAt)).all();
    const businessMap = /* @__PURE__ */ new Map();
    const bizIds = [...new Set(userOrders.map((o) => o.businessPageId).filter(Boolean))];
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
      businessTitle: order.businessPageId ? businessMap.get(order.businessPageId) || "Unknown Business" : null
    }));
    return new Response(JSON.stringify({
      success: true,
      data: ordersWithBusiness
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
