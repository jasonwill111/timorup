globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from "./chunks/sequence_CHQwVyeI.mjs";
import "./chunks/transition_CcjxKiHl.mjs";
const onRequest$1 = defineMiddleware(async (context, next) => {
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
