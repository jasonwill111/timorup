globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
const prerender = false;
const $$Products = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Manage Products - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8"> <!-- Back Link --> <a href="/account" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Back to Account
</a> <!-- Loading --> <div id="loading" class="flex items-center justify-center min-h-[400px]"> <div class="text-center"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div> <p class="mt-4 text-muted-foreground">Loading...</p> </div> </div> <!-- Access Denied --> <div id="access-denied" class="hidden text-center py-12"> <h1 class="text-2xl font-bold mb-2">Access Denied</h1> <p class="text-muted-foreground mb-6">You don't have permission to manage this business.</p> <a href="/account"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`Go to My Account` })} </a> </div> <!-- Business Not Found --> <div id="not-found" class="hidden text-center py-12"> <h1 class="text-2xl font-bold mb-2">Business Not Found</h1> <p class="text-muted-foreground mb-6">The business you're looking for doesn't exist.</p> <a href="/account"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`Go to My Account` })} </a> </div> <!-- Main Content --> <div id="content" class="hidden"> <!-- Header --> <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"> <div> <h1 class="text-3xl font-bold" id="business-title">Products</h1> <p class="text-muted-foreground" id="business-subtitle">Manage your business products</p> </div> <div id="add-product-container"> <a id="add-product-btn" href="#" class="hidden"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": ($$result3) => renderTemplate`
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
              Add Product
            ` })} </a> </div> </div> <!-- Upgrade Banner (for trial users) --> <div id="upgrade-banner" class="hidden mb-6"> ${renderComponent($$result2, "Card", $$Card, { "class": "border-amber-500 bg-amber-50 dark:bg-amber-900/20" }, { "default": ($$result3) => renderTemplate`
          ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "p-4" }, { "default": ($$result4) => renderTemplate`
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> <div> <h3 class="font-semibold text-amber-800 dark:text-amber-200">Upgrade to Create Products</h3> <p class="text-sm text-amber-700 dark:text-amber-300">You're on a free trial. Upgrade to add products to your business.</p> </div> <a href="/account"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "class": "border-amber-500 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300"
  }, { "default": ($$result5) => renderTemplate`
                  View Plans
                ` })} </a> </div>
          ` })}
        ` })} </div> <!-- Products Grid --> <div id="products-section"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
          ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
            ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Your Products` })}
            ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Manage your products and services` })}
          ` })}
          ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
            <div id="products-loading" class="text-center py-8"> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> </div>
            <div id="products-empty" class="hidden text-center py-8"> <p class="text-muted-foreground mb-4">No products yet</p> <p class="text-sm text-muted-foreground">Add your first product to showcase what you offer</p> </div>
            <div id="products-list" class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> <!-- Products will be loaded here --> </div>
          ` })}
        ` })} </div> <!-- SKU Limit Warning --> <div id="sku-limit-warning" class="hidden mt-6"> ${renderComponent($$result2, "Card", $$Card, { "class": "border-orange-500 bg-orange-50 dark:bg-orange-900/20" }, { "default": ($$result3) => renderTemplate`
          ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "p-4" }, { "default": ($$result4) => renderTemplate`
            <p class="text-sm text-orange-700 dark:text-orange-300">
You've reached your product limit. Upgrade your plan to add more products.
</p>
          ` })}
        ` })} </div> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/products.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/products.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/products.astro";
const $$url = "/business/[slug]/products";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Products,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
