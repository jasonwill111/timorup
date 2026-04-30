globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { d as categories } from "./index_CI1oSuTR.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
async function GET() {
  try {
    const db = await getDb();
    const allCategories = await db.select().from(categories).all();
    const cacheHeaders = false ? { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600" } : { "Cache-Control": "no-store" };
    return new Response(JSON.stringify({
      success: true,
      data: allCategories
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...cacheHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
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
