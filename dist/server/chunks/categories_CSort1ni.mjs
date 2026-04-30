globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Categories = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Categories" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"> <div> <h1 class="text-xl md:text-2xl font-bold">Categories</h1> <p class="text-sm text-muted-foreground">Manage categories by entity type (Business, Government, Non-Profit)</p> </div> ${renderComponent($$result2, "Button", $$Button, {
    "id": "add-category-btn",
    "class": "text-xs py-1 h-8 md:text-sm md:h-9"
  }, { "default": ($$result3) => renderTemplate`+ Add Category` })} </div> <!-- Stats Cards --> <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4"> <div class="bg-card border rounded-lg p-3 text-center"> <p class="text-xl md:text-2xl font-bold" id="stat-total">-</p> <p class="text-xs text-muted-foreground">Total</p> </div> <div class="bg-card border rounded-lg p-3 text-center"> <p class="text-xl md:text-2xl font-bold text-blue-600" id="stat-business">-</p> <p class="text-xs text-muted-foreground">Business</p> </div> <div class="bg-card border rounded-lg p-3 text-center"> <p class="text-xl md:text-2xl font-bold text-purple-600" id="stat-government">-</p> <p class="text-xs text-muted-foreground">Government</p> </div> <div class="bg-card border rounded-lg p-3 text-center"> <p class="text-xl md:text-2xl font-bold text-orange-600" id="stat-nonprofit">-</p> <p class="text-xs text-muted-foreground">Non-Profit</p> </div> </div> <!-- Filter --> <div class="bg-card border rounded-lg p-3 mb-4"> <div class="flex flex-col sm:flex-row gap-2"> <select id="entity-filter" class="h-9 px-3 rounded-md border bg-background text-sm"> <option value="">All Types</option> <option value="business">Business</option> <option value="government">Government</option> <option value="nonprofit">Non-Profit</option> </select> <select id="level-filter" class="h-9 px-3 rounded-md border bg-background text-sm"> <option value="">All Levels</option> <option value="parent">Industries (Top-level)</option> <option value="child">Sub-categories</option> </select> <select id="parent-filter" class="h-9 px-3 rounded-md border bg-background text-sm"> <option value="">All Parents</option> </select> <input type="search" id="search" placeholder="Search categories..." class="h-9 px-3 rounded-md border bg-background text-sm flex-1"> </div> </div> <!-- Categories List --> <div class="bg-card border rounded-lg"> <div class="overflow-x-auto"> <table class="w-full text-sm"> <thead class="bg-muted/50"> <tr> <th class="text-left p-3 font-medium">Category</th> <th class="text-left p-3 font-medium hidden md:table-cell">Entity</th> <th class="text-left p-3 font-medium hidden lg:table-cell">Level</th> <th class="text-left p-3 font-medium hidden lg:table-cell">Parent</th> <th class="text-left p-3 font-medium">Sort</th> <th class="text-right p-3 font-medium">Actions</th> </tr> </thead> <tbody id="categories-list"> <tr> <td colspan="6" class="text-center p-8 text-muted-foreground">Loading...</td> </tr> </tbody> </table> </div> </div> </div>

  
  <div id="category-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4 overflow-y-auto"> <div class="bg-card border rounded-lg w-full max-w-md my-8"> <div class="p-4 border-b flex items-center justify-between"> <h2 id="form-title" class="text-lg font-bold">Create Category</h2> <button id="close-modal" class="p-1 hover:bg-muted rounded"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="category-form" class="p-4 space-y-4"> <input type="hidden" id="cat-id"> <div> <label for="cat-name" class="block text-sm font-medium mb-1">Category Name *</label> <input type="text" id="cat-name" required class="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. Restaurants"> </div> <div> <label for="cat-slug" class="block text-sm font-medium mb-1">Slug *</label> <input type="text" id="cat-slug" required class="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. restaurants"> </div> <div> <label for="cat-entity-type" class="block text-sm font-medium mb-1">Entity Type *</label> <select id="cat-entity-type" required class="w-full px-3 py-2 border rounded-md text-sm"> <option value="business">Business</option> <option value="government">Government</option> <option value="nonprofit">Non-Profit</option> </select> <p class="text-xs text-muted-foreground mt-1">Category type determines which listings can use this category</p> </div> <div> <label for="cat-parent" class="block text-sm font-medium mb-1">Parent Industry</label> <select id="cat-parent" class="w-full px-3 py-2 border rounded-md text-sm"> <option value="">Top-level (Industry)</option> </select> <p class="text-xs text-muted-foreground mt-1">Leave empty for top-level industry categories</p> </div> <div class="grid grid-cols-3 gap-4"> <div> <label for="cat-icon" class="block text-sm font-medium mb-1">Icon (emoji)</label> <input type="text" id="cat-icon" class="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g. 🍽️" maxlength="4"> </div> <div class="col-span-2"> <label for="cat-image" class="block text-sm font-medium mb-1">Image URL</label> <input type="url" id="cat-image" class="w-full px-3 py-2 border rounded-md text-sm" placeholder="https://example.com/image.jpg"> </div> </div> <div> <label for="cat-sort" class="block text-sm font-medium mb-1">Sort Order</label> <input type="number" id="cat-sort" class="w-full px-3 py-2 border rounded-md text-sm" value="0" min="0"> </div> <div> <label for="cat-desc" class="block text-sm font-medium mb-1">Description</label> <textarea id="cat-desc" rows="2" class="w-full px-3 py-2 border rounded-md text-sm" placeholder="Brief description..."></textarea> </div> <div class="flex items-center gap-2"> <input type="checkbox" id="cat-active" checked class="rounded"> <label for="cat-active" class="text-sm">Active</label> </div> <div class="flex gap-2 justify-end pt-2"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "cancel-btn",
    "variant": "outline",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Cancel` })} ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "id": "submit-btn",
    "class": "text-xs py-1 h-8"
  }, { "default": ($$result3) => renderTemplate`Create` })} </div> </form> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/categories.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/categories.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/categories.astro";
const $$url = "/admin/categories";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
