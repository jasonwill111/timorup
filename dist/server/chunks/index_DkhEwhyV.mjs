globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { I as INDUSTRIES } from "./constants_DMDpIXNi.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Index;
  const db = await getDb();
  const PAGE_SIZE = 12;
  const type = Astro.url.searchParams.get("type") || "business";
  const search = Astro.url.searchParams.get("search") || "";
  const industry = Astro.url.searchParams.get("industry") || "";
  const category = Astro.url.searchParams.get("category") || "";
  const page2 = parseInt(Astro.url.searchParams.get("page") || "1");
  const sort = Astro.url.searchParams.get("sort") || "recent";
  let entityFilter;
  if (type === "business") {
    entityFilter = eq(businessPages.entityType, "business");
  } else if (type === "govs") {
    entityFilter = eq(businessPages.entityType, "government");
  } else if (type === "ngos") {
    entityFilter = eq(businessPages.entityType, "nonprofit");
  }
  const allCategories = await db.select().from(categories).all();
  const offset = (page2 - 1) * PAGE_SIZE;
  let query = db.select({
    id: businessPages.id,
    title: businessPages.title,
    slug: businessPages.slug,
    entityType: businessPages.entityType,
    industry: businessPages.industry,
    categoryId: businessPages.categoryId,
    profileImageId: businessPages.profileImageId,
    address: businessPages.address,
    ratingAverage: businessPages.ratingAverage,
    likes: businessPages.likes,
    createdAt: businessPages.createdAt
  }).from(businessPages).where(eq(businessPages.status, "live"));
  if (entityFilter) {
    query = query.where(entityFilter);
  }
  const allListings = await query.orderBy(desc(businessPages.createdAt)).all();
  let filteredListings = allListings;
  if (search) {
    filteredListings = filteredListings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (industry && type === "business") {
    filteredListings = filteredListings.filter((l) => l.industry?.startsWith(industry));
  }
  if (category) {
    filteredListings = filteredListings.filter((l) => l.categoryId === category);
  }
  if (sort === "name") {
    filteredListings.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "rating") {
    filteredListings.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
  } else if (sort === "popular") {
    filteredListings.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }
  const total = filteredListings.length;
  const listings = filteredListings.slice(offset, offset + PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  Object.fromEntries(allCategories.map((c) => [c.id, c.name]));
  const pageBase = `/listing?type=${type}`;
  const getPageUrl = (p) => `${pageBase}&page=${p}&search=${search}&industry=${industry}&category=${category}&sort=${sort}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": "Local Directory - TIMORLIST",
    "description": "Browse businesses, government agencies, and nonprofits in Timor-Leste"
  }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 sm:py-8"> <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Local Directory</h1> <!-- Type Tabs - compact on mobile --> <div class="flex gap-1 sm:gap-4 mb-4 sm:mb-6 border-b -mx-2 px-2 sm:mx-0 sm:px-0 overflow-x-auto"> <a href="/listing?type=business"${addAttribute(`px-4 py-2 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${type === "business" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`, "class")}>
Businesses
</a> <a href="/listing?type=govs"${addAttribute(`px-4 py-2 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${type === "govs" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`, "class")}>
Government
</a> <a href="/listing?type=ngos"${addAttribute(`px-4 py-2 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${type === "ngos" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`, "class")}>
NGOs & Non-Profits
</a> </div> <!-- Filters - compact on mobile --> <div class="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6"> ${renderComponent($$result2, "Input", $$Input, {
    "id": "search",
    "type": "search",
    "placeholder": "Search...",
    "value": search,
    "class": "w-full sm:w-48 md:w-64"
  })} ${type === "business" && renderTemplate`<select id="industry-filter" class="h-9 sm:h-10 px-2 sm:px-3 rounded-md border border-input bg-background text-xs sm:text-sm"> <option value="">All Industries</option> ${Object.entries(INDUSTRIES).map(([key, group]) => renderTemplate`<optgroup${addAttribute(group.label, "label")}> ${group.items.map((item) => renderTemplate`<option${addAttribute(key, "value")}${addAttribute(industry === key, "selected")}> ${item} </option>`)} </optgroup>`)} </select>`} ${(type === "govs" || type === "ngos") && renderTemplate`<select id="category-filter" class="h-9 sm:h-10 px-2 sm:px-3 rounded-md border border-input bg-background text-xs sm:text-sm"> <option value="">All Categories</option> ${allCategories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}${addAttribute(category === cat.id, "selected")}> ${cat.name} </option>`)} </select>`} <select id="sort-filter" class="h-9 sm:h-10 px-2 sm:px-3 rounded-md border border-input bg-background text-xs sm:text-sm"> <option value="recent"${addAttribute(sort === "recent", "selected")}>Recent</option> <option value="name"${addAttribute(sort === "name", "selected")}>Name A-Z</option> <option value="rating"${addAttribute(sort === "rating", "selected")}>Top Rated</option> <option value="popular"${addAttribute(sort === "popular", "selected")}>Popular</option> </select> </div> <!-- Results Count --> <div class="mb-4 text-sm text-muted-foreground">
Showing ${listings.length} of ${total} listings
</div> <!-- Listings Grid --> <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> ${listings.map((listing) => renderTemplate`<a${addAttribute(type === "business" ? `/business/${listing.slug}` : `/${type}/${listing.slug}`, "href")} class="block bg-card rounded-xl border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden group cursor-pointer"> <div class="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 relative"> ${listing.profileImageId ? renderTemplate`<img${addAttribute(`/api/media/${listing.profileImageId}`, "src")}${addAttribute(listing.title, "alt")} class="w-full h-full object-cover">` : renderTemplate`<div class="absolute inset-0 flex items-center justify-center text-4xl font-bold text-amber-500/40"> ${listing.title.charAt(0)} </div>`} ${listing.ratingAverage && listing.ratingAverage > 0 && renderTemplate`<div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"> <svg class="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24" aria-hidden="true"> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path> </svg> <span class="sr-only">Rating: ${listing.ratingAverage.toFixed(1)} stars</span> <span aria-hidden="true">${listing.ratingAverage.toFixed(1)}</span> </div>`} </div> <div class="p-3"> <h3 class="font-semibold text-sm truncate group-hover:text-primary transition-colors">${listing.title}</h3> ${listing.address && renderTemplate`<p class="text-xs text-muted-foreground truncate mt-1">${listing.address.split(",")[0]}</p>`} ${type === "business" && industry && renderTemplate`<p class="text-xs text-muted-foreground mt-1"> ${Object.entries(INDUSTRIES).find(([k]) => k === industry)?.[1]?.items?.[0] || industry} </p>`} </div> </a>`)} </div> ${listings.length === 0 && renderTemplate`<div class="text-center py-12 text-muted-foreground">
No listings found
</div>`} <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="flex justify-center gap-2 mt-8"> ${page2 > 1 && renderTemplate`<a${addAttribute(getPageUrl(page2 - 1), "href")} class="px-4 py-2 border rounded hover:bg-muted">Previous</a>`} <span class="px-4 py-2">Page ${page2} of ${totalPages}</span> ${page2 < totalPages && renderTemplate`<a${addAttribute(getPageUrl(page2 + 1), "href")} class="px-4 py-2 border rounded hover:bg-muted">Next</a>`} </div>`} </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/listing/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/listing/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/listing/index.astro";
const $$url = "/listing";
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
