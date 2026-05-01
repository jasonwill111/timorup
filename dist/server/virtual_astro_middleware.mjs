globalThis.process ??= {};
globalThis.process.env ??= {};
import { k as defineMiddleware, l as sequence } from "./chunks/sequence_B5OHTG58.mjs";
import { s as schema } from "./chunks/index_k-9RrFxP.mjs";
import { d as drizzle } from "./chunks/driver_D-p9Lb6U.mjs";
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
  const staticPaths = ["/about", "/contact", "/faqs", "/privacy", "/terms", "/pricing"];
  if (staticPaths.some((p) => context.url.pathname.startsWith(p))) {
    const response = await next();
    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
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
