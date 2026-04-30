globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as schema } from "./index_CI1oSuTR.mjs";
import { d as drizzle } from "./driver_BHKp2ZYL.mjs";
async function isWorkersRuntime() {
  try {
    await import("cloudflare:workers");
    return true;
  } catch {
    return false;
  }
}
async function getDb() {
  if (typeof Astro !== "undefined" && Astro.locals?.db) {
    return Astro.locals.db;
  }
  if (await isWorkersRuntime()) {
    const { env } = await import("cloudflare:workers");
    const cfEnv = env;
    if (cfEnv.DB) {
      return drizzle(cfEnv.DB, { schema });
    }
  }
  throw new Error("D1 not available. Ensure middleware is properly configured.");
}
const db = {
  select: () => {
    throw new Error("Use await getDb() instead of db. The synchronous db export does not work in Cloudflare Workers.");
  }
};
export {
  db,
  getDb
};
