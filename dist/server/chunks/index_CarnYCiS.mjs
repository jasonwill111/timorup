globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Listing Management" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8"> <div class="flex items-center justify-between mb-6"> <div> <h1 class="text-2xl font-bold">Listing Management</h1> <p class="text-sm text-muted-foreground">Manage all listings (businesses, government, nonprofits)</p> </div> <a href="/admin/listing/new"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
          New Listing
        ` })} </a> </div> <!-- Stats --> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"> <div class="bg-card rounded-lg border p-4"> <div class="text-2xl font-bold" id="stat-total">-</div> <div class="text-xs text-muted-foreground">Total Listings</div> </div> <div class="bg-card rounded-lg border p-4"> <div class="text-2xl font-bold text-blue-600" id="stat-businesses">-</div> <div class="text-xs text-muted-foreground">Businesses</div> </div> <div class="bg-card rounded-lg border p-4"> <div class="text-2xl font-bold text-purple-600" id="stat-government">-</div> <div class="text-xs text-muted-foreground">Government</div> </div> <div class="bg-card rounded-lg border p-4"> <div class="text-2xl font-bold text-orange-600" id="stat-nonprofit">-</div> <div class="text-xs text-muted-foreground">Non-Profits</div> </div> </div> <!-- Filters --> <div class="flex flex-wrap gap-4 mb-6"> <select id="filter-type" class="h-10 px-3 rounded-md border border-input bg-background"> <option value="">All Types</option> <option value="business">Businesses</option> <option value="government">Government</option> <option value="nonprofit">Non-Profits</option> </select> <select id="filter-status" class="h-10 px-3 rounded-md border border-input bg-background"> <option value="">All Status</option> <option value="draft">Draft</option> <option value="live">Live</option> <option value="paid">Paid</option> <option value="expired">Expired</option> </select> <input id="search" type="search" placeholder="Search listings..." class="h-10 px-3 rounded-md border border-input bg-background w-64"> </div> <!-- Listings Table --> <div class="bg-card rounded-lg border overflow-hidden"> <table class="w-full"> <thead class="bg-muted/50"> <tr> <th class="text-left px-4 py-3 text-sm font-medium">Title</th> <th class="text-left px-4 py-3 text-sm font-medium">Type</th> <th class="text-left px-4 py-3 text-sm font-medium">Status</th> <th class="text-left px-4 py-3 text-sm font-medium">Likes</th> <th class="text-right px-4 py-3 text-sm font-medium">Actions</th> </tr> </thead> <tbody id="listings-body" class="divide-y"> <tr> <td colspan="5" class="text-center py-8 text-muted-foreground"> <div class="flex justify-center"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div> </div> </td> </tr> </tbody> </table> <div id="no-results" class="hidden text-center py-12 text-muted-foreground">
No listings found
</div> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/index.astro";
const $$url = "/admin/listing";
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
