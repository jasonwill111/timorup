globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate`
${renderScript($$result2, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6"> <h1 class="text-xl md:text-2xl font-bold">Dashboard</h1> </div> <!-- Stats Cards --> <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6"> <div class="bg-card border rounded-lg p-3 md:p-4 text-center"> <p class="text-xl md:text-3xl font-bold" id="stat-users">-</p> <p class="text-xs md:text-sm text-muted-foreground">Users</p> </div> <div class="bg-card border rounded-lg p-3 md:p-4 text-center"> <p class="text-xl md:text-3xl font-bold" id="stat-businesses">-</p> <p class="text-xs md:text-sm text-muted-foreground">Businesses</p> </div> <div class="bg-card border rounded-lg p-3 md:p-4 text-center"> <p class="text-xl md:text-3xl font-bold" id="stat-orders">-</p> <p class="text-xs md:text-sm text-muted-foreground">Orders</p> </div> <div class="bg-card border rounded-lg p-3 md:p-4 text-center"> <p class="text-xl md:text-3xl font-bold" id="stat-revenue">$0</p> <p class="text-xs md:text-sm text-muted-foreground">Revenue</p> </div> </div> <!-- Recent Orders --> <div class="bg-card border rounded-lg p-3 md:p-4"> <h3 class="font-semibold mb-2 text-sm md:text-base">Recent Orders</h3> <div id="orders-list" class="space-y-2"> <p class="text-center text-muted-foreground py-4 text-sm">Loading...</p> </div> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro?astro&type=script&index=1&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/index.astro";
const $$url = "/admin";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
