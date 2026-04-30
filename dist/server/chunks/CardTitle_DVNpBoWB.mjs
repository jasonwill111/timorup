globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderSlot, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$CardHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$CardHeader;
  const { class: className = "", "data-slot": slot = "card-header", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["flex flex-col space-y-1.5 p-6", className], "class:list")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/CardHeader.astro", void 0);
const $$CardTitle = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$CardTitle;
  const { class: className = "", "data-slot": slot = "card-title", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<h3${addAttribute(["text-2xl font-semibold leading-none tracking-tight", className], "class:list")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </h3>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/CardTitle.astro", void 0);
export {
  $$CardHeader as $,
  $$CardTitle as a
};
