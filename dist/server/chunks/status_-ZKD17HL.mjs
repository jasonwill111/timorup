globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { o as orders, b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function PUT({ params, request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { status, expiryDate } = body;
    const { id } = params;
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1).get();
    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Order not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    let newExpiryDate = order.expiryDate;
    let paidDate = order.paidDate;
    if (status === "paid" && !order.paidDate) {
      paidDate = /* @__PURE__ */ new Date();
      const planType = order.planType || "basic";
      const isYearly = planType.includes("yearly");
      const days = isYearly ? 365 : 30;
      if (expiryDate) {
        newExpiryDate = new Date(expiryDate);
      } else {
        newExpiryDate = /* @__PURE__ */ new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + days);
      }
    }
    await db.update(orders).set({
      status: status || order.status,
      paidDate,
      expiryDate: newExpiryDate,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(orders.id, id)).run();
    if (status === "paid" && order.businessPageId) {
      const planType = order.planType.replace("-yearly", "").replace("-monthly", "").replace("basic", "basic").replace("pro", "pro").replace("max", "max");
      await db.update(businessPages).set({
        planType,
        expiryDate: newExpiryDate,
        status: order.status === "draft" ? "live" : order.status,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(businessPages.id, order.businessPageId)).run();
    }
    return new Response(JSON.stringify({
      success: true,
      data: { id, status, expiryDate: newExpiryDate, paidDate }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to update order status" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
