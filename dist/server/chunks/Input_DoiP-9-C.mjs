globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as spreadAttributes } from "./worker-entry_D6lIot5H.mjs";
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
const $$Input = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Input;
  const { type = "text", class: className = "", placeholder, disabled = false, readonly: readonlyAttr, required = false, name, id, value, "data-slot": slot = "input", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<input${addAttribute(type, "type")}${addAttribute(["flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className], "class:list")}${addAttribute(placeholder, "placeholder")}${addAttribute(disabled, "disabled")}${addAttribute(readonlyAttr, "readonly")}${addAttribute(required, "required")}${addAttribute(name, "name")}${addAttribute(id, "id")}${addAttribute(value, "value")}${addAttribute(slot, "data-slot")}${spreadAttributes(props)}>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/Input.astro", void 0);
export {
  $$Input as $
};
