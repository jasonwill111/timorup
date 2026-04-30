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
const $$Id = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Edit Business - TIMORLIST" }, { "default": ($$result2) => renderTemplate`
${renderScript($$result2, "/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro?astro&type=script&index=0&lang.ts")}${maybeRenderHead()}<div class="container max-w-3xl py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold">Edit Your Business</h1> <p class="text-muted-foreground mt-2">Update your business details</p> </div> <form id="business-form" class="space-y-8"> <!-- Media / Images --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Business Images` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Update images to make your business stand out` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-6" }, { "default": ($$result4) => renderTemplate`
          
          <div> <label class="block text-sm font-medium mb-2">Profile Image</label> <p class="text-xs text-muted-foreground mb-2">Recommended: 200x200px (circular)</p> <div id="profile-image-upload" class="border-2 border-dashed rounded-lg aspect-square w-full max-w-xs flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50 relative"> <img id="profile-preview" class="hidden w-full h-full object-cover rounded-full" alt="Profile"> <div id="profile-placeholder" class="text-center p-4"> <svg class="mx-auto h-10 w-10 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <p class="text-sm text-muted-foreground">Click to upload</p> </div> <input type="file" id="profileImage" name="profileImage" accept="image/jpeg,image/png,image/webp" class="hidden"> </div> </div>
          
          
          <div> <label class="block text-sm font-medium mb-2">Banner Image</label> <p class="text-xs text-muted-foreground mb-2">Recommended: 1200x400px</p> <div id="banner-image-upload" class="border-2 border-dashed rounded-lg aspect-[3/1] w-full flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50 relative"> <img id="banner-preview" class="hidden w-full h-full object-cover rounded-lg" alt="Banner"> <div id="banner-placeholder" class="text-center p-4"> <svg class="mx-auto h-10 w-10 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <p class="text-sm text-muted-foreground">Click to upload</p> </div> <input type="file" id="bannerImage" name="bannerImage" accept="image/jpeg,image/png,image/webp" class="hidden"> </div> </div>
        ` })}
      ` })} <!-- Basic Info --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Basic Information` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`The main details about your business` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
          <div> <label for="title" class="block text-sm font-medium mb-1">Business Name *</label> <input type="text" id="title" name="title" required class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Your business name"> </div>
          
          <div> <label for="slug" class="block text-sm font-medium mb-1">URL Slug *</label> <input type="text" id="slug" name="slug" required class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="your-business-name"> <p class="text-xs text-muted-foreground mt-1">URL: timorlist.com/business/your-business-name</p> </div>

          <div> <label for="category" class="block text-sm font-medium mb-1">Category *</label> <select id="category" name="categoryId" required class="w-full px-3 py-2 border rounded-lg bg-background"> <option value="">Select a category</option> </select> </div>
        ` })}
      ` })} <!-- Contact Info --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Contact Information` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`How customers can reach you` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": ($$result4) => renderTemplate`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="contactName" class="block text-sm font-medium mb-1">Contact Person</label> <input type="text" id="contactName" name="contactName" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="John Doe"> </div> <div> <label for="contactNumber" class="block text-sm font-medium mb-1">Phone Number</label> <div class="flex"> <span class="px-3 py-2 border border-r-0 rounded-l-lg bg-muted">+670</span> <input type="tel" id="contactNumber" name="contactNumber" class="flex-1 px-3 py-2 border rounded-r-lg bg-background" placeholder="7723XXXX"> </div> </div> </div>
          
          <div> <label for="email" class="block text-sm font-medium mb-1">Email</label> <input type="email" id="email" name="email" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="business@example.com"> </div>
          
          <div> <label for="address" class="block text-sm font-medium mb-1">Address</label> <textarea id="address" name="address" rows="2" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Street, City, Timor-Leste"></textarea> </div>
        ` })}
      ` })} <!-- About --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`About Your Business` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Tell customers more about what you offer` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
          <textarea id="aboutUs" name="aboutUs" rows="5" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Describe your business, products, and services..."></textarea>
        ` })}
      ` })} <!-- Tags --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": ($$result3) => renderTemplate`
        ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": ($$result4) => renderTemplate`
          ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": ($$result5) => renderTemplate`Tags` })}
          ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": ($$result5) => renderTemplate`Add keywords to help customers find you (3-5 tags)` })}
        ` })}
        ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": ($$result4) => renderTemplate`
          <input type="text" id="tags" name="tags" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="restaurant, cafe, coffee, wifi, parking">
          <p class="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
        ` })}
      ` })} <!-- Submit --> <div class="flex gap-4"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "submit",
    "size": "lg"
  }, { "default": ($$result3) => renderTemplate`Save Changes` })} <a href="/account"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "variant": "outline",
    "size": "lg"
  }, { "default": ($$result3) => renderTemplate`Cancel` })} </a> </div> </form> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro?astro&type=script&index=1&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/edit-business-page/[id].astro";
const $$url = "/edit-business-page/[id]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
