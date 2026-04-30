globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderSlot, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$Label = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Label;
  const { class: className = "", for: forAttr, id, "data-slot": slot = "label", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<label${addAttribute(["text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className], "class:list")}${addAttribute(forAttr, "for")}${addAttribute(id, "id")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </label>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/Label.astro", void 0);
export {
  $$Label as $
};
