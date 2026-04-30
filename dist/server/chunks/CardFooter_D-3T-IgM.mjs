globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderSlot, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$CardFooter = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$CardFooter;
  const { class: className = "", "data-slot": slot = "card-footer", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["flex items-center p-6 pt-0", className], "class:list")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/CardFooter.astro", void 0);
export {
  $$CardFooter as $
};
