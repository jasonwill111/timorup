globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Heroes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Hero Sections" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6"> <h1 class="text-xl md:text-2xl font-bold">Hero Sections</h1> <p class="text-sm text-muted-foreground mt-1">Manage homepage hero banners</p> </div> <!-- Heroes List --> <div class="bg-card border rounded-lg p-3 md:p-4"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4"> <h3 class="font-semibold text-sm md:text-base">All Heroes</h3> ${renderComponent($$result2, "Button", $$Button, {
    "id": "add-hero-btn",
    "class": "text-xs py-1 h-7 md:text-sm md:h-9"
  }, { "default": ($$result3) => renderTemplate`+ Add Hero` })} </div> <div id="heroes-list" class="space-y-2"> <p class="text-center text-muted-foreground py-4 text-sm">Loading...</p> </div> </div> </div>

  
  <div id="hero-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4"> <div class="bg-card border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"> <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-card"> <h2 id="modal-title" class="text-lg font-bold">Add Hero</h2> <button id="close-modal" class="p-1 hover:bg-muted rounded"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="hero-form" class="p-4 space-y-4"> <input type="hidden" id="hero-id" name="id"> <div> <label for="hero-title" class="block text-sm font-medium mb-1">Title *</label> <input type="text" id="hero-title" name="title" required class="w-full px-3 py-2 border rounded-md text-sm" placeholder="Hero title"> </div> <div> <label for="hero-desc" class="block text-sm font-medium mb-1">Description</label> <textarea id="hero-desc" name="description" rows="2" class="w-full px-3 py-2 border rounded-md text-sm" placeholder="Hero description..."></textarea> </div> <div> <label for="hero-image" class="block text-sm font-medium mb-1">Image URL</label> <input type="text" id="hero-image" name="imageId" class="w-full px-3 py-2 border rounded-md text-sm" placeholder="/images/banner.jpg"> </div> <div> <label for="hero-ext-url" class="block text-sm font-medium mb-1">External URL</label> <input type="text" id="hero-ext-url" name="externalUrl" class="w-full px-3 py-2 border rounded-md text-sm" placeholder="https://..."> </div> <div> <label for="hero-business" class="block text-sm font-medium mb-1">Link to Business Page</label> <select id="hero-business" name="linkedBusinessPageId" class="w-full px-3 py-2 border rounded-md text-sm"> <option value="">None</option> </select> </div> <div class="flex items-center gap-2"> <input type="checkbox" id="hero-active" name="isActive" checked class="w-4 h-4"> <label for="hero-active" class="text-sm">Active</label> </div> <div class="flex gap-2 justify-end pt-2"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "cancel-btn",
    "variant": "outline",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Cancel` })} ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Save` })} </div> </form> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/heroes.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/heroes.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/heroes.astro";
const $$url = "/admin/heroes";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Heroes,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
