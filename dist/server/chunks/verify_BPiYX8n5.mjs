globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
import { $ as $$CardFooter } from "./CardFooter_D-3T-IgM.mjs";
const prerender = false;
const $$Verify = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Verify Email - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container max-w-md py-16"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
      ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
        ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Email Verification` })}
        ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Verify your email address to activate your account` })}
      ` })}
      ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
        <div id="verification-status" class="text-center py-4"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div> <p class="text-muted-foreground">Verifying your email...</p> </div>
      ` })}
      ${renderComponent($$result3, "CardFooter", $$CardFooter, { "class": "justify-center" }, { "default": ($$result4) => renderTemplate`
        <a href="/login" class="text-sm text-muted-foreground hover:text-primary">
Back to Login
</a>
      ` })}
    ` })} </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/verify.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/verify.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/verify.astro";
const $$url = "/verify";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Verify,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
