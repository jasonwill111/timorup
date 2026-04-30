globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Settings = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Settings" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6"> <h1 class="text-xl md:text-2xl font-bold">Site Settings</h1> </div> <!-- Settings Form --> <div class="bg-card border rounded-lg p-3 md:p-4"> <h3 class="font-semibold mb-3 text-sm md:text-base">General Settings</h3> <form id="settings-form" class="space-y-3"> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"> <div> <label for="site-name" class="block text-xs md:text-sm font-medium mb-1">Site Name</label> <input type="text" id="site-name" class="w-full px-2 py-1.5 md:py-2 text-sm border rounded"> </div> <div> <label for="contact-email" class="block text-xs md:text-sm font-medium mb-1">Contact Email</label> <input type="email" id="contact-email" class="w-full px-2 py-1.5 md:py-2 text-sm border rounded"> </div> <div> <label for="contact-phone" class="block text-xs md:text-sm font-medium mb-1">Contact Phone</label> <input type="tel" id="contact-phone" class="w-full px-2 py-1.5 md:py-2 text-sm border rounded"> </div> <div> <label for="payment-info" class="block text-xs md:text-sm font-medium mb-1">Payment QR</label> <input type="text" id="payment-info" class="w-full px-2 py-1.5 md:py-2 text-sm border rounded" placeholder="/images/qr.png"> </div> </div> ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "class": "text-xs py-1 h-7 md:text-sm md:h-9"
  }, { "default": ($$result3) => renderTemplate`Save` })} </form> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/settings.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/settings.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/settings.astro";
const $$url = "/admin/settings";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
