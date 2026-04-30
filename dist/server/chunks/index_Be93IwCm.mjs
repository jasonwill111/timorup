globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { c as siteSettings } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function GET() {
  const db = await getDb();
  try {
    const [result] = await db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "payment_qr")).limit(1);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payment_qr: result?.value ?? null
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Public settings error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: "Failed to fetch settings" }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
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
