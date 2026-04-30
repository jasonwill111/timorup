globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { m as media } from "./index_CI1oSuTR.mjs";
import { i as initAuth } from "./index_CFTvhP5W.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
async function getCurrentUser(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) return null;
  try {
    const authApi = (await initAuth()).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` }
    });
    return user;
  } catch {
    return null;
  }
}
async function GET({ request }) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    const item = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (item.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NOT_FOUND", message: "Media not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true, data: item[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "FETCH_ERROR", message: getErrorMessage(error) }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function DELETE({ request }) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const item = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (item.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NOT_FOUND", message: "Media not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const mediaItem = item[0];
    if (mediaItem.createdById !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FORBIDDEN", message: "Access denied" }
      }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    if (mediaItem.url && !mediaItem.url.startsWith("data:")) {
      const { deleteFromR2 } = await import("./media_rgSTBrWs.mjs").then((n) => n.aU);
      await deleteFromR2(mediaItem.url);
    }
    await db.delete(media).where(eq(media.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "DELETE_ERROR", message: getErrorMessage(error) }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
