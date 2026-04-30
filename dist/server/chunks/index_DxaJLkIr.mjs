globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
import { db } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let businesses = [];
  let categoriesData = [];
  let totalCount = 0;
  try {
    const businessesResult = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      tags: businessPages.tags,
      likes: businessPages.likes,
      saves: businessPages.saves,
      status: businessPages.status,
      categoryId: businessPages.categoryId,
      address: businessPages.address,
      entityType: businessPages.entityType
    }).from(businessPages).where(eq(businessPages.status, "live")).limit(20).orderBy(desc(businessPages.likes));
    const filteredBusinesses = businessesResult.filter((b) => b.entityType !== "organization");
    const countResult = await db.select({ count: sql`count(*)` }).from(businessPages).where(eq(businessPages.status, "live"));
    totalCount = Number(countResult[0]?.count) || 0;
    const categoriesResult = await db.select().from(categories).limit(20);
    const categoryIds = [...new Set(filteredBusinesses.map((b) => b.categoryId).filter(Boolean))];
    const categoryMap = {};
    if (categoryIds.length > 0) {
      const cats = await db.select().from(categories).all();
      cats.forEach((c) => {
        categoryMap[c.id] = c.name;
      });
    }
    businesses = filteredBusinesses.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: categoryMap[b.categoryId || ""] || "Business",
      rating: 0,
      reviews: 0,
      location: b.address?.split(",")[0] || "Timor-Leste",
      tags: b.tags ? JSON.parse(b.tags) : [],
      likes: b.likes || 0,
      saves: b.saves || 0
    }));
    categoriesData = categoriesResult;
  } catch (e) {
    console.error("Failed to fetch database data:", e);
    businesses = [];
    categoriesData = [];
    totalCount = 0;
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TIMORLIST Business Directory",
    "description": "Discover local businesses in Timor-Leste including restaurants, hotels, shops, and services.",
    "url": "https://timorlist.com/businesses",
    "areaServed": {
      "@type": "Country",
      "name": "Timor-Leste"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dili",
      "addressCountry": "TL"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": "Businesses - TIMORLIST",
    "description": "Discover local businesses in Timor-Leste. Find restaurants, hotels, shops, services, and more on the premier business directory for Timor-Leste.",
    "structuredData": structuredData
  }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8"> <!-- Search and Filter Section --> <div class="mb-8"> <h1 class="text-3xl font-bold mb-4">Business Directory</h1> <p class="text-muted-foreground mb-6">Discover ${totalCount > 0 ? totalCount : businesses.length} businesses across Timor-Leste</p> <div class="flex flex-col md:flex-row gap-4"> <div class="flex-1"> ${renderComponent($$result2, "Input", $$Input, {
    "id": "search",
    "type": "search",
    "placeholder": "Search businesses...",
    "class": "w-full"
  })} </div> <select id="category-filter" class="h-10 px-3 rounded-md border border-input bg-background"> <option value="">All Categories</option> ${categoriesData.map((cat) => renderTemplate`<option${addAttribute(cat.slug, "value")}>${cat.name}</option>`)} </select> <select id="sort-filter" class="h-10 px-3 rounded-md border border-input bg-background"> <option value="recent">Most Recent</option> <option value="popular">Most Popular</option> <option value="rating">Highest Rated</option> <option value="name">A-Z</option> </select> </div> </div> <!-- Results count --> <div class="mb-4 text-sm text-muted-foreground">
Showing <span id="result-count" class="font-medium text-foreground">${businesses.length}</span> businesses
</div> <!-- Businesses Grid --> <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4" id="businesses-grid"> ${businesses.length > 0 ? businesses.map((business) => {
    const firstTag = business.tags?.[0] || "";
    const reviewCount = business.reviews || Math.floor(Math.random() * 50);
    return renderTemplate`<a${addAttribute(`/business/${business.slug}`, "href")} class="block group cursor-pointer" data-business${addAttribute(business.title.toLowerCase(), "data-title")}${addAttribute(business.category.toLowerCase(), "data-category")}${addAttribute(business.tags?.join(",") || "", "data-tags")}${addAttribute(business.likes, "data-likes")}${addAttribute(business.rating, "data-rating")}> <div class="relative bg-card rounded-xl border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden"> <!-- Thumbnail --> <div class="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 relative overflow-hidden"> ${business.thumbnail ? renderTemplate`<img${addAttribute(business.thumbnail, "src")}${addAttribute(business.title, "alt")} class="w-full h-full object-cover" loading="lazy">` : renderTemplate`<div class="absolute inset-0 flex items-center justify-center"> <span class="text-5xl font-bold text-amber-500/40">${business.title.charAt(0)}</span> </div>`} <!-- Top overlay: Save + Rating --> <div class="absolute top-2 left-2 right-2 flex justify-between items-start"> <!-- Save button --> <button class="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all cursor-pointer" title="Save" onclick="event.preventDefault(); event.stopPropagation();"> <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path> </svg> </button> <!-- Rating badge --> ${business.rating > 0 && renderTemplate`<div class="bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-white text-xs font-medium"> <svg class="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24" aria-hidden="true"> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path> </svg> <span class="sr-only">Rating: ${business.rating.toFixed(1)} stars</span> <span aria-hidden="true">${business.rating.toFixed(1)}</span> </div>`} </div> <!-- Bottom: Stats row --> <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2"> <div class="flex items-center justify-end gap-3 text-white text-xs"> ${business.likes > 0 && renderTemplate`<span class="flex items-center gap-0.5"> <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path> </svg> <span class="font-medium">${business.likes}</span> </span>`} ${reviewCount > 0 && renderTemplate`<span class="flex items-center gap-0.5"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path> </svg> <span class="font-medium">${reviewCount}</span> </span>`} </div> </div> </div> <!-- Content: Icon + Number layout --> <div class="p-3"> <!-- Title + Category (compact) --> <h3 class="font-semibold text-sm truncate group-hover:text-amber-600 transition-colors leading-tight">${business.title}</h3> <p class="text-xs text-muted-foreground truncate mt-0.5">${business.category}</p> <!-- Bottom stats row --> <div class="flex items-center justify-between mt-2 pt-2 border-t border-border/50"> <!-- Location icon + short text --> <span class="flex items-center gap-1 text-[11px] text-muted-foreground"> <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> <span class="truncate max-w-[80px]">${business.location}</span> </span> <!-- Tag pill --> ${firstTag && renderTemplate`<span class="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded font-medium"> ${firstTag} </span>`} </div> </div> </div> </a>`;
  }) : renderTemplate`<div class="col-span-full text-center py-12"> <p class="text-lg text-muted-foreground">No businesses found</p> <p class="text-sm text-muted-foreground mt-1">Be the first to add your business!</p> <a href="/business/create" class="mt-4 inline-block"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": async ($$result3) => renderTemplate`Add Your Business` })} </a> </div>`} </div> <!-- Loading State --> <div id="loading" class="hidden text-center py-12"> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> <p class="mt-2 text-muted-foreground">Loading businesses...</p> </div> <!-- Organizations Link --> <div class="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center"> <p class="text-blue-800 dark:text-blue-200 mb-2">Looking for government agencies or NGOs?</p> <a href="/organization" class="text-blue-600 hover:text-blue-800 font-medium">
Browse Organizations →
</a> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/businesses/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/businesses/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/businesses/index.astro";
const $$url = "/businesses";
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
