globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
const prerender = false;
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Dashboard;
  const cookieHeader = Astro.request.headers.get("cookie") || "";
  let user = null;
  try {
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const { db } = await import("./db_DBymDTwI.mjs");
      const { sessions, users } = await import("./index_CI1oSuTR.mjs").then((n) => n.s);
      const { eq } = await import("./index_BxPtajE1.mjs");
      const session = await db.select().from(sessions).where(eq(sessions.token, tokenMatch[1])).limit(1).get();
      if (session && session.expiresAt && new Date(session.expiresAt) > /* @__PURE__ */ new Date()) {
        const userRecord = await db.select().from(users).where(eq(users.id, session.userId)).limit(1).get();
        if (userRecord) {
          user = {
            id: userRecord.id,
            name: userRecord.name || "",
            email: userRecord.email
          };
        }
      }
    }
  } catch (e) {
    console.error("Auth check failed:", e);
  }
  if (!user) {
    return Astro.redirect("/login?redirect=/dashboard");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard - TIMORLIST" }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold">Dashboard</h1> <p class="text-muted-foreground">Welcome back, ${user.name}</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, { "class": "pb-2" }, { "default": async ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, { "class": "text-sm text-muted-foreground" }, { "default": async ($$result5) => renderTemplate`Quick Actions` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-2" }, { "default": async ($$result4) => renderTemplate`
          <a href="/account"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "class": "w-full justify-start"
  }, { "default": async ($$result5) => renderTemplate`My Account` })} </a>
          <a href="/business/create"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "class": "w-full justify-start"
  }, { "default": async ($$result5) => renderTemplate`Add Business` })} </a>
        ` })}
      ` })} </div> </div>
` })}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/dashboard.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/dashboard.astro";
const $$url = "/dashboard";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
