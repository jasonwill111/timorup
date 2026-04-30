globalThis.process ??= {};
globalThis.process.env ??= {};
import { i as initAuth } from "./index_CFTvhP5W.mjs";
const prerender = false;
const rateLimitStore = /* @__PURE__ */ new Map();
const RATE_LIMIT_WINDOW = 60 * 1e3;
const MAX_REQUESTS = 10;
function checkRateLimit(identifier) {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
async function POST({ request }) {
  const authApi = (await initAuth()).api;
  const clientIP = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`signup:${clientIP}`)) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." }
    }), { status: 429, headers: { "Content-Type": "application/json" } });
  }
  try {
    const body = await request.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "INVALID_REQUEST", message: "Email, password, and name are required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const result = await authApi.signUpEmail({
      body: { email, password, name }
    });
    const user = result.user;
    const session = result.session;
    const headers = new Headers({
      "Content-Type": "application/json"
    });
    if (session?.token) {
      headers.set("Set-Cookie", `better-auth.session_token=${session.token}; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`);
    }
    const response = new Response(JSON.stringify({ success: true, user, session }), {
      status: 201,
      headers
    });
    return response;
  } catch (error) {
    console.error("Sign-up error:", error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.toLowerCase().includes("email") && (errorMessage.toLowerCase().includes("exists") || errorMessage.toLowerCase().includes("already"))) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "EMAIL_EXISTS", message: "Email already registered" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SIGN_UP_ERROR", message: errorMessage || "Failed to sign up" }
    }), { status: 400, headers: { "Content-Type": "application/json" } });
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
