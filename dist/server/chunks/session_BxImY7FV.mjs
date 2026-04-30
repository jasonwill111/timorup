globalThis.process ??= {};
globalThis.process.env ??= {};
import { i as initAuth } from "./index_CFTvhP5W.mjs";
const prerender = false;
async function GET({ request }) {
  try {
    const authApi = (await initAuth()).api;
    const session = await authApi.getSession({
      headers: request.headers
    });
    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ user: null, session: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
export {
  GET as G,
  _page as _
};
