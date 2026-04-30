globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import "./sequence_RDixOVvO.mjs";
const prerender = false;
const $$Create = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Create;
  const url = Astro.request.url.split("/business/create")[1] || "";
  return Astro.redirect("/listing/create" + url);
}, "/home/jasonwill/dev-projects/timorlist/src/pages/business/create.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/business/create.astro";
const $$url = "/business/create";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
