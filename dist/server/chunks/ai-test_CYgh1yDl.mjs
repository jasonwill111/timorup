globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as agents } from "./index_C4XvjPIc.mjs";
const prerender = false;
const POST = async ({ request }) => {
  try {
    const { message } = await request.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const agent = agents.listingCreator;
    const response = await agent.generate(message);
    return new Response(JSON.stringify({
      success: true,
      text: response.text
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[AI Test] Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
