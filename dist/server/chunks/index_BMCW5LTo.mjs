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
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { E as ENTITY_TYPES, I as INDUSTRIES } from "./constants_DMDpIXNi.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Index;
  const { id } = Astro.params;
  const listing = await db.select().from(businessPages).where(eq(businessPages.id, id ?? "")).get();
  if (!listing) {
    return Astro.redirect("/admin/listing");
  }
  const allCategories = await db.select().from(categories).all();
  const tags = listing.tags ? JSON.parse(listing.tags) : [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": `Edit ${listing.title} - Admin`,
    "requireAuth": true,
    "adminOnly": true
  }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8 max-w-4xl"> <div class="mb-6"> <a href="/admin/listing" class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
← Back to Listings
</a> <div class="flex items-center justify-between"> <h1 class="text-2xl font-bold">Edit Listing</h1> <span${addAttribute(`px-2 py-0.5 text-xs rounded-full ${listing.status === "live" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`, "class")}> ${listing.status || "draft"} </span> </div> </div> <form id="listing-form" class="space-y-6"> <!-- Type (read-only) --> <div class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">Listing Type</h2> <div class="flex items-center gap-4"> <span class="text-3xl"> ${listing.entityType === "business" ? "🏪" : listing.entityType === "government" ? "🏛️" : "❤️"} </span> <div> <div class="font-medium">${ENTITY_TYPES.find((t) => t.value === listing.entityType)?.label || listing.entityType}</div> <div class="text-xs text-muted-foreground">Type cannot be changed after creation</div> </div> </div> <input type="hidden" name="entityType"${addAttribute(listing.entityType, "value")}> </div> <!-- Basic Info --> <div class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">Basic Information</h2> <div class="grid gap-4"> <div> <label class="block text-sm font-medium mb-1">Title *</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "title",
    "value": listing.title,
    "required": true
  })} </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium mb-1">Category *</label> <select name="categoryId" required class="w-full h-10 px-3 rounded-md border border-input bg-background"> ${allCategories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}${addAttribute(cat.id === listing.categoryId, "selected")}> ${cat.name} </option>`)} </select> </div> ${listing.entityType === "business" && renderTemplate`<div id="industry-field"> <label class="block text-sm font-medium mb-1">Industry</label> <select name="industry" class="w-full h-10 px-3 rounded-md border border-input bg-background"> <option value="">Select industry</option> ${Object.entries(INDUSTRIES).map(([key, group]) => renderTemplate`<optgroup${addAttribute(group.label, "label")}> ${group.items.map((item) => {
    const value = `${key}.${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    return renderTemplate`<option${addAttribute(value, "value")}${addAttribute(listing.industry === value, "selected")}> ${item} </option>`;
  })} </optgroup>`)} </select> </div>`} </div> </div> </div> <!-- Contact Info --> <div class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">Contact Information</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium mb-1">Contact Name</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "contactName",
    "value": listing.contactName || ""
  })} </div> <div class="grid grid-cols-3 gap-2"> <div> <label class="block text-sm font-medium mb-1">Code</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "countryCode",
    "value": listing.countryCode || "+670"
  })} </div> <div class="col-span-2"> <label class="block text-sm font-medium mb-1">Phone</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "contactNumber",
    "value": listing.contactNumber || ""
  })} </div> </div> <div> <label class="block text-sm font-medium mb-1">Email</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "email",
    "type": "email",
    "value": listing.email || ""
  })} </div> <div> <label class="block text-sm font-medium mb-1">Website</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "registrationUrl",
    "value": listing.registrationUrl || ""
  })} </div> </div> <div class="mt-4"> <label class="block text-sm font-medium mb-1">Address</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "address",
    "value": listing.address || ""
  })} </div> </div> <!-- About --> <div class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">About</h2> <div> <label class="block text-sm font-medium mb-1">About Us</label> ${renderComponent($$result2, "Textarea", $$Textarea, {
    "name": "aboutUs",
    "rows": 4
  }, { "default": async ($$result3) => renderTemplate`${listing.aboutUs || ""}` })} </div> <div class="mt-4"> <label class="block text-sm font-medium mb-1">Tags (comma separated)</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "tags",
    "value": tags.join(", ")
  })} </div> <div class="mt-4"> <label class="block text-sm font-medium mb-1">Year of Establishment</label> ${renderComponent($$result2, "Input", $$Input, {
    "name": "yearOfEstablishment",
    "type": "number",
    "value": listing.yearOfEstablishment || "",
    "min": "1900",
    "max": "2026"
  })} </div> </div> <!-- Status --> <div class="bg-card rounded-lg border p-6"> <h2 class="text-lg font-semibold mb-4">Status</h2> <div class="flex flex-wrap gap-4"> <label class="flex items-center gap-2"> <input type="radio" name="status" value="draft"${addAttribute(listing.status === "draft", "checked")}> <span>Draft</span> </label> <label class="flex items-center gap-2"> <input type="radio" name="status" value="live"${addAttribute(listing.status === "live", "checked")}> <span>Live</span> </label> <label class="flex items-center gap-2"> <input type="radio" name="status" value="suspended"${addAttribute(listing.status === "suspended", "checked")}> <span>Suspended</span> </label> </div> </div> <!-- Submit --> <div class="flex items-center justify-end gap-4"> <a href="/admin/listing"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "variant": "outline"
  }, { "default": async ($$result3) => renderTemplate`Cancel` })} </a> ${renderComponent($$result2, "Button", $$Button, { "type": "submit" }, { "default": async ($$result3) => renderTemplate`Save Changes` })} </div> </form> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/[id]/edit/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/[id]/edit/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/listing/[id]/edit/index.astro";
const $$url = "/admin/listing/[id]/edit";
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
