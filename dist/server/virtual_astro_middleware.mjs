globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from "./chunks/sequence_zsj5ZTeW.mjs";
import "./chunks/transition_a9bk79PN.mjs";
import { s as schema } from "./chunks/index_k-9RrFxP.mjs";
import { d as drizzle } from "./chunks/driver_CUcFZcSr.mjs";
let isCloudflareWorkersChecked = false;
let isCloudflareWorkers = null;
async function checkCloudflareWorkers() {
  if (isCloudflareWorkersChecked) return isCloudflareWorkers ?? false;
  isCloudflareWorkersChecked = true;
  try {
    await import("cloudflare:workers");
    isCloudflareWorkers = true;
  } catch {
    isCloudflareWorkers = false;
  }
  return isCloudflareWorkers;
}
const onRequest$1 = defineMiddleware(async (context, next) => {
  const isWorkers = await checkCloudflareWorkers();
  if (isWorkers) {
    try {
      const { env } = await import("cloudflare:workers");
      const cfEnv = env;
      if (cfEnv.DB) {
        context.locals.db = drizzle(cfEnv.DB, { schema });
      }
    } catch (e) {
      console.error("[Middleware] Error loading cloudflare:workers:", e);
    }
  }
  const staticPaths = ["/about", "/contact", "/faqs", "/privacy", "/terms", "/pricing", "/"];
  if (staticPaths.some((p) => context.url.pathname === p || context.url.pathname === p + "/")) {
    const response = await next();
    const maxAge = context.url.pathname === "/" || context.url.pathname === "" ? 300 : 3600;
    response.headers.set("Cache-Control", `public, max-age=${maxAge}, stale-while-revalidate=3600`);
    return response;
  }
  if (context.url.pathname.startsWith("/business/") && !context.url.pathname.includes("/edit")) {
    const response = await next();
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
    return response;
  }
  if (context.url.pathname.startsWith("/organization/") && !context.url.pathname.includes("/edit")) {
    const response = await next();
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
    return response;
  }
  if (context.url.pathname === "/products-services" || context.url.pathname === "/products-services/") {
    const response = await next();
    response.headers.set("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    return response;
  }
  if (context.url.pathname === "/listing" || context.url.pathname === "/listing/") {
    const response = await next();
    response.headers.set("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    return response;
  }
  return next();
});
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};
