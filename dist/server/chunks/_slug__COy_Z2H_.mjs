globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, B as unescapeHTML, m as maybeRenderHead, a as addAttribute, F as Fragment } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories, p as products, g as productImages, r as reviews, m as media } from "./index_CI1oSuTR.mjs";
import { c as createLucideIcon, S as Share2 } from "./share-2_CazVIpvB.mjs";
import { e as eq, l as inArray } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
const Bookmark = createLucideIcon("bookmark", [["path", { "d": "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" }]]);
const Clock = createLucideIcon("clock", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 6v6l4 2" }]]);
const Eye = createLucideIcon("eye", [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]]);
const Globe = createLucideIcon("globe", [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }], ["path", { "d": "M2 12h20" }]]);
const Heart = createLucideIcon("heart", [["path", { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" }]]);
const MapPin = createLucideIcon("map-pin", [["path", { "d": "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }], ["circle", { "cx": "12", "cy": "10", "r": "3" }]]);
const Star = createLucideIcon("star", [["path", { "d": "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]]);
const Tag = createLucideIcon("tag", [["path", { "d": "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" }], ["circle", { "cx": "7.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }]]);
const prerender = false;
const $$Slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Slug;
  const db = await getDb();
  const { slug } = Astro2.params;
  const siteUrl = "https://timorlist.com";
  const canonicalUrl = `${siteUrl}/business/${slug}`;
  const business = await db.select().from(businessPages).where(eq(businessPages.slug, slug ?? "")).get();
  if (!business || business.entityType !== "business") {
    return Astro2.redirect("/businesses");
  }
  const category = business.categoryId ? await db.select().from(categories).where(eq(categories.id, business.categoryId)).get() : null;
  const businessProducts = await db.select().from(products).where(eq(products.businessPageId, business.id)).orderBy(desc(products.createdAt)).all();
  const productIds = businessProducts.map((p) => p.id);
  const imagesMap = /* @__PURE__ */ new Map();
  if (productIds.length > 0) {
    const images = await db.select().from(productImages).all();
    images.filter((img) => productIds.includes(img.productId)).forEach((img) => {
      const arr = imagesMap.get(img.productId) || [];
      arr.push(img.mediaId);
      imagesMap.set(img.productId, arr);
    });
  }
  const businessReviews = await db.select().from(reviews).where(eq(reviews.businessPageId, business.id)).orderBy(desc(reviews.createdAt)).all();
  const tags = business.tags ? JSON.parse(business.tags) : [];
  const openingHours = business.openingHours ? JSON.parse(business.openingHours) : null;
  const socialLinks = business.socialLinks ? JSON.parse(business.socialLinks) : {};
  const photoGallery = business.photoGallery ? JSON.parse(business.photoGallery) : [];
  const latestUpdate = business.latestUpdate || null;
  let galleryImages = [];
  if (photoGallery.length > 0) {
    const mediaItems = await db.select({
      id: media.id,
      url: media.url
    }).from(media).where(inArray(media.id, photoGallery)).all();
    galleryImages = mediaItems.map((m) => ({
      id: m.id,
      url: `/api/media/${m.id}`
    }));
  }
  const pageTitle = `${business.title} - TIMORLIST`;
  const pageDesc = business.aboutUs?.substring(0, 160) || `${business.title} - ${category?.name || "Business"} in Timor-Leste`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": pageTitle,
    "description": pageDesc,
    "canonical": canonicalUrl
  }, { "default": async ($$result2) => renderTemplate`
  
  <script type="application/ld+json">${unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": category?.slug === "restaurants-cafes" ? "Restaurant" : category?.slug === "hotels-accommodation" ? "Hotel" : "LocalBusiness",
    "name": business.title,
    "description": business.aboutUs,
    "url": canonicalUrl,
    "image": business.profileImageId ? `/api/media/${business.profileImageId}` : void 0,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": "Dili",
      "addressCountry": "TL"
    },
    "geo": business.locationLat && business.locationLng ? {
      "@type": "GeoCoordinates",
      "latitude": business.locationLat,
      "longitude": business.locationLng
    } : void 0,
    "telephone": business.contactNumber ? `${business.countryCode} ${business.contactNumber}` : void 0,
    "aggregateRating": business.ratingCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": business.ratingAverage,
      "reviewCount": business.ratingCount
    } : void 0
  }))}<\/script>${maybeRenderHead()}<div class="bg-background min-h-screen"> <!-- Banner --> <div class="relative h-48 md:h-64 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30"> ${business.bannerImageId && renderTemplate`<img${addAttribute(`/api/media/${business.bannerImageId}`, "src")} class="w-full h-full object-cover" alt="">`} <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> </div> <div class="container max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10 pb-12"> <!-- Header (full width) --> <div class="bg-card border rounded-xl shadow p-4 mb-6"> <div class="flex items-start gap-4"> <!-- Profile --> <div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-background shadow"> ${business.profileImageId ? renderTemplate`<img${addAttribute(`/api/media/${business.profileImageId}`, "src")} class="w-full h-full object-cover"${addAttribute(business.title, "alt")}>` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground bg-primary/10"> ${business.title.charAt(0)} </div>`} </div> <!-- Info + Actions --> <div class="flex-1 min-w-0"> <!-- Top row: Title + Actions --> <div class="flex items-start justify-between gap-3"> <div class="space-y-1"> <div class="flex items-center gap-2 flex-wrap"> <h1 class="text-xl md:text-2xl font-bold">${business.title}</h1> ${business.status === "live" && renderTemplate`<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Live</span>`} ${category && renderTemplate`<span class="text-xs text-muted-foreground">${category.name}</span>`} </div> <!-- Contact info --> <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"> ${business.contactNumber && renderTemplate`<a${addAttribute(`tel:${business.countryCode}${business.contactNumber}`, "href")} class="text-foreground hover:text-primary font-medium"> ${business.countryCode} ${business.contactNumber} </a>`} ${business.contactName && renderTemplate`<span class="text-muted-foreground">${business.contactName}</span>`} ${business.email && renderTemplate`<a${addAttribute(`mailto:${business.email}`, "href")} class="text-muted-foreground hover:text-primary">${business.email}</a>`} ${business.yearOfEstablishment && renderTemplate`<span class="text-muted-foreground">Est. ${business.yearOfEstablishment}</span>`} </div> <!-- About --> ${business.aboutUs && renderTemplate`<p class="text-xs text-muted-foreground/70 italic">${business.aboutUs}</p>`} </div> <!-- Actions: icons row + WhatsApp row --> <div class="flex flex-col items-end gap-1 flex-shrink-0"> <div class="flex items-center gap-1"> <div class="flex flex-col items-center px-1" title="Views"> ${renderComponent($$result2, "Eye", Eye, { "class": "w-4 h-4 text-muted-foreground" })} <span class="text-[10px] text-muted-foreground">${business.views || 0}</span> </div> <div class="flex flex-col items-center px-1" title="Likes"> ${renderComponent($$result2, "Heart", Heart, { "class": "w-4 h-4 text-muted-foreground" })} <span class="text-[10px] text-muted-foreground">${business.likes || 0}</span> </div> <div class="flex flex-col items-center px-1" title="Saves"> ${renderComponent($$result2, "Bookmark", Bookmark, { "class": "w-4 h-4 text-muted-foreground" })} <span class="text-[10px] text-muted-foreground">${business.saves || 0}</span> </div> <button id="share-btn" class="p-1 rounded-full hover:bg-muted transition-colors" title="Share"> ${renderComponent($$result2, "Share2", Share2, { "class": "w-4 h-4" })} </button> </div> ${business.contactNumber && renderTemplate`<a${addAttribute(`https://wa.me/${business.contactNumber.replace(/\s/g, "")}?text=Hi, I'm interested in ${encodeURIComponent(business.title)}`, "href")} target="_blank"> ${renderComponent($$result2, "Button", $$Button, {
    "size": "sm",
    "class": "!bg-[#25D366] hover:!bg-[#20BD5A] text-white shadow-sm"
  }, { "default": async ($$result3) => renderTemplate`
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg>
                      WhatsApp
                    ` })} </a>`} </div> </div> </div> </div> </div> <!-- Main Grid: Products (60%) + Sidebar (40%) --> <div class="grid lg:grid-cols-10 gap-4"> <!-- Left: Products + Reviews (60%) --> <div class="lg:col-span-6 space-y-4"> <!-- Latest Update --> ${latestUpdate && renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "border-l-4 border-l-primary" }, { "default": async ($$result3) => renderTemplate`
            <div class="p-3"> <h3 class="font-semibold text-sm mb-2 flex items-center gap-2"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path> </svg>
Latest Update
</h3> <p class="text-sm text-muted-foreground">${latestUpdate}</p> ${business.latestUpdateDate && renderTemplate`<p class="text-xs text-muted-foreground/60 mt-2"> ${new Date(business.latestUpdateDate).toLocaleDateString()} </p>`} </div>
          ` })}`} <!-- Products & Services --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-3 border-b flex items-center justify-between"> <h2 class="text-lg font-semibold">Products & Services</h2> <span class="text-xs text-muted-foreground">${businessProducts.length} items</span> </div>

            ${businessProducts.length > 0 ? renderTemplate`<div class="divide-y p-3"> ${businessProducts.map((product) => {
    const productImagesList = imagesMap.get(product.id) || [];
    const firstImage = productImagesList[0];
    return renderTemplate`<a${addAttribute(`/business/${slug}/product/${product.id}`, "href")} class="group flex items-center gap-4 p-3 hover:bg-muted/30 transition-colors -mx-3"> <div class="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0"> ${firstImage ? renderTemplate`<img${addAttribute(`/api/media/${firstImage}`, "src")}${addAttribute(product.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground bg-gradient-to-br from-amber-100 to-amber-200"> ${product.title.charAt(0)} </div>`} </div> <div class="flex-1 min-w-0"> <h3 class="font-medium group-hover:text-primary transition-colors line-clamp-1">${product.title}</h3> ${product.description && renderTemplate`<p class="text-xs text-muted-foreground line-clamp-2 mt-1">${product.description}</p>`} <div class="flex items-center gap-3 mt-2"> ${product.price && renderTemplate`<span class="font-bold text-primary">${product.price}</span>`} ${productImagesList.length > 1 && renderTemplate`<span class="text-[10px] text-muted-foreground">+${productImagesList.length - 1} photos</span>`} </div> </div> </a>`;
  })} </div>` : renderTemplate`<div class="p-8 text-center"> <p class="text-muted-foreground">No products or services listed yet.</p> </div>`}` })} <!-- Reviews --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-3 border-b"> <div class="flex items-center justify-between"> <h2 class="text-lg font-semibold">Reviews</h2> <div class="flex items-center gap-2"> <span class="text-lg font-bold">${business.ratingAverage?.toFixed(1) || "0.0"}</span> <div class="flex"> ${[
    1,
    2,
    3,
    4,
    5
  ].map((i) => renderTemplate`${renderComponent($$result3, "Star", Star, { "class": `w-4 h-4 ${i <= Math.round(business.ratingAverage || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}` })}`)} </div> <span class="text-xs text-muted-foreground">(${businessReviews.length})</span> </div> </div> </div>

            ${businessReviews.length > 0 ? renderTemplate`<div class="divide-y"> ${businessReviews.slice(0, 5).map((review) => renderTemplate`<div class="p-4"> <div class="flex items-center justify-between mb-2"> <div class="flex items-center gap-2"> <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">U</div> <span class="font-medium text-sm">User</span> </div> <div class="flex"> ${[
    1,
    2,
    3,
    4,
    5
  ].map((i) => renderTemplate`${renderComponent($$result3, "Star", Star, { "class": `w-4 h-4 ${i <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}` })}`)} </div> </div> ${review.comment && renderTemplate`<p class="text-sm text-muted-foreground">${review.comment}</p>`} <p class="text-xs text-muted-foreground mt-2">${new Date(review.createdAt).toLocaleDateString()}</p> ${review.reply && renderTemplate`<div class="mt-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-4 border-primary"> <p class="text-xs font-medium text-muted-foreground mb-1">Owner Reply:</p> <p class="text-sm">${review.reply}</p> ${review.repliedAt && renderTemplate`<p class="text-xs text-muted-foreground mt-1">
Replied on ${new Date(review.repliedAt).toLocaleDateString()} </p>`} </div>`} </div>`)} </div>` : renderTemplate`<div class="p-8 text-center"> <p class="text-muted-foreground">No reviews yet.</p> </div>`}` })} </div> <!-- Right Sidebar (40%) --> <div class="lg:col-span-4 space-y-4"> <!-- Social Links --> ${(socialLinks.facebook || socialLinks.instagram || socialLinks.tiktok) && renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
              <div class="p-3"> <h3 class="font-semibold text-sm mb-3 flex items-center gap-2"> ${renderComponent($$result3, "Globe", Globe, { "class": "w-4 h-4" })}
Follow Us
</h3> <div class="flex gap-3"> ${socialLinks.facebook && renderTemplate`<a${addAttribute(socialLinks.facebook, "href")} target="_blank" class="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg> </a>`} ${socialLinks.instagram && renderTemplate`<a${addAttribute(socialLinks.instagram, "href")} target="_blank" class="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 hover:bg-pink-200 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path> </svg> </a>`} ${socialLinks.tiktok && renderTemplate`<a${addAttribute(socialLinks.tiktok, "href")} target="_blank" class="p-2 rounded-full bg-black dark:bg-gray-800 text-white hover:bg-gray-700 transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path> </svg> </a>`} </div> </div>
            ` })}`} <!-- Photo Gallery --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-3"> <h3 class="font-semibold text-sm mb-3 flex items-center gap-2"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg>
Photo Gallery
</h3> ${galleryImages.length > 0 ? renderTemplate`<div class="grid grid-cols-3 gap-2" id="gallery-grid"> ${galleryImages.slice(0, 6).map((img, idx) => renderTemplate`<div${addAttribute(`aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity ${galleryImages.length === 1 ? "col-span-3" : ""}`, "class")}${addAttribute(idx, "data-gallery-idx")}> <img${addAttribute(img.url, "src")}${addAttribute(`Gallery ${idx + 1}`, "alt")} class="w-full h-full object-cover"> </div>`)} </div>` : renderTemplate`<div class="grid grid-cols-3 gap-2"> ${[
    1,
    2,
    3,
    4,
    5,
    6
  ].map(() => renderTemplate`<div class="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/30"> <svg class="w-6 h-6 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div>`)} </div>`} </div>
          ` })} <!-- Map --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-3"> <h3 class="font-semibold text-sm mb-2 flex items-center gap-2"> ${renderComponent($$result3, "MapPin", MapPin, { "class": "w-4 h-4" })}
Location
</h3> ${business.locationLat && business.locationLng ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate` <div class="aspect-video rounded-lg overflow-hidden border mb-2"> <img${addAttribute(`https://static-maps.yandex.ru/1.x/?ll=${business.locationLng},${business.locationLat}&z=15&l=map&size=400,200&pt=${business.locationLng},${business.locationLat},pm2rdm`, "src")} alt="Map" class="w-full h-full object-cover"${addAttribute(`this.src='https://www.openstreetmap.org/export/embed.html?bbox=${(business.locationLng - 0.01).toFixed(4)},${(business.locationLat - 0.01).toFixed(4)},${(business.locationLng + 0.01).toFixed(4)},${(business.locationLat + 0.01).toFixed(4)}&layer=mapnik&marker=${business.locationLat},${business.locationLng}'`, "onerror")}> </div> ${business.address && renderTemplate`<p class="text-xs text-muted-foreground mb-2">${business.address}</p>`} <a${addAttribute(`https://www.openstreetmap.org/?mlat=${business.locationLat}&mlon=${business.locationLng}#map=15/${business.locationLat}/${business.locationLng}`, "href")} target="_blank" class="text-xs text-primary hover:underline">
Open in Maps →
</a> ` })}` : renderTemplate`<p class="text-xs text-muted-foreground italic">Location not available.</p>`} </div>
          ` })} <!-- Tags --> ${tags.length > 0 && renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
              <div class="p-3"> <h3 class="font-semibold text-sm mb-2 flex items-center gap-2"> ${renderComponent($$result3, "Tag", Tag, { "class": "w-4 h-4" })}
Tags
</h3> <div class="flex flex-wrap gap-1.5"> ${tags.map((tag) => renderTemplate`<span class="px-2 py-0.5 text-xs bg-muted rounded-full">${tag}</span>`)} </div> </div>
            ` })}`} <!-- Hours --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-3"> <h3 class="font-semibold text-sm mb-2 flex items-center gap-2"> ${renderComponent($$result3, "Clock", Clock, { "class": "w-4 h-4" })}
Hours
</h3> ${openingHours ? renderTemplate`<div class="space-y-1 text-xs"> ${[
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ].map((day) => {
    const dayData = openingHours[day];
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
    if (dayData?.open === "closed") {
      return renderTemplate`<div class="flex justify-between"><span>${dayName}</span><span class="text-red-500">Closed</span></div>`;
    }
    if (dayData?.open && dayData?.close) {
      return renderTemplate`<div class="flex justify-between"><span>${dayName}</span><span>${dayData.open} - ${dayData.close}</span></div>`;
    }
    return null;
  })} </div>` : renderTemplate`<p class="text-xs text-muted-foreground italic">Hours not available.</p>`} </div>
          ` })} </div> </div> </div> </div>

  
  <div id="lightbox-modal" class="fixed inset-0 bg-black/90 z-50 hidden items-center justify-center"> <button id="lightbox-close" class="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> <button id="lightbox-prev" class="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors"> <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg> </button> <button id="lightbox-next" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors"> <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </button> <div id="lightbox-content" class="max-w-4xl max-h-[90vh]"></div> <div id="lightbox-counter" class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm"></div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug].astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/business/[slug].astro";
const $$url = "/business/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
