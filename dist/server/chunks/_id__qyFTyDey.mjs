globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { o as orders, b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function GET({ params }) {
  const db = await getDb();
  try {
    const { id } = params;
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1).get();
    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Order not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
      success: true,
      data: order
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get order error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to get order" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function PUT({ params, request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { planType, amount, status, expiryDate, adminNotes } = body;
    const { id } = params;
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1).get();
    if (!order) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Order not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    let newExpiryDate = expiryDate ? new Date(expiryDate) : order.expiryDate;
    let paidDate = order.paidDate;
    if (status === "paid" && order.status !== "paid" && !order.paidDate) {
      paidDate = /* @__PURE__ */ new Date();
      if (!expiryDate) {
        const isYearly = planType?.includes("yearly") || order.planType.includes("yearly");
        const days = isYearly ? 365 : 30;
        newExpiryDate = /* @__PURE__ */ new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + days);
      }
    }
    const planAmounts = {
      "basic-monthly": 29,
      "basic-yearly": 290,
      "pro-monthly": 59,
      "pro-yearly": 590,
      "max-monthly": 89,
      "max-yearly": 890
    };
    const finalAmount = amount ?? planAmounts[planType || order.planType] ?? order.amount;
    await db.update(orders).set({
      planType: planType || order.planType,
      amount: finalAmount,
      status: status || order.status,
      paidDate,
      expiryDate: newExpiryDate,
      adminNotes: adminNotes !== void 0 ? adminNotes : order.adminNotes,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(orders.id, id)).run();
    if (status === "paid" && order.businessPageId) {
      const finalPlanType = (planType || order.planType).replace("-yearly", "").replace("-monthly", "");
      await db.update(businessPages).set({
        planType: finalPlanType,
        expiryDate: newExpiryDate,
        status: order.status === "draft" ? "live" : order.status,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(businessPages.id, order.businessPageId)).run();
    }
    return new Response(JSON.stringify({
      success: true,
      data: { id, planType, amount: finalAmount, status, expiryDate: newExpiryDate, paidDate }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Update order error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to update order" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function DELETE({ params }) {
  const db = await getDb();
  try {
    const { id } = params;
    await db.delete(orders).where(eq(orders.id, id)).run();
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to delete order" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
