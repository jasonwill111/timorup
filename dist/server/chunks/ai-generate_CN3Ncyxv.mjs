globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as agents } from "./index_C4XvjPIc.mjs";
const prerender = false;
const AI_TIMEOUT = 6e4;
async function POST({ request }) {
  try {
    const body = await request.json();
    const { type, data } = body;
    if (!type || !data) {
      return new Response(JSON.stringify({ error: "Type and data required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let agent;
    let prompt = "";
    switch (type) {
      case "listing":
        agent = agents.listingCreator;
        prompt = `Create a listing for ${data.title} (${data.entityType}). Contact: ${data.contactName}, Phone: ${data.contactNumber}, Email: ${data.email}, Address: ${data.address}. About: ${data.aboutUs}. Tags: ${data.tags?.join(", ") || ""}.`;
        break;
      case "sku":
        agent = agents.skuCreator;
        prompt = `Create a ${data.serviceType} called ${data.title}. Description: ${data.description}. Price: ${data.priceFields?.map((p) => `${p.label}: $${p.value}${p.unit}`).join(", ") || "TBD"}.`;
        break;
      case "blog":
        agent = agents.blogCreator;
        prompt = `Write a ${data.type || "general"} article about "${data.topic}". Length: ${data.length || "medium"}. Additional requirements: ${data.prompt || ""}`;
        break;
      case "landing":
        agent = agents.landingPageCreator;
        prompt = `Create a ${data.type || "promotion"} landing page for "${data.title}". Description: ${data.description}. Requirements: ${data.prompt || ""}`;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
    const response = await Promise.race([
      agent.generate(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), AI_TIMEOUT))
    ]);
    return new Response(JSON.stringify({
      success: true,
      text: response.text
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[AI Generate] Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Generation failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
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
