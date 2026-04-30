globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, b as renderTemplate, r as renderSlot } from "./sequence_RDixOVvO.mjs";
import { s as spreadAttributes, r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Icon;
  const { color = "currentColor", size = 24, "stroke-width": strokeWidth = 2, absoluteStrokeWidth = false, iconNode = [], class: className, ...rest } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes({
    ...defaultAttributes,
    width: size,
    height: size,
    stroke: color,
    "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
    ...!hasA11yProp(rest) && { "aria-hidden": "true" },
    ...rest
  })}${addAttribute(["lucide", className], "class:list")}> ${iconNode.map(([Tag, attrs]) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs })}`)} ${renderSlot($$result, $$slots["default"])} </svg>`;
}, "/home/jasonwill/dev-projects/timorlist/node_modules/.pnpm/@lucide+astro@1.14.0_astro@6.1.10_@types+node@25.6.0_jiti@2.6.1_lightningcss@1.32.0_rollup@4._dqft63ih4eca2q4bbjlp5iqbom/node_modules/@lucide/astro/src/Icon.astro", void 0);
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const createLucideIcon = (iconName, iconNode) => {
  const Component = createComponent(
    ($$result, $$props, $$slots) => {
      const { class: className, ...restProps } = $$props;
      return renderTemplate`${renderComponent(
        $$result,
        "Icon",
        $$Icon,
        {
          class: mergeClasses(
            Boolean(iconName) && `lucide-${toKebabCase(iconName)}`,
            Boolean(className) && className
          ),
          iconNode,
          ...restProps
        },
        { default: () => renderTemplate`${renderSlot($$result, $$slots["default"])}` }
      )}`;
    },
    void 0,
    "none"
  );
  return Component;
};
const Share2 = createLucideIcon("share-2", [["circle", { "cx": "18", "cy": "5", "r": "3" }], ["circle", { "cx": "6", "cy": "12", "r": "3" }], ["circle", { "cx": "18", "cy": "19", "r": "3" }], ["line", { "x1": "8.59", "x2": "15.42", "y1": "13.51", "y2": "17.49" }], ["line", { "x1": "15.41", "x2": "8.59", "y1": "6.51", "y2": "10.49" }]]);
export {
  Share2 as S,
  createLucideIcon as c
};
