globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { n as renderHead, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
const prerender = false;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Admin Login - TIMORLIST</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body class="min-h-screen bg-background flex items-center justify-center p-4"> <div class="w-full max-w-md"> <!-- Logo --> <div class="text-center mb-8"> <a href="/admin" class="inline-flex items-center gap-2"> <div class="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center"> <span class="text-white font-bold text-xl">T</span> </div> </a> <h1 class="text-2xl font-bold mt-4">Admin Login</h1> <p class="text-muted-foreground mt-2">Sign in to manage the site</p> </div> <!-- Login Form --> <div class="bg-card border rounded-lg p-6"> <form id="login-form" class="space-y-4"> <div> <label for="email" class="block text-sm font-medium mb-1">Email</label> <input type="email" id="email" name="email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="admin@example.com"> </div> <div> <label for="password" class="block text-sm font-medium mb-1">Password</label> <input type="password" id="password" name="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••"> </div> <button type="submit" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity">
Sign In
</button> </form> <div id="error-message" class="mt-4 text-center text-red-500 text-sm hidden"></div> </div> <!-- Back to Site --> <div class="text-center mt-6"> <a href="/" class="text-sm text-muted-foreground hover:text-foreground">
← Back to Website
</a> </div> </div> </body> </html> ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/login.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/login.astro";
const $$url = "/admin/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
