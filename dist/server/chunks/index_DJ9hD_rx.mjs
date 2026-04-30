globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
import { $ as $$Label } from "./Label_BH1np9f-.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Add Product - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  
  <link rel="stylesheet" href="https://unpkg.com/@tiptap/core@3.22.3/dist/tiptap.min.css">
  ${maybeRenderHead()}<div class="container py-8"> <!-- Back Link --> <a id="back-link" href="#" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Back to Products
</a> <!-- Loading --> <div id="loading" class="flex items-center justify-center min-h-[400px]"> <div class="text-center"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div> <p class="mt-4 text-muted-foreground">Loading...</p> </div> </div> <!-- Access Denied --> <div id="access-denied" class="hidden text-center py-12"> <h1 class="text-2xl font-bold mb-2">Access Denied</h1> <p class="text-muted-foreground mb-6">You don't have permission to manage this business.</p> <a href="/account"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`Go to My Account` })} </a> </div> <!-- Not Found --> <div id="not-found" class="hidden text-center py-12"> <h1 class="text-2xl font-bold mb-2">Business Not Found</h1> <p class="text-muted-foreground mb-6">The business you're looking for doesn't exist.</p> <a href="/account"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`Go to My Account` })} </a> </div> <!-- Upgrade Required --> <div id="upgrade-required" class="hidden text-center py-12"> <h1 class="text-2xl font-bold mb-2">Upgrade Required</h1> <p class="text-muted-foreground mb-2">You need an active subscription to create products.</p> <p class="text-sm text-amber-600 mb-6">You're on a free trial. Upgrade to add products.</p> <a href="/pricing"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`View Plans` })} </a> </div> <!-- SKU Limit Reached --> <div id="sku-limit" class="hidden text-center py-12"> <h1 class="text-2xl font-bold mb-2">Product Limit Reached</h1> <p class="text-muted-foreground mb-6">You have reached your product limit. Upgrade your plan to add more products.</p> <a href="/pricing"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`View Plans` })} </a> </div> <!-- Main Content --> <div id="content" class="hidden"> ${renderComponent($$result2, "Card", $$Card, { "class": "max-w-2xl mx-auto" }, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Add New Product` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Create a new product or service for your business` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
          <form id="product-form" class="space-y-6"> <!-- Product Name --> <div> ${renderComponent($$result4, "Label", $$Label, { "for": "title" }, { "default": ($$result5) => renderTemplate`Product Name *` })} ${renderComponent($$result4, "Input", $$Input, {
    "id": "title",
    "name": "title",
    "placeholder": "e.g., Professional Photography Service",
    "required": true
  })} </div> <!-- Price --> <div> ${renderComponent($$result4, "Label", $$Label, { "for": "price" }, { "default": ($$result5) => renderTemplate`Price *` })} ${renderComponent($$result4, "Input", $$Input, {
    "id": "price",
    "name": "price",
    "type": "text",
    "placeholder": "e.g., $150",
    "required": true
  })} <p class="text-xs text-muted-foreground mt-1">Enter price in USD or local currency</p> </div> <!-- Description --> <div> ${renderComponent($$result4, "Label", $$Label, { "for": "description" }, { "default": ($$result5) => renderTemplate`Description` })} <div id="description-editor"></div> <input type="hidden" id="description" name="description" value=""> </div> <!-- Product Images --> <div> ${renderComponent($$result4, "Label", $$Label, {}, { "default": ($$result5) => renderTemplate`Product Images (up to 4)` })} <div id="image-upload-area" class="mt-2"> <div class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer" id="upload-trigger"> <svg class="w-10 h-10 mx-auto text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <p class="text-sm text-muted-foreground">Click to upload images</p> <p class="text-xs text-muted-foreground mt-1">JPG, PNG, WebP - Max 5MB each</p> </div> <input type="file" id="file-input" accept="image/*" multiple class="hidden"> </div> <!-- Image Preview --> <div id="image-preview" class="grid grid-cols-4 gap-2 mt-4"></div> <input type="hidden" id="media-ids" name="mediaIds" value=""> </div> <!-- Error Message --> <div id="error-message" class="hidden bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"> <p class="text-sm text-red-600 dark:text-red-400" id="error-text"></p> </div> <!-- Submit --> <div class="flex gap-3"> ${renderComponent($$result4, "Button", $$Button, {
    "type": "submit",
    "class": "flex-1"
  }, { "default": ($$result5) => renderTemplate`Create Product` })} ${renderComponent($$result4, "Button", $$Button, {
    "type": "button",
    "variant": "outline",
    "id": "cancel-btn"
  }, { "default": ($$result5) => renderTemplate`Cancel` })} </div> </form>
        ` })}
      ` })} </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/new/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/new/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/new/index.astro";
const $$url = "/business/[slug]/product/new";
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
