globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
import { $ as $$Textarea } from "./Textarea_CKBIixSr.mjs";
import { db } from "./db_DBymDTwI.mjs";
import { d as categories } from "./index_CI1oSuTR.mjs";
import { E as ENTITY_TYPES, I as INDUSTRIES } from "./constants_DMDpIXNi.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const allCategories = await db.select().from(categories).all();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": "New Listing - Admin",
    "requireAuth": true,
    "adminOnly": true
  }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8 max-w-4xl"> <div class="mb-6"> <a href="/admin/listing" class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
← Back to Listings
</a> <h1 class="text-2xl font-bold">Create New Listing</h1> </div> <form id="listing-form" class="space-y-6"> <!-- Step 1: Select Type --> <div id="type-selector" class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">1. Select Listing Type</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> ${ENTITY_TYPES.map((type) => renderTemplate`<label class="type-option cursor-pointer"> <input type="radio" name="entityType"${addAttribute(type.value, "value")} class="sr-only peer"> <div class="p-4 rounded-lg border-2 border-muted peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:border-muted-foreground/30"> <div class="text-2xl mb-2"> ${type.value === "business" ? "🏪" : type.value === "government" ? "🏛️" : "❤️"} </div> <div class="font-medium">${type.label}</div> <div class="text-xs text-muted-foreground mt-1"> ${type.value === "business" && "Companies, shops, services"} ${type.value === "government" && "Government agencies, ministries"} ${type.value === "nonprofit" && "NGOs, charities, foundations"} </div> </div> </label>`)} </div> </div> <!-- Step 2: Basic Info --> <div id="basic-info" class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">2. Basic Information</h2> <div class="grid gap-4"> <div> <label class="block text-sm font-medium mb-1">Title *</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "title",
    "required": true,
    "placeholder": "Enter listing title"
  })} </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium mb-1">Category *</label> <select name="categoryId" required class="w-full h-10 px-3 rounded-md border border-input bg-background"> <option value="">Select category</option> ${allCategories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}>${cat.name}</option>`)} </select> </div> <!-- Industry selector for businesses only --> <div id="industry-field" class="hidden"> <label class="block text-sm font-medium mb-1">Industry</label> <select name="industry" class="w-full h-10 px-3 rounded-md border border-input bg-background"> <option value="">Select industry</option> ${Object.entries(INDUSTRIES).map(([key, group]) => renderTemplate`<optgroup${addAttribute(group.label, "label")}> ${group.items.map((item) => renderTemplate`<option${addAttribute(`${key}.${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`, "value")}> ${item} </option>`)} </optgroup>`)} </select> </div> </div> </div> </div> <!-- Step 3: Contact Info --> <div id="contact-info" class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">3. Contact Information</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium mb-1">Contact Name</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "contactName",
    "placeholder": "Contact person name"
  })} </div> <div class="grid grid-cols-3 gap-2"> <div> <label class="block text-sm font-medium mb-1">Code</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "countryCode",
    "value": "+670",
    "placeholder": "+670"
  })} </div> <div class="col-span-2"> <label class="block text-sm font-medium mb-1">Phone</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "contactNumber",
    "placeholder": "77000000"
  })} </div> </div> <div> <label class="block text-sm font-medium mb-1">Email</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "email",
    "type": "email",
    "placeholder": "contact@example.com"
  })} </div> <div> <label class="block text-sm font-medium mb-1">Website</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "registrationUrl",
    "placeholder": "https://..."
  })} </div> </div> <div class="mt-4"> <label class="block text-sm font-medium mb-1">Address</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "address",
    "placeholder": "Street address, Dili"
  })} </div> </div> <!-- Step 4: About --> <div id="about-section" class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">4. About</h2> <div> <label class="block text-sm font-medium mb-1">About Us</label> ${renderComponent($$result2, "Textarea", $$Textarea, {
    "name": "aboutUs",
    "rows": 4,
    "placeholder": "Describe your listing..."
  })} </div> <div class="mt-4"> <label class="block text-sm font-medium mb-1">Tags (comma separated)</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "tags",
    "placeholder": "restaurant, seafood, waterfront"
  })} </div> <div class="mt-4"> <label class="block text-sm font-medium mb-1">Year of Establishment</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "yearOfEstablishment",
    "type": "number",
    "placeholder": "2020",
    "min": "1900",
    "max": "2026"
  })} </div> </div> <!-- Submit --> <div class="flex items-center justify-end gap-4"> <a href="/admin/listing"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "variant": "outline"
  }, { "default": async ($$result3) => renderTemplate`Cancel` })} </a> ${renderComponent($$result2, "Button", $$Button, { "type": "submit" }, { "default": async ($$result3) => renderTemplate`Create Listing` })} </div> </form> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/new/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/new/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/new/index.astro";
const $$url = "/admin/listing/new";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
