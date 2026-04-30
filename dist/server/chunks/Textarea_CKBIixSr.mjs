globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderSlot, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$Textarea = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Textarea;
  const { class: className = "", placeholder, disabled = false, readonly: readonlyAttr, required = false, name, id, rows = 4, "data-slot": slot = "textarea", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<textarea${addAttribute(["flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className], "class:list")}${addAttribute(placeholder, "placeholder")}${addAttribute(disabled, "disabled")}${addAttribute(readonlyAttr, "readonly")}${addAttribute(required, "required")}${addAttribute(name, "name")}${addAttribute(id, "id")}${addAttribute(rows, "rows")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}>
  ${renderSlot($$result, $$slots["default"])}
</textarea>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/Textarea.astro", void 0);
export {
  $$Textarea as $
};
