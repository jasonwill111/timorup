globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { m as media, b as businessPages } from "./index_CI1oSuTR.mjs";
import { i as initAuth } from "./index_CFTvhP5W.mjs";
import { e as eq, a as and } from "./conditions_GHdPwyYE.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_VIDEO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const PLAN_LIMITS = {
  basic: { maxImages: 10, maxVideos: 1 },
  pro: { maxImages: 10, maxVideos: 1 },
  max: { maxImages: 10, maxVideos: 1 }
};
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
async function getBusinessPlanLimits(businessId) {
  const [business] = await db.select({ planType: businessPages.planType }).from(businessPages).where(eq(businessPages.id, businessId)).limit(1);
  const plan = business?.planType || "basic";
  return PLAN_LIMITS[plan] || PLAN_LIMITS.basic;
}
async function countBusinessMedia(businessId) {
  const imageCount = await db.select({ count: sql`count(*)` }).from(media).where(and(eq(media.businessId, businessId), eq(media.type, "image")));
  const videoCount = await db.select({ count: sql`count(*)` }).from(media).where(and(eq(media.businessId, businessId), eq(media.type, "video")));
  return {
    images: imageCount[0]?.count || 0,
    videos: videoCount[0]?.count || 0
  };
}
async function POST({ request }) {
  const db2 = await getDb();
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");
  const user = await getCurrentUser(request);
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" }
    }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  try {
    const body = await request.parseBody();
    const file = body.file;
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "NO_FILE", message: "No file provided" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "INVALID_TYPE", message: "File type not allowed" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: "FILE_TOO_LARGE", message: `File must be less than ${maxSize / 1024 / 1024}MB` }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (businessId) {
      const limits = await getBusinessPlanLimits(businessId);
      const counts = await countBusinessMedia(businessId);
      if (isImage && counts.images >= limits.maxImages) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: "LIMIT_REACHED", message: `Maximum ${limits.maxImages} images allowed` }
        }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      if (isVideo && counts.videos >= limits.maxVideos) {
        return new Response(JSON.stringify({
          success: false,
          error: { code: "LIMIT_REACHED", message: `Maximum ${limits.maxVideos} video allowed` }
        }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    }
    const id = crypto.randomUUID();
    const ext = file.name.split(".").pop() || "bin";
    const timestamp = Date.now();
    const key = `uploads/${user.id}/${businessId || "general"}/${timestamp}-${id}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let finalUrl;
    const hasR2Credentials = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID;
    if (hasR2Credentials) {
      const { uploadToR2 } = await import("./media_rgSTBrWs.mjs").then((n) => n.aU);
      const result = await uploadToR2(buffer, key, file.type, file.size);
      finalUrl = result.url;
    } else {
      const base64 = buffer.toString("base64");
      finalUrl = `data:${file.type};base64,${base64}`;
    }
    const [created] = await db2.insert(media).values({
      id,
      url: hasR2Credentials ? key : finalUrl,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      type: isImage ? "image" : "video",
      businessId: businessId || null,
      createdById: user.id
    }).returning();
    return new Response(JSON.stringify({
      success: true,
      data: {
        id: created.id,
        url: finalUrl,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        type: isImage ? "image" : "video"
      }
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "UPLOAD_ERROR", message: getErrorMessage(error) }
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
