globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
const prerender = false;
const $$ForgotPassword = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Forgot Password - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-12"> <div class="max-w-md mx-auto"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, { "class": "text-center" }, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, { "class": "text-2xl" }, { "default": ($$result5) => renderTemplate`Forgot Password?` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Enter your email address and we'll send you a link to reset your password` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
          <form id="forgot-password-form" class="space-y-4"> <div> <label for="email" class="block text-sm font-medium mb-1">Email Address</label> ${renderComponent($$result4, "Input", $$Input, {
    "id": "email",
    "name": "email",
    "type": "email",
    "placeholder": "your@email.com",
    "required": true
  })} </div> ${renderComponent($$result4, "Button", $$Button, {
    "type": "submit",
    "class": "w-full"
  }, { "default": ($$result5) => renderTemplate`Send Reset Link` })} </form>
          
          <div id="message" class="mt-4 p-3 rounded-md hidden"></div>
        ` })}
        <div class="flex justify-center p-6 pt-0"> <a href="/login" class="text-sm text-muted-foreground hover:underline">
Back to Login
</a> </div>
      ` })} </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/forgot-password.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/forgot-password.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/forgot-password.astro";
const $$url = "/forgot-password";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ForgotPassword,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
