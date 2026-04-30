globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
const prerender = false;
const $$Search = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Search Businesses - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container max-w-6xl py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold">Search Results</h1> <p class="text-muted-foreground mt-2">Find businesses in Timor-Leste</p> </div> <!-- Search Form --> <form id="search-form" class="mb-8"> <div class="flex gap-4"> ${renderComponent($$result2, "Input", $$Input, {
    "type": "search",
    "id": "search-input",
    "name": "q",
    "placeholder": "Search businesses, services, products...",
    "class": "flex-1 text-lg py-6"
  })} ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "size": "lg"
  }, { "default": ($$result3) => renderTemplate`Search` })} </div> </form> <!-- Results --> <div id="search-results"> <p class="text-muted-foreground text-center py-8">
Enter a search term to find businesses
</p> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/search.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/search.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/search.astro";
const $$url = "/search";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
