globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { u as users } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function POST({ request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Email is required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).get();
    if (!user) {
      return new Response(JSON.stringify({
        success: true,
        message: "If email exists, reset link will be sent"
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    const resetToken = `reset-${Date.now()}`;
    return new Response(JSON.stringify({
      success: true,
      message: "Password reset link sent to email",
      // DEBUG ONLY - remove in production
      debugToken: resetToken
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to process request" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
