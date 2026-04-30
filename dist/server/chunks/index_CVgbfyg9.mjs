globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { c as siteSettings } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
async function GET() {
  const db = await getDb();
  try {
    const settingsResult = await db.select().from(siteSettings).all();
    const settings = {};
    settingsResult.forEach((s) => {
      if (s.key === "payment_info") {
        settings[s.key] = { qrCode: s.value };
      } else {
        settings[s.key] = { value: s.value };
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: settings
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin settings error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to fetch settings" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function PUT({ request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { key, value } = body;
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1).get();
    if (existing) {
      await db.update(siteSettings).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteSettings.key, key)).run();
    } else {
      await db.insert(siteSettings).values({
        id: `setting-${Date.now()}`,
        key,
        value
      }).run();
    }
    return new Response(JSON.stringify({
      success: true,
      data: { key, value }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Update setting error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to update setting" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
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
      const value = typeof valueObj === "object" && valueObj !== null ? JSON.stringify(valueObj) : String(valueObj);
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1).get();
      if (existing) {
        await db.update(siteSettings).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteSettings.key, key)).run();
      } else {
        await db.insert(siteSettings).values({ id: key, key, value }).run();
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
      error: { code: "SAVE_ERROR", message: error.message }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
