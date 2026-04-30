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
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Email and password are required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).get();
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Invalid email or password" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    if (user.role !== "admin") {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Access denied. Admin role required." }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    const sessionId = `session-${Date.now()}-${user.id}`;
    const session = {
      id: sessionId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString()
      // 7 days
    };
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      session
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Admin sign in error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to sign in as admin" }
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
