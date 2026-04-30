globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Input } from "./Input_DoiP-9-C.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, p as products } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Index;
  const db = await getDb();
  const PAGE_SIZE = 12;
  const search = Astro.url.searchParams.get("search") || "";
  const businessId = Astro.url.searchParams.get("business") || "";
  const page2 = parseInt(Astro.url.searchParams.get("page") || "1");
  const sort = Astro.url.searchParams.get("sort") || "recent";
  const allBusinesses = await db.select({
    id: businessPages.id,
    title: businessPages.title,
    slug: businessPages.slug,
    entityType: businessPages.entityType
  }).from(businessPages).where(eq(businessPages.status, "live")).all();
  const allProducts = await db.select({
    id: products.id,
    title: products.title,
    description: products.description,
    price: products.price,
    priceUnit: products.priceUnit,
    priceFields: products.priceFields,
    serviceType: products.serviceType,
    businessPageId: products.businessPageId,
    createdAt: products.createdAt
  }).from(products).orderBy(desc(products.createdAt)).all();
  const productsWithBusiness = allProducts.map((p) => {
    const business = allBusinesses.find((b) => b.id === p.businessPageId);
    return {
      ...p,
      businessTitle: business?.title || "Unknown",
      businessSlug: business?.slug || "",
      businessType: business?.entityType || "business"
    };
  }).filter((p) => p.businessTitle !== "Unknown");
  let filteredProducts = productsWithBusiness;
  if (search) {
    filteredProducts = filteredProducts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.businessTitle.toLowerCase().includes(search.toLowerCase()));
  }
  if (businessId) {
    filteredProducts = filteredProducts.filter((p) => p.businessPageId === businessId);
  }
  if (sort === "name") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "price-low") {
    filteredProducts.sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0"));
  } else if (sort === "price-high") {
    filteredProducts.sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0"));
  }
  const offset = (page2 - 1) * PAGE_SIZE;
  const total = filteredProducts.length;
  const productsList = filteredProducts.slice(offset, offset + PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const getPageUrl = (p) => {
    const params = new URLSearchParams({
      page: String(p),
      search,
      business: businessId,
      sort
    });
    return `/products-services?${params.toString()}`;
  };
  const formatPrice = (product) => {
    if (product.priceFields) {
      try {
        const fields = JSON.parse(product.priceFields);
        if (fields.length > 0 && fields[0].value) {
          const unit = fields[0].unit ? `/${fields[0].unit.replace("/", "")}` : "";
          return `$${fields[0].value}${unit}`;
        }
      } catch {
      }
    }
    if (product.price) {
      const unit = product.priceUnit ? `/${product.priceUnit.replace("/", "")}` : "";
      return `$${product.price}${unit}`;
    }
    return "Ask for price";
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": "Products & Services - TIMORLIST",
    "description": "Browse all products and services from businesses in Timor-Leste"
  }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 sm:py-8"> <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6"> <div> <h1 class="text-2xl sm:text-3xl font-bold">Products & Services</h1> <p class="text-xs sm:text-sm text-muted-foreground">Browse all products and services</p> </div> <a href="/listing" class="text-xs sm:text-sm text-primary hover:underline">← Directory</a> </div> <!-- Filters - compact on mobile --> <div class="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6"> ${renderComponent($$result2, "Input", $$Input, {
    "id": "search",
    "type": "search",
    "placeholder": "Search...",
    "value": search,
    "class": "w-full sm:w-48 md:w-64"
  })} <select id="business-filter" class="h-9 sm:h-10 px-2 sm:px-3 rounded-md border border-input bg-background text-xs sm:text-sm"> <option value="">All Businesses</option> ${allBusinesses.map((b) => renderTemplate`<option${addAttribute(b.id, "value")}${addAttribute(businessId === b.id, "selected")}> ${b.title} </option>`)} </select> <select id="sort-filter" class="h-9 sm:h-10 px-2 sm:px-3 rounded-md border border-input bg-background text-xs sm:text-sm"> <option value="recent"${addAttribute(sort === "recent", "selected")}>Recent</option> <option value="name"${addAttribute(sort === "name", "selected")}>Name A-Z</option> <option value="price-low"${addAttribute(sort === "price-low", "selected")}>Price ↑</option> <option value="price-high"${addAttribute(sort === "price-high", "selected")}>Price ↓</option> </select> </div> <!-- Results Count --> <div class="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
Showing ${productsList.length} of ${total} products
</div> <!-- Products Grid - gap-2 on mobile --> <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"> ${productsList.map((product) => renderTemplate`<a${addAttribute(product.businessType === "business" ? `/business/${product.businessSlug}/product/${product.id}` : `/${product.businessType}/${product.businessSlug}`, "href")} class="block bg-card rounded-lg border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden group cursor-pointer"> <div class="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 relative flex items-center justify-center"> <span class="text-4xl font-bold text-amber-500/40">${product.title.charAt(0)}</span> ${product.serviceType && renderTemplate`<span class="absolute top-1.5 left-1.5 sm:top-2 px-1.5 py-0.5 text-[10px] sm:text-[11px] bg-black/75 text-white rounded-full capitalize"> ${product.serviceType} </span>`} </div> <div class="p-2 sm:p-3"> <h3 class="font-medium sm:font-semibold text-xs sm:text-sm truncate group-hover:text-primary transition-colors">${product.title}</h3> <p class="text-[10px] sm:text-xs text-muted-foreground truncate">${product.businessTitle}</p> <p class="text-xs sm:text-sm font-bold text-primary mt-0.5">${formatPrice(product)}</p> </div> </a>`)} </div> ${productsList.length === 0 && renderTemplate`<div class="text-center py-12 text-muted-foreground">
No products found
</div>`} <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="flex justify-center gap-2 mt-8"> ${page2 > 1 && renderTemplate`<a${addAttribute(getPageUrl(page2 - 1), "href")} class="px-4 py-2 border rounded hover:bg-muted">Previous</a>`} <span class="px-4 py-2">Page ${page2} of ${totalPages}</span> ${page2 < totalPages && renderTemplate`<a${addAttribute(getPageUrl(page2 + 1), "href")} class="px-4 py-2 border rounded hover:bg-muted">Next</a>`} </div>`} </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/products-services/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/products-services/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/products-services/index.astro";
const $$url = "/products-services";
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
