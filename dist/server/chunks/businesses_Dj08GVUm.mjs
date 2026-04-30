globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Businesses = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Businesses" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6 flex items-center justify-between"> <h1 class="text-xl md:text-2xl font-bold">All Businesses</h1> ${renderComponent($$result2, "Button", $$Button, {
    "id": "add-business-btn",
    "class": "text-xs py-1 h-7 md:text-sm md:h-9"
  }, { "default": ($$result3) => renderTemplate`+ Add Business` })} </div> <!-- Businesses List --> <div class="bg-card border rounded-lg p-3 md:p-4"> <div id="businesses-list" class="space-y-2"> <p class="text-center text-muted-foreground py-4 text-sm">Loading...</p> </div> </div> </div>

  
  <div id="business-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4"> <div class="bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"> <div class="p-4 border-b flex items-center justify-between"> <h2 class="text-lg font-bold">Create Business</h2> <button id="close-modal" class="p-1 hover:bg-muted rounded"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="business-form" class="p-4 space-y-4"> <div> <label for="biz-title" class="block text-sm font-medium mb-1">Business Name *</label> <input type="text" id="biz-title" name="title" required class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="biz-slug" class="block text-sm font-medium mb-1">Slug *</label> <input type="text" id="biz-slug" name="slug" required class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="biz-email" class="block text-sm font-medium mb-1">Email</label> <input type="email" id="biz-email" name="email" class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="biz-phone" class="block text-sm font-medium mb-1">Phone</label> <input type="tel" id="biz-phone" name="phone" class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="biz-about" class="block text-sm font-medium mb-1">About Us</label> <div id="about-editor-container" class="min-h-[150px] border rounded-md overflow-hidden"></div> </div> <div> <label for="biz-updates" class="block text-sm font-medium mb-1">Latest Updates</label> <div id="updates-editor-container" class="min-h-[150px] border rounded-md overflow-hidden"></div> </div> <div class="flex gap-2 justify-end"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "cancel-btn",
    "variant": "outline",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Cancel` })} ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Create` })} </div> </form> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/businesses.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/businesses.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/businesses.astro";
const $$url = "/admin/businesses";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Businesses,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
