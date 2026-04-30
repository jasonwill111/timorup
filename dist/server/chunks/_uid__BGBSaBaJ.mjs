globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { u as users } from "./index_CI1oSuTR.mjs";
import { c as checkRateLimit, g as getRateLimitHeaders } from "./rate-limit_Dfqy25j0.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { o as object, s as string } from "./sequence_RDixOVvO.mjs";
const prerender = false;
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
function getClientIP(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}
const ParamsSchema = object({
  uid: string().min(1)
});
async function GET({ params, request }) {
  const db = await getDb();
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`profile:${clientIP}`);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Rate limit exceeded. Please try again later." }
    }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...getRateLimitHeaders(rateLimit)
      }
    });
  }
  const parseResult = ParamsSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Invalid user ID" }
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { uid } = parseResult.data;
  try {
    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, uid)).limit(1).get();
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "User not found" }
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: user
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
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
