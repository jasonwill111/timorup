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
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardFooter } from "./CardFooter_D-3T-IgM.mjs";
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-12"> <div class="max-w-md mx-auto"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, { "class": "text-center" }, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, { "class": "text-2xl" }, { "default": ($$result5) => renderTemplate`Welcome Back` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Sign in to your account to continue` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
          <form id="login-form" class="space-y-4"> <div> <label for="email" class="block text-sm font-medium mb-1">Email</label> ${renderComponent($$result4, "Input", $$Input, {
    "id": "email",
    "name": "email",
    "type": "email",
    "placeholder": "your@email.com",
    "required": true
  })} </div> <div> <label for="password" class="block text-sm font-medium mb-1">Password</label> ${renderComponent($$result4, "Input", $$Input, {
    "id": "password",
    "name": "password",
    "type": "password",
    "placeholder": "••••••••",
    "required": true
  })} </div> <div class="flex items-center justify-between"> <div class="flex items-center"> <input id="remember-me" name="rememberMe" type="checkbox" class="h-4 w-4 rounded border-gray-300"> <label for="remember-me" class="ml-2 text-sm text-muted-foreground">
Remember me
</label> </div> <a href="/forgot-password" class="text-sm text-muted-foreground hover:underline">
Forgot password?
</a> </div> ${renderComponent($$result4, "Button", $$Button, {
    "type": "submit",
    "class": "w-full"
  }, { "default": ($$result5) => renderTemplate`Sign In` })} </form>
          
          <div class="relative my-6"> <div class="absolute inset-0 flex items-center"> <div class="w-full border-t"></div> </div> <div class="relative flex justify-center text-xs uppercase"> <span class="bg-card px-2 text-muted-foreground">Or continue with</span> </div> </div>
          
          <div class="space-y-2"> <a href="/api/auth/sign-in/google" class="w-full"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "class": "w-full"
  }, { "default": ($$result5) => renderTemplate`
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24"> <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path> <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path> <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path> <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path> </svg>
                Continue with Google
              ` })} </a> <a href="/api/auth/sign-in/facebook" class="w-full"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "class": "w-full"
  }, { "default": ($$result5) => renderTemplate`
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg>
                Continue with Facebook
              ` })} </a> </div>
        ` })}
        ${renderComponent($$result3, "CardFooter", $$CardFooter, { "class": "justify-center" }, { "default": ($$result4) => renderTemplate`
          <p class="text-sm text-muted-foreground">
Don't have an account?
<a href="/register" class="text-primary hover:underline">Sign up</a> </p>
        ` })}
      ` })} </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/login.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/login.astro";
const $$url = "/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
