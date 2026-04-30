globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderSlot, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$CardDescription = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$CardDescription;
  const { class: className = "", "data-slot": slot = "card-description", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<p${addAttribute(["text-sm text-muted-foreground", className], "class:list")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </p>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/CardDescription.astro", void 0);
export {
  $$CardDescription as $
};
