globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, b as renderTemplate } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { d as categories, b as businessPages, p as products } from "./index_CI1oSuTR.mjs";
import { $ as $$BusinessCard } from "./BusinessCard_DcuvtDRQ.mjs";
import { e as eq, l as inArray } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const LUCIDE_SVG_PATHS = {
  utensils: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
  bed: "M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9",
  "shopping-bag": "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  car: "M5 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5zM14 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5zM5 17h14M5 17a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 11-4 0 2 2 0 014 0zM7 7h10M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2",
  briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  "graduation-cap": "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
  music: "M9 18V5l12-2v13M9 9l12-2",
  building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  store: "M3 3h1l1 6V3H5v6l1 1v10M9 21V9h12v12M9 9h12M9 13h12",
  coffee: "M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3",
  shirt: "M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z",
  scissors: "M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4l-8.5 8.5M20 4L8 16M8.5 15.5L20 4",
  wrench: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  globe: "M12 21a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z",
  "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  info: "M12 16v-4M12 8h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z",
  "alert-triangle": "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"
};
const DEFAULT_CATEGORY_ICONS = {
  "restaurants-cafes": { type: "lucide", value: "utensils" },
  "hotels-accommodation": { type: "lucide", value: "bed" },
  "shopping": { type: "lucide", value: "shopping-bag" },
  "health-beauty": { type: "lucide", value: "heart" },
  "automotive": { type: "lucide", value: "car" },
  "professional-services": { type: "lucide", value: "briefcase" },
  "education": { type: "lucide", value: "graduation-cap" },
  "entertainment": { type: "lucide", value: "music" }
};
function getLucideIconPath(name) {
  return LUCIDE_SVG_PATHS[name] || LUCIDE_SVG_PATHS.building;
}
function parseIcon(icon) {
  if (!icon || icon === "") return null;
  if (icon.startsWith("lucide:")) return { type: "lucide", value: icon.slice(8) };
  return null;
}
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$ProductCard;
  const { title, businessTitle = "", businessSlug = "", price = "", priceUnit = "", priceFields = [], thumbnail = null, slug = "", serviceType = "product", class: className = "" } = Astro.props;
  const displayPrice = priceFields.length > 0 ? priceFields.map((p) => `$${p.value}${p.unit}`).join(" / ") : price ? `$${price}${priceUnit ? "/" + priceUnit : ""}` : "Price on request";
  const href = businessSlug ? `/business/${businessSlug}${slug ? `/product/${slug}` : ""}` : "#";
  const serviceTypeColors = {
    product: "from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40",
    service: "from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40",
    rental: "from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40",
    food: "from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40",
    accommodation: "from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40",
    project: "from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40"
  };
  const gradientClass = serviceTypeColors[serviceType] || serviceTypeColors.product;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(["block group cursor-pointer", className], "class:list")} data-card> <div class="relative bg-card rounded-lg border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"> <!-- Thumbnail --> <div${addAttribute(["aspect-square relative overflow-hidden bg-gradient-to-br", gradientClass], "class:list")}> ${thumbnail ? renderTemplate`<img${addAttribute(thumbnail, "src")}${addAttribute(title, "alt")} class="w-full h-full object-cover" loading="lazy">` : renderTemplate`<div class="absolute inset-0 flex items-center justify-center"> <span class="text-4xl font-bold text-amber-500/40">${title.charAt(0)}</span> </div>`} <!-- Price badge - compact --> <div class="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"> <span class="text-white text-[10px] sm:text-xs font-semibold">${displayPrice}</span> </div> </div> <!-- Content - compact --> <div class="p-2 sm:p-3"> <h3 class="font-medium sm:font-semibold text-xs sm:text-sm truncate group-hover:text-amber-600 transition-colors leading-tight"> ${title} </h3> ${businessTitle && renderTemplate`<p class="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
by ${businessTitle} </p>`} </div> </div> </a>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/business/ProductCard.astro", void 0);
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const db = await getDb();
  let featuredBusinesses = [];
  let featuredGovs = [];
  let featuredNgos = [];
  let featuredProducts = [];
  let categoriesData = [];
  try {
    const categoriesResult = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      icon: categories.icon
    }).from(categories).limit(20);
    const categoryMap = {};
    categoriesResult.forEach((c) => {
      categoryMap[c.id] = {
        name: c.name,
        icon: c.icon || ""
      };
    });
    const businessesResult = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      tags: businessPages.tags,
      likes: businessPages.likes,
      status: businessPages.status,
      categoryId: businessPages.categoryId,
      entityType: businessPages.entityType,
      profileImageId: businessPages.profileImageId
    }).from(businessPages).where(eq(businessPages.status, "live")).orderBy(desc(businessPages.likes)).limit(20);
    const allListings = businessesResult.map((b) => {
      const tags = b.tags ? JSON.parse(b.tags) : [];
      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        category: categoryMap[b.categoryId || ""]?.name || "Business",
        rating: 0,
        reviews: 0,
        likes: b.likes || 0,
        location: "Dili",
        tag: tags[0] || "",
        tags,
        profileImageId: b.profileImageId,
        entityType: b.entityType
      };
    });
    featuredBusinesses = allListings.filter((b) => b.entityType === "business").slice(0, 12);
    featuredGovs = allListings.filter((b) => b.entityType === "government").slice(0, 3);
    featuredNgos = allListings.filter((b) => b.entityType === "nonprofit").slice(0, 3);
    categoriesData = categoriesResult.map((c) => {
      const icon = c.icon || "";
      const parsed = parseIcon(icon);
      const defaultIcon = DEFAULT_CATEGORY_ICONS[c.slug];
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        count: 0,
        icon: parsed?.value || defaultIcon?.value || "building",
        iconType: parsed?.type || defaultIcon?.type || "lucide"
      };
    });
    const productsResult = await db.select({
      id: products.id,
      title: products.title,
      price: products.price,
      priceUnit: products.priceUnit,
      priceFields: products.priceFields,
      serviceType: products.serviceType,
      businessPageId: products.businessPageId
    }).from(products).innerJoin(businessPages, eq(products.businessPageId, businessPages.id)).where(eq(businessPages.status, "live")).orderBy(desc(products.createdAt)).limit(12);
    const businessIds = [...new Set(productsResult.map((p) => p.businessPageId))];
    const businessesForProducts = businessIds.length > 0 ? await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug
    }).from(businessPages).where(inArray(businessPages.id, businessIds)) : [];
    const businessMap = {};
    businessesForProducts.forEach((b) => {
      businessMap[b.id] = {
        title: b.title,
        slug: b.slug
      };
    });
    featuredProducts = productsResult.map((p) => {
      const business = businessMap[p.businessPageId] || {};
      const priceFields = p.priceFields ? JSON.parse(p.priceFields) : [];
      return {
        id: p.id,
        title: p.title,
        price: p.price || "",
        priceUnit: p.priceUnit || "",
        priceFields,
        serviceType: p.serviceType || "product",
        businessTitle: business.title || "",
        businessSlug: business.slug || ""
      };
    });
  } catch (e) {
    console.error("Failed to fetch database data:", e);
  }
  const mappedCategories = categoriesData;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "TIMORLIST - Business Directory for Timor-Leste" }, { "default": async ($$result2) => renderTemplate`
  
  ${maybeRenderHead()}<div class="relative h-[240px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 overflow-hidden"> <div class="absolute inset-0 opacity-30"> <div class="absolute top-4 sm:top-10 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 bg-white/20 rounded-full blur-2xl"></div> <div class="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-24 sm:w-48 h-24 sm:h-48 bg-white/20 rounded-full blur-3xl"></div> </div> <div class="relative z-10 h-full flex items-center justify-center"> <div class="text-center text-white max-w-3xl px-4"> <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg">TIMORLIST</h1> <p class="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90">Discover Local Businesses in Timor-Leste</p> <div class="flex gap-2 sm:gap-4 justify-center flex-wrap"> <a href="/listing"> ${renderComponent($$result2, "Button", $$Button, {
    "size": "md",
    "class": "sm:size-lg bg-white text-amber-600 hover:bg-amber-50 font-semibold shadow-lg text-sm sm:text-base px-4 sm:px-6"
  }, { "default": async ($$result3) => renderTemplate`Browse Directory` })} </a> <a href="/business/create"> ${renderComponent($$result2, "Button", $$Button, {
    "size": "md",
    "variant": "ghost",
    "class": "sm:size-lg text-white border border-white/50 hover:bg-white/10 hover:border-white font-semibold text-sm sm:text-base px-4 sm:px-6"
  }, { "default": async ($$result3) => renderTemplate`List Your Business` })} </a> </div> </div> </div> <div class="absolute bottom-0 left-0 right-0"> <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-10 sm:h-16"> <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"></path> </svg> </div> </div>

  <div class="container py-6 sm:py-12"> <!-- Featured Businesses --> <section class="mb-6 sm:mb-12"> <div class="flex items-center justify-between mb-4 sm:mb-6"> <h2 class="text-lg sm:text-2xl font-bold">Featured Businesses</h2> <a href="/listing?type=business" class="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded cursor-pointer">View All →</a> </div> <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"> ${featuredBusinesses.length > 0 ? featuredBusinesses.map((business) => renderTemplate`${renderComponent($$result2, "BusinessCard", $$BusinessCard, {
    "title": business.title,
    "slug": business.slug,
    "category": business.category,
    "thumbnail": null,
    "rating": business.rating,
    "likes": business.likes,
    "reviews": business.reviews,
    "location": business.location,
    "tag": business.tag,
    "type": "business"
  })}`) : renderTemplate`<div class="col-span-full text-center py-8 text-muted-foreground"> <p>No featured businesses yet.</p> <a href="/business/create" class="text-amber-600 hover:underline">Add your business!</a> </div>`} </div> </section> <!-- Featured Government --> ${featuredGovs.length > 0 && renderTemplate`<section class="mb-6 sm:mb-12"> <div class="flex items-center justify-between mb-6"> <h2 class="text-lg sm:text-2xl font-bold">Government</h2> <a href="/listing?type=govs" class="text-purple-600 hover:text-purple-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded cursor-pointer">View All →</a> </div> <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4"> ${featuredGovs.map((gov) => renderTemplate`<a${addAttribute(`/govs/${gov.slug}`, "href")} class="block bg-card rounded-xl border shadow-sm hover:shadow-lg hover:border-purple-300 transition-all overflow-hidden"> <div class="aspect-[4/3] bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 relative flex items-center justify-center"> ${gov.profileImageId ? renderTemplate`<img${addAttribute(`/api/media/${gov.profileImageId}`, "src")}${addAttribute(gov.title, "alt")} class="w-full h-full object-cover">` : renderTemplate`<span class="text-5xl font-bold text-purple-400">${gov.title.charAt(0)}</span>`} </div> <div class="p-3"> <h3 class="font-semibold truncate group-hover:text-purple-600 transition-colors">${gov.title}</h3> <p class="text-xs text-muted-foreground truncate">${gov.category}</p> </div> </a>`)} </div> </section>`} <!-- Featured NGOs --> ${featuredNgos.length > 0 && renderTemplate`<section class="mb-6 sm:mb-12"> <div class="flex items-center justify-between mb-6"> <h2 class="text-lg sm:text-2xl font-bold">NGOs & Non-Profits</h2> <a href="/listing?type=ngos" class="text-orange-600 hover:text-orange-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded cursor-pointer">View All →</a> </div> <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4"> ${featuredNgos.map((ngo) => renderTemplate`<a${addAttribute(`/ngos/${ngo.slug}`, "href")} class="block bg-card rounded-xl border shadow-sm hover:shadow-lg hover:border-orange-300 transition-all overflow-hidden"> <div class="aspect-[4/3] bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 relative flex items-center justify-center"> ${ngo.profileImageId ? renderTemplate`<img${addAttribute(`/api/media/${ngo.profileImageId}`, "src")}${addAttribute(ngo.title, "alt")} class="w-full h-full object-cover">` : renderTemplate`<span class="text-5xl font-bold text-orange-400">${ngo.title.charAt(0)}</span>`} </div> <div class="p-3"> <h3 class="font-semibold truncate group-hover:text-orange-600 transition-colors">${ngo.title}</h3> <p class="text-xs text-muted-foreground truncate">${ngo.category}</p> </div> </a>`)} </div> </section>`} <!-- Featured Products & Services --> <section class="mb-6 sm:mb-12"> <div class="flex items-center justify-between mb-6"> <h2 class="text-lg sm:text-2xl font-bold">Featured Products & Services</h2> <a href="/products-services" class="text-amber-600 hover:text-amber-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded cursor-pointer">View All →</a> </div> ${featuredProducts.length > 0 ? renderTemplate`<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"> ${featuredProducts.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, {
    "title": product.title,
    "businessTitle": product.businessTitle,
    "businessSlug": product.businessSlug,
    "price": product.price,
    "priceUnit": product.priceUnit,
    "priceFields": product.priceFields,
    "serviceType": product.serviceType,
    "slug": product.id
  })}`)} </div>` : renderTemplate`<div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-8 text-center"> <p class="text-muted-foreground mb-4">No products available yet. Be the first to add one!</p> <a href="/business/create"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": async ($$result3) => renderTemplate`List Your Business` })} </a> </div>`} </section> <!-- Categories --> <section class="mb-6 sm:mb-12"> <h2 class="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Browse by Category</h2> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4"> ${mappedCategories.map((cat) => renderTemplate`<a${addAttribute(`/listing?type=business&industry=${cat.slug}`, "href")} class="block cursor-pointer"> <div class="p-4 text-center border rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"> <div class="w-8 h-8 mx-auto mb-2 text-amber-500 flex items-center justify-center"> <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(getLucideIconPath(cat.icon), "d")}></path> </svg> </div> <p class="font-medium text-sm">${cat.name}</p> </div> </a>`)} </div> </section> <!-- CTA --> <section class="text-center py-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl"> <h2 class="text-2xl font-bold mb-4">Ready to Grow Your Business?</h2> <p class="text-muted-foreground mb-6 max-w-xl mx-auto">Join thousands of businesses in Timor-Leste and reach more customers today.</p> <a href="/business/create"> ${renderComponent($$result2, "Button", $$Button, {
    "size": "lg",
    "class": "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
  }, { "default": async ($$result3) => renderTemplate`Create Your Business Page` })} </a> </section> </div>
` })}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/index.astro";
const $$url = "";
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
