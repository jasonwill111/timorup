globalThis.process ??= {};
globalThis.process.env ??= {};
import { i as initAuth } from "./index_CFTvhP5W.mjs";
const prerender = false;
async function POST({ request }) {
  const authApi = (await initAuth()).api;
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (tokenMatch) {
    try {
      await authApi.signOut({
        headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` }
      });
    } catch (error) {
    }
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "better-auth.session_token=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/"
    }
  });
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
