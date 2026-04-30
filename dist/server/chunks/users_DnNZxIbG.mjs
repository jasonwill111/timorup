globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Users = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Users" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6"> <h1 class="text-xl md:text-2xl font-bold">All Users</h1> <p class="text-sm text-muted-foreground mt-1">Manage registered users</p> </div> <!-- Users List --> <div class="bg-card border rounded-lg p-3 md:p-4"> <div class="flex items-center justify-between mb-4"> <h3 class="font-semibold text-sm md:text-base">Users</h3> <span id="users-count" class="text-xs text-muted-foreground">Loading...</span> </div> <div id="users-list" class="space-y-2"> <p class="text-center text-muted-foreground py-4 text-sm">Loading...</p> </div> </div> </div>

  
  <div id="edit-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4"> <div class="bg-card border rounded-lg w-full max-w-md"> <div class="p-4 border-b flex items-center justify-between"> <h2 class="text-lg font-bold">Edit User</h2> <button id="close-modal" class="p-1 hover:bg-muted rounded"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="user-form" class="p-4 space-y-4"> <input type="hidden" id="user-id" name="id"> <div> <label for="user-name" class="block text-sm font-medium mb-1">Name *</label> <input type="text" id="user-name" name="name" required class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="user-email" class="block text-sm font-medium mb-1">Email *</label> <input type="email" id="user-email" name="email" required class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="user-phone" class="block text-sm font-medium mb-1">Phone</label> <input type="text" id="user-phone" name="phone" class="w-full px-3 py-2 border rounded-md text-sm"> </div> <div> <label for="user-role" class="block text-sm font-medium mb-1">Role</label> <select id="user-role" name="role" class="w-full px-3 py-2 border rounded-md text-sm"> <option value="user">User</option> <option value="editor">Editor</option> <option value="admin">Admin</option> </select> </div> <div class="flex gap-2 justify-end pt-2"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "cancel-btn",
    "variant": "outline",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Cancel` })} ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Save` })} </div> </form> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/users.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/users.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/users.astro";
const $$url = "/admin/users";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Users,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
