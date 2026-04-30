globalThis.process ??= {};
globalThis.process.env ??= {};
const prerender = false;
async function POST({ request }) {
  try {
    const body = await request.json();
    const { token } = body;
    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Token is required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Email verified successfully"
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Verify email error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to verify email" }
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
