globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, B as unescapeHTML, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { p as products, b as businessPages, g as productImages, d as categories } from "./index_CI1oSuTR.mjs";
import { c as createLucideIcon, S as Share2 } from "./share-2_CazVIpvB.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const ArrowLeft = createLucideIcon("arrow-left", [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]]);
const ArrowRight = createLucideIcon("arrow-right", [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]]);
const ChevronLeft = createLucideIcon("chevron-left", [["path", { "d": "m15 18-6-6 6-6" }]]);
const ChevronRight = createLucideIcon("chevron-right", [["path", { "d": "m9 18 6-6-6-6" }]]);
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const db = await getDb();
  const { slug } = Astro2.params;
  const pathParts = Astro2.url.pathname.split("/").filter(Boolean);
  const productIdIndex = pathParts.indexOf("product");
  const productId = productIdIndex >= 0 ? pathParts[productIdIndex + 1] : "";
  const siteUrl = "https://timorlist.com";
  const product = productId ? await db.select().from(products).where(eq(products.id, productId)).get() : null;
  if (!product) {
    return Astro2.redirect("/businesses");
  }
  const business = await db.select().from(businessPages).where(eq(businessPages.id, product.businessPageId)).get();
  if (!business || business.slug !== slug) {
    return Astro2.redirect(`/business/${business?.slug || ""}`);
  }
  const images = await db.select().from(productImages).where(eq(productImages.productId, productId)).all();
  const category = business.categoryId ? await db.select().from(categories).where(eq(categories.id, business.categoryId)).get() : null;
  const canonicalUrl = `${siteUrl}/business/${slug}/product/${productId}`;
  const pageTitle = `${product.title} - TIMORLIST`;
  const pageDesc = product.description?.substring(0, 160) || `${product.title} - ${business.title}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": pageTitle,
    "description": pageDesc,
    "canonical": canonicalUrl
  }, { "default": async ($$result2) => renderTemplate`
  
  <script type="application/ld+json">${unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "url": canonicalUrl,
    "image": images.map((img) => `/api/media/${img.mediaId}`),
    "offers": product.price ? {
      "@type": "Offer",
      "price": product.price.replace(/[^0-9.]/g, ""),
      "priceCurrency": "USD"
    } : void 0,
    "seller": {
      "@type": "LocalBusiness",
      "name": business.title
    }
  }))}<\/script>${maybeRenderHead()}<div class="bg-background min-h-screen pb-20"> <!-- Header --> <div class="sticky top-0 z-50 bg-background border-b"> <div class="container"> <a${addAttribute(`/business/${slug}`, "href")} class="flex items-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors"> ${renderComponent($$result2, "ArrowLeft", ArrowLeft, { "class": "w-5 h-5" })}
Back to ${business.title} </a> </div> </div> <div class="container py-6"> <div class="max-w-4xl mx-auto"> <!-- Image Carousel --> <div class="mb-6"> <!-- Main Image - smaller, scrollable --> <div class="max-w-2xl mx-auto"> <div id="main-image" class="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted"> ${images.length > 0 ? renderTemplate`<img id="current-image"${addAttribute(`/api/media/${images[0]?.mediaId}`, "src")}${addAttribute(product.title, "alt")} class="w-full h-full object-cover">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-6xl font-bold text-muted-foreground bg-gradient-to-br from-amber-100 to-amber-200"> ${product.title.charAt(0)} </div>`} </div> </div> <!-- Thumbnail Navigation (if multiple images) --> ${images.length > 1 && renderTemplate`<div class="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide"> <button id="scroll-left" class="flex-shrink-0 w-10 h-20 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"> ${renderComponent($$result2, "ChevronLeft", ChevronLeft, { "class": "w-5 h-5" })} </button> ${images.map((img, index) => renderTemplate`<button${addAttribute(`thumbnail-btn w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${index === 0 ? "border-primary" : "border-transparent hover:border-muted-foreground/30"}`, "class")}${addAttribute(index, "data-index")}> <img${addAttribute(`/api/media/${img.mediaId}`, "src")} alt="" class="w-full h-full object-cover"> </button>`)} <button id="scroll-right" class="flex-shrink-0 w-10 h-20 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"> ${renderComponent($$result2, "ChevronRight", ChevronRight, { "class": "w-5 h-5" })} </button> </div>`} <!-- Image Counter --> ${images.length > 1 && renderTemplate`<div class="flex justify-center gap-1 mt-3"> ${images.map((_, index) => renderTemplate`<span${addAttribute(`image-dot w-2 h-2 rounded-full transition-colors ${index === 0 ? "bg-amber-500" : "bg-gray-300"}`, "class")}></span>`)} </div>`} </div> <!-- Product Info --> <div class="mb-6"> <h1 class="text-2xl md:text-3xl font-bold mb-2">${product.title}</h1> ${product.price && renderTemplate`<p class="text-2xl font-semibold text-primary">${product.price}</p>`} </div> <!-- Actions --> <div class="flex gap-3 mb-6"> ${business.contactNumber ? renderTemplate`<a${addAttribute(`https://wa.me/${business.contactNumber.replace(/\s/g, "")}?text=Hi, I'm interested in "${product.title}" from ${encodeURIComponent(business.title)}`, "href")} target="_blank" class="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg>
Ask for Price
</a>` : renderTemplate`${renderComponent($$result2, "Button", $$Button, {}, { "default": async ($$result3) => renderTemplate`Contact Business` })}`} ${renderComponent($$result2, "Button", $$Button, {
    "id": "share-btn",
    "variant": "outline",
    "size": "icon"
  }, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "Share2", Share2, { "class": "w-5 h-5" })}
          ` })} </div> <!-- Description --> ${product.description && renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "mb-6" }, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "p-6" }, { "default": async ($$result4) => renderTemplate`
              <h2 class="text-lg font-semibold mb-3">Description</h2>
              <div class="prose dark:prose-invert max-w-none">${unescapeHTML(product.description)}</div>
            ` })}
          ` })}`} <!-- Business Info --> <a${addAttribute(`/business/${slug}`, "href")} class="block"> ${renderComponent($$result2, "Card", $$Card, { "class": "hover:bg-muted/30 transition-colors" }, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "p-6" }, { "default": async ($$result4) => renderTemplate`
              <h2 class="text-lg font-semibold mb-3">Sold by</h2>
              <div class="flex items-center gap-4"> <div class="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden border-2 border-background shadow"> ${business.profileImageId ? renderTemplate`<img${addAttribute(`/api/media/${business.profileImageId}`, "src")} alt="" class="w-full h-full object-cover">` : renderTemplate`<span class="text-2xl font-bold text-white">${business.title.charAt(0)}</span>`} </div> <div> <h3 class="font-semibold text-lg">${business.title}</h3> ${category && renderTemplate`<p class="text-sm text-muted-foreground">${category.name}</p>`} ${business.address && renderTemplate`<p class="text-sm text-muted-foreground mt-1">${business.address}</p>`} </div> ${renderComponent($$result4, "ArrowRight", ArrowRight, { "class": "w-5 h-5 ml-auto text-muted-foreground" })} </div>
            ` })}
          ` })} </a> </div> </div> </div>

  
  <div class="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden"> <div class="max-w-4xl mx-auto flex items-center gap-3"> ${business.contactNumber ? renderTemplate`<a${addAttribute(`https://wa.me/${business.contactNumber.replace(/\s/g, "")}?text=Hi, I'm interested in "${product.title}" from ${encodeURIComponent(business.title)}`, "href")} target="_blank" class="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg>
Ask for Price
</a>` : renderTemplate`${renderComponent($$result2, "Button", $$Button, { "class": "flex-1" }, { "default": async ($$result3) => renderTemplate`Contact Business` })}`} ${renderComponent($$result2, "Button", $$Button, {
    "id": "mobile-share-btn",
    "variant": "outline",
    "size": "icon"
  }, { "default": async ($$result3) => renderTemplate`
        ${renderComponent($$result3, "Share2", Share2, { "class": "w-5 h-5" })}
      ` })} </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug]/product/[id]/index.astro";
const $$url = "/business/[slug]/product/[id]";
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
