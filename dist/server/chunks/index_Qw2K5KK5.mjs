globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Edit Business - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
  
  <link rel="stylesheet" href="https://unpkg.com/@tiptap/core@3.22.3/dist/tiptap.min.css">
  ${maybeRenderHead()}<div class="container py-12"> <div class="max-w-4xl mx-auto"> <h1 class="text-3xl font-bold mb-2">Edit Business</h1> <p class="text-muted-foreground mb-8">Update your business information</p> <!-- Loading state --> <div id="loading-state" class="text-center py-20"> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> <p class="text-muted-foreground mt-2">Loading your business...</p> </div> <!-- Not found / unauthorized --> <div id="not-found-state" class="hidden text-center py-20"> <p class="text-muted-foreground mb-4">Business not found or you don't have permission to edit it.</p> <a href="/account"> ${renderComponent($$result2, "Button", $$Button, { "variant": "outline" }, { "default": ($$result3) => renderTemplate`Back to Account` })} </a> </div> <!-- Edit form --> <div id="edit-form-container" class="hidden"> <form id="business-form" class="space-y-8"> <!-- Basic Info --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Basic Information` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`The main details about your business` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
              <div> <label for="title" class="block text-sm font-medium mb-1">Business Name *</label> <input type="text" id="title" name="title" required class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Your business name"> </div>

              <div> <label for="slug" class="block text-sm font-medium mb-1">URL Slug *</label> <input type="text" id="slug" name="slug" required class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="your-business-name"> <p class="text-xs text-muted-foreground mt-1">This will be your URL: timorlist.com/business/your-business-name</p> </div>

              <div> <label for="category" class="block text-sm font-medium mb-1">Category *</label> <select id="category" name="categoryId" required class="w-full px-3 py-2 border rounded-lg bg-background"> <option value="">Select a category</option> </select> </div>
            ` })}
          ` })} <!-- Contact Info --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Contact Information` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`How customers can reach you` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="contactName" class="block text-sm font-medium mb-1">Contact Person</label> <input type="text" id="contactName" name="contactName" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Your name"> </div> <div> <label for="contactNumber" class="block text-sm font-medium mb-1">Phone Number</label> <input type="tel" id="contactNumber" name="contactNumber" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="+670 7x xxx xxx"> </div> </div>

              <div> <label for="email" class="block text-sm font-medium mb-1">Email</label> <input type="email" id="email" name="email" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="business@email.com"> </div>

              <div> <label for="address" class="block text-sm font-medium mb-1">Address</label> <textarea id="address" name="address" rows="2" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Your business address"></textarea> </div>

              
              <div class="mt-4"> <label class="block text-sm font-medium mb-2">Business Location</label> <p class="text-xs text-muted-foreground mb-2">Click on the map to set your location, or enter coordinates manually</p> <div id="map-container" class="h-64 rounded-lg border mb-3" style="min-height: 250px;"> <div id="map-placeholder" class="h-full flex items-center justify-center bg-muted rounded-lg"> <p class="text-muted-foreground">Loading map...</p> </div> <div id="map" class="hidden h-full rounded-lg" style="min-height: 250px;"></div> </div> <div class="grid grid-cols-2 gap-3"> <div> <label for="latitude" class="block text-xs font-medium mb-1">Latitude</label> <input type="number" id="latitude" name="latitude" step="any" class="w-full px-3 py-2 border rounded-lg bg-background text-sm" placeholder="-8.5569"> </div> <div> <label for="longitude" class="block text-xs font-medium mb-1">Longitude</label> <input type="number" id="longitude" name="longitude" step="any" class="w-full px-3 py-2 border rounded-lg bg-background text-sm" placeholder="125.5603"> </div> </div> <button type="button" id="get-coords-btn" class="mt-2 text-sm text-primary hover:underline">
Get coordinates from address
</button> </div>
            ` })}
          ` })} <!-- About --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`About Your Business` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Tell customers more about what you do` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
              <div> <label for="aboutUs" class="block text-sm font-medium mb-1">About Us</label> <div id="aboutUs-editor"></div> <input type="hidden" id="aboutUs" name="aboutUs"> </div>
            ` })}
          ` })} <!-- Opening Hours --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Opening Hours` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Set your business hours` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-3" }, { "default": ($$result4) => renderTemplate`
              <p class="text-xs text-muted-foreground">Leave time empty or check "Closed" for days you're not open</p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm" id="hours-container"> <!-- Hours will be generated by JavaScript --> </div>
            ` })}
          ` })} <!-- Additional Info --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Additional Details` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
              <div> <label for="yearOfEstablishment" class="block text-sm font-medium mb-1">Year Established</label> <input type="number" id="yearOfEstablishment" name="yearOfEstablishment" min="1900" max="2100" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="2020"> </div>

              <div> <label for="tags" class="block text-sm font-medium mb-1">Tags</label> <input type="text" id="tags" name="tags" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="restaurant, cafe, coffee (comma separated)"> </div>
            ` })}
          ` })} <!-- Social Links --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Social Media Links` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
              <div> <label for="facebookUrl" class="block text-sm font-medium mb-1"> <span class="inline-flex items-center gap-2"> <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg>
Facebook
</span> </label> <input type="url" id="facebookUrl" name="facebookUrl" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="https://facebook.com/yourpage"> </div>

              <div> <label for="instagramUrl" class="block text-sm font-medium mb-1"> <span class="inline-flex items-center gap-2"> <svg class="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path> </svg>
Instagram
</span> </label> <input type="url" id="instagramUrl" name="instagramUrl" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="https://instagram.com/yourpage"> </div>

              <div> <label for="tiktokUrl" class="block text-sm font-medium mb-1"> <span class="inline-flex items-center gap-2"> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"> <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path> </svg>
TikTok
</span> </label> <input type="url" id="tiktokUrl" name="tiktokUrl" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="https://tiktok.com/@yourpage"> </div>
            ` })}
          ` })} <!-- Latest Update --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Latest Update` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Share news or announcements (updates weekly)` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
              <div> <label for="latestUpdate" class="block text-sm font-medium mb-1">Update Message</label> <textarea id="latestUpdate" name="latestUpdate" rows="3" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Share your latest news, promotions, or announcements..." maxlength="500"></textarea> <p class="text-xs text-muted-foreground mt-1">Max 500 characters. Can be updated once per week.</p> <p id="update-cooldown" class="text-xs text-muted-foreground mt-1 hidden"></p> </div>
            ` })}
          ` })} <!-- Photo Gallery --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Photo Gallery` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Add up to 6 photos to showcase your business` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
              <div id="gallery-upload-area" class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"> <input type="file" id="gallery-files" accept="image/*" multiple class="hidden"> <svg class="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <p class="text-muted-foreground mb-2">Click or drag photos here</p> <p class="text-xs text-muted-foreground">JPG, PNG up to 5MB each (max 6 photos)</p> </div>
              <div id="gallery-preview" class="grid grid-cols-3 gap-2"></div>
              <input type="hidden" id="gallery-media-ids" name="galleryMediaIds">
            ` })}
          ` })} <!-- Submit --> <div class="flex gap-4"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "id": "submit-btn"
  }, { "default": ($$result3) => renderTemplate`Save Changes` })} <a id="cancel-link" href="#"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "variant": "outline"
  }, { "default": ($$result3) => renderTemplate`Cancel` })} </a> </div> </form> </div> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/edit/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/edit/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/edit/index.astro";
const $$url = "/business/[slug]/edit";
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
