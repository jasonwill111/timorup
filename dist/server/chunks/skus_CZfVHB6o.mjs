globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, B as unescapeHTML, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages } from "./index_CI1oSuTR.mjs";
import { S as SKU_SERVICE_TYPES } from "./constants_DMDpIXNi.mjs";
const prerender = false;
const $$Skus = createComponent(async ($$result, $$props, $$slots) => {
  const db = await getDb();
  const businesses = await db.select({
    id: businessPages.id,
    title: businessPages.title,
    entityType: businessPages.entityType
  }).from(businessPages).all();
  const businessOptions = businesses.map((b) => ({
    value: b.id,
    label: b.title,
    type: b.entityType
  }));
  const businessOptionsJson = JSON.stringify(businessOptions);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {
    "title": "SKUs / Products",
    "data-astro-cid-qlvzk37x": true
  }, { "default": async ($$result2) => renderTemplate`
  
  <script id="business-data" type="application/json">${unescapeHTML(businessOptionsJson)}<\/script>${maybeRenderHead()}<div class="container py-4 px-2 md:py-6" data-astro-cid-qlvzk37x> <!-- Page Header --> <div class="mb-4 md:mb-6" data-astro-cid-qlvzk37x> <h1 class="text-xl md:text-2xl font-bold" data-astro-cid-qlvzk37x>SKUs / Products</h1> <p class="text-sm text-muted-foreground" data-astro-cid-qlvzk37x>Manage products and services with flexible pricing</p> </div> <!-- SKUs List --> <div class="bg-card border rounded-lg p-3 md:p-4" data-astro-cid-qlvzk37x> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4" data-astro-cid-qlvzk37x> <h3 class="font-semibold text-sm md:text-base" data-astro-cid-qlvzk37x>All SKUs</h3> ${renderComponent($$result2, "Button", $$Button, {
    "id": "add-sku-btn",
    "class": "text-xs py-1 h-7 md:text-sm md:h-9",
    "data-astro-cid-qlvzk37x": true
  }, { "default": async ($$result3) => renderTemplate`+ Add SKU` })} </div> <div id="skus-list" class="space-y-2" data-astro-cid-qlvzk37x> <p class="text-center text-muted-foreground py-4 text-sm" data-astro-cid-qlvzk37x>Loading...</p> </div> </div> </div>

  
  <div id="sku-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4" data-astro-cid-qlvzk37x> <div class="bg-card border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" data-astro-cid-qlvzk37x> <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-card" data-astro-cid-qlvzk37x> <h2 id="modal-title" class="text-lg font-bold" data-astro-cid-qlvzk37x>Create SKU</h2> <button id="close-modal" class="p-1 hover:bg-muted rounded" data-astro-cid-qlvzk37x> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qlvzk37x></path> </svg> </button> </div> <form id="sku-form" class="p-4 space-y-4" data-astro-cid-qlvzk37x> <input type="hidden" id="sku-id" name="id" value="" data-astro-cid-qlvzk37x> <!-- Business --> <div data-astro-cid-qlvzk37x> <label for="sku-business" class="block text-sm font-medium mb-1" data-astro-cid-qlvzk37x>Business *</label> <select id="sku-business" name="businessPageId" required class="w-full px-3 py-2 border rounded-md text-sm" data-astro-cid-qlvzk37x> <option value="" data-astro-cid-qlvzk37x>Select a business...</option> </select> </div> <!-- Title --> <div data-astro-cid-qlvzk37x> <label for="sku-title" class="block text-sm font-medium mb-1" data-astro-cid-qlvzk37x>Product/Service Name *</label> <input type="text" id="sku-title" name="title" required class="w-full px-3 py-2 border rounded-md text-sm" placeholder="e.g., Hourly Massage Service" data-astro-cid-qlvzk37x> </div> <!-- Service Type --> <div data-astro-cid-qlvzk37x> <label for="sku-service-type" class="block text-sm font-medium mb-1" data-astro-cid-qlvzk37x>Service Type</label> <select id="sku-service-type" name="serviceType" class="w-full px-3 py-2 border rounded-md text-sm" data-astro-cid-qlvzk37x> ${SKU_SERVICE_TYPES.map((type) => renderTemplate`<option${addAttribute(type.value, "value")} data-astro-cid-qlvzk37x>${type.icon} ${type.label}</option>`)} </select> </div> <!-- Price Fields --> <div id="price-fields-container" data-field-count="1" data-astro-cid-qlvzk37x> <label class="block text-sm font-medium mb-2" data-astro-cid-qlvzk37x>Pricing Options</label> <div id="price-fields" class="space-y-2" data-astro-cid-qlvzk37x> <!-- Price fields will be added dynamically --> </div> <button type="button" id="add-price-field" class="mt-2 text-xs text-primary hover:underline" data-astro-cid-qlvzk37x>
+ Add another price option
</button> </div> <!-- Description - TipTap Editor --> <div data-astro-cid-qlvzk37x> <label class="block text-sm font-medium mb-1" data-astro-cid-qlvzk37x>Description</label> <div id="editor-toolbar" class="flex flex-wrap gap-1 p-2 border border-b-0 rounded-t-md bg-muted/30" data-astro-cid-qlvzk37x> <button type="button" data-command="toggleBold" class="toolbar-btn" title="Bold" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" data-astro-cid-qlvzk37x></path></svg> </button> <button type="button" data-command="toggleItalic" class="toolbar-btn" title="Italic" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4h-9 M14 20H5 M15 4L9 20" data-astro-cid-qlvzk37x></path></svg> </button> <button type="button" data-command="toggleUnderline" class="toolbar-btn" title="Underline" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4v6a6 6 0 0 0 12 0V4 M4 20h16" data-astro-cid-qlvzk37x></path></svg> </button> <div class="w-px bg-border mx-1" data-astro-cid-qlvzk37x></div> <button type="button" data-command="toggleHeading" data-level="1" class="toolbar-btn" title="Heading 1" data-astro-cid-qlvzk37x>H1</button> <button type="button" data-command="toggleHeading" data-level="2" class="toolbar-btn" title="Heading 2" data-astro-cid-qlvzk37x>H2</button> <div class="w-px bg-border mx-1" data-astro-cid-qlvzk37x></div> <button type="button" data-command="toggleBulletList" class="toolbar-btn" title="Bullet List" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" data-astro-cid-qlvzk37x></path></svg> </button> <button type="button" data-command="toggleOrderedList" class="toolbar-btn" title="Ordered List" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6h11 M10 12h11 M10 18h11 M4 6h1v4 M4 10h2 M4 14h2l-2 4h2" data-astro-cid-qlvzk37x></path></svg> </button> <button type="button" data-command="toggleBlockquote" class="toolbar-btn" title="Quote" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" data-astro-cid-qlvzk37x></path></svg> </button> <div class="w-px bg-border mx-1" data-astro-cid-qlvzk37x></div> <button type="button" data-command="undo" class="toolbar-btn" title="Undo" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H3" data-astro-cid-qlvzk37x></path></svg> </button> <button type="button" data-command="redo" class="toolbar-btn" title="Redo" data-astro-cid-qlvzk37x> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qlvzk37x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5h10" data-astro-cid-qlvzk37x></path></svg> </button> </div> <div id="tiptap-editor" class="prose-editor border rounded-b-md" data-placeholder="Brief description..." data-astro-cid-qlvzk37x></div> <input type="hidden" id="sku-description" name="description" value="" data-astro-cid-qlvzk37x> </div> <!-- Actions --> <div class="flex gap-2 justify-end pt-2" data-astro-cid-qlvzk37x> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "cancel-btn",
    "variant": "outline",
    "class": "text-xs py-1 h-8",
    "data-astro-cid-qlvzk37x": true
  }, { "default": async ($$result3) => renderTemplate`Cancel` })} ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "class": "text-xs py-1 h-8",
    "data-astro-cid-qlvzk37x": true
  }, { "default": async ($$result3) => renderTemplate`Save` })} </div> </form> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/skus.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/skus.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/skus.astro";
const $$url = "/admin/skus";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Skus,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
