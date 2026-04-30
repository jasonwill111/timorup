globalThis.process ??= {};
globalThis.process.env ??= {};
import { i as initAuth } from "./index_CFTvhP5W.mjs";
const prerender = false;
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
  return new Response(JSON.stringify({
    success: true,
    data: {
      id: authResult.user.id,
      name: authResult.user.name,
      email: authResult.user.email
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
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
