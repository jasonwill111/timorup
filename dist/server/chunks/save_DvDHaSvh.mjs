globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { c as siteSettings } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
async function POST({ request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { settings } = body;
    if (!settings || typeof settings !== "object") {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "INVALID_BODY", message: "Settings object is required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    for (const [key, valueObj] of Object.entries(settings)) {
      let value;
      if (typeof valueObj === "object" && valueObj !== null && "value" in valueObj) {
        value = String(valueObj.value ?? "");
      } else if (typeof valueObj === "object" && valueObj !== null && "qrCode" in valueObj) {
        value = String(valueObj.qrCode ?? "");
      } else {
        value = String(valueObj ?? "");
      }
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(siteSettings).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ id: key, key, value });
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Settings saved successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { code: "SAVE_ERROR", message: getErrorMessage(error) }
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
