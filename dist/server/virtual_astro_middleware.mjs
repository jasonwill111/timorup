globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from "./chunks/params-and-props_B-XwJq7R.mjs";
import "./chunks/transition_qG4JBd8t.mjs";
import { getDb } from "./chunks/db_Cym5-zlY.mjs";
let bindingsInitialized = false;
const onRequest$1 = defineMiddleware(async (context, next) => {
  if (!bindingsInitialized) {
    try {
      const db = await getDb();
      if (db) {
        bindingsInitialized = true;
        console.log("[Middleware] DB initialized");
      }
    } catch (e) {
      console.error("[Middleware] DB init failed:", e instanceof Error ? e.message : String(e));
    }
  }
  return next();
});
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};
