globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderSlot, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Card;
  const { class: className = "", "data-slot": slot = "card", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["rounded-xl border bg-card text-card-foreground shadow", className], "class:list")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/Card.astro", void 0);
export {
  $$Card as $
};
