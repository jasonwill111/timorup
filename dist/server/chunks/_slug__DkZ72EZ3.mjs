globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, B as unescapeHTML, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
const prerender = false;
const $$Slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Slug;
  const db = await getDb();
  const { slug } = Astro2.params;
  const siteUrl = "https://timorlist.com";
  const canonicalUrl = `${siteUrl}/organization/${slug}`;
  const org = await db.select().from(businessPages).where(eq(businessPages.slug, slug ?? "")).get();
  if (!org || org.entityType !== "organization") {
    return Astro2.redirect("/organization");
  }
  const typeLabels = {
    government: "Government",
    ngo: "NGO",
    nonprofit: "Non-Profit",
    foundation: "Foundation"
  };
  const openingHours = org.openingHours ? JSON.parse(org.openingHours) : null;
  const pageTitle = `${org.title} - TIMORLIST`;
  const pageDesc = org.aboutUs?.substring(0, 160) || `${org.title} - ${typeLabels[org.organizationType || ""] || "Organization"} in Timor-Leste`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": pageTitle,
    "description": pageDesc,
    "canonical": canonicalUrl
  }, { "default": async ($$result2) => renderTemplate`
  
  <script type="application/ld+json">${unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": org.title,
    "description": org.aboutUs,
    "url": canonicalUrl,
    "image": org.profileImageId ? `/api/media/${org.profileImageId}` : void 0,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": org.address,
      "addressLocality": "Dili",
      "addressCountry": "TL"
    },
    "telephone": org.contactNumber ? `${org.countryCode} ${org.contactNumber}` : void 0
  }))}<\/script>${maybeRenderHead()}<div class="bg-background min-h-screen"> <!-- Banner --> <div class="relative h-48 md:h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"> ${org.bannerImageId && renderTemplate`<img${addAttribute(`/api/media/${org.bannerImageId}`, "src")} class="w-full h-full object-cover" alt="">`} <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> </div> <div class="container max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10"> <!-- Profile Header --> <div class="flex flex-col md:flex-row gap-6 mb-8"> <!-- Main Content --> <div class="flex-1"> <!-- Profile Card --> <div class="bg-card border rounded-xl shadow p-6 mb-6"> <div class="flex flex-col md:flex-row gap-6"> <!-- Profile Image --> <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-muted flex-shrink-0 border-4 border-background shadow-lg"> ${org.profileImageId ? renderTemplate`<img${addAttribute(`/api/media/${org.profileImageId}`, "src")} class="w-full h-full object-cover"${addAttribute(org.title, "alt")}>` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-blue-600"> ${org.title.split(" ").map((w) => w[0]).join("").substring(0, 2)} </div>`} </div> <!-- Info --> <div class="flex-1"> <div class="flex items-center gap-2 mb-1"> <h1 class="text-2xl md:text-3xl font-bold">${org.title}</h1> ${org.verifiedBadge && renderTemplate`<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Verified
</span>`} </div> <!-- Type Badge --> <div class="flex items-center gap-2 mb-2"> <span${addAttribute(`px-2 py-1 text-xs font-medium rounded-full ${org.organizationType === "government" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" : org.organizationType === "ngo" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"}`, "class")}> ${typeLabels[org.organizationType || ""] || "Organization"} </span> </div> <!-- Contact --> <div class="space-y-1 mt-4"> ${org.contactName && renderTemplate`<p class="font-medium">${org.contactName}</p>`} ${org.contactNumber && renderTemplate`<p class="text-sm text-muted-foreground"> <a${addAttribute(`tel:${org.countryCode}${org.contactNumber}`, "href")} class="hover:text-primary"> ${org.countryCode} ${org.contactNumber} </a> </p>`} ${org.email && renderTemplate`<p class="text-sm text-muted-foreground"> <a${addAttribute(`mailto:${org.email}`, "href")} class="hover:text-primary">${org.email}</a> </p>`} ${org.address && renderTemplate`<p class="text-sm text-muted-foreground">${org.address}</p>`} </div> <!-- Registration Link --> ${org.registrationUrl && renderTemplate`<div class="mt-4"> <a${addAttribute(org.registrationUrl, "href")} target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm text-primary hover:underline"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg>
View Official Registration
</a> </div>`} </div> <!-- Actions --> <div class="flex gap-2 flex-shrink-0"> ${renderComponent($$result2, "Button", $$Button, {
    "id": "share-btn",
    "size": "sm",
    "variant": "outline"
  }, { "default": async ($$result3) => renderTemplate`
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path> </svg>
                  Share
                ` })} </div> </div> </div> </div> </div> <!-- Main Grid --> <div class="grid md:grid-cols-3 gap-6 pb-12"> <!-- Left Sidebar --> <div class="space-y-6"> <!-- About --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-4"> <h3 class="font-semibold mb-2 flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
About
</h3> ${org.aboutUs ? renderTemplate`<p class="text-sm text-muted-foreground whitespace-pre-line">${org.aboutUs}</p>` : renderTemplate`<p class="text-sm text-muted-foreground italic">No description available.</p>`} </div>
          ` })} <!-- Hours --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-4"> <h3 class="font-semibold mb-2 flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Hours
</h3> ${openingHours ? renderTemplate`<div class="space-y-1 text-sm"> ${[
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
  })} </div>` : renderTemplate`<p class="text-sm text-muted-foreground italic">Hours not available.</p>`} </div>
          ` })} <!-- Location --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-4"> <h3 class="font-semibold mb-2 flex items-center gap-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg>
Location
</h3> ${org.address ? renderTemplate`<div> <p class="text-sm text-muted-foreground">${org.address}</p> ${org.locationLat && org.locationLng && renderTemplate`<a${addAttribute(`https://www.openstreetmap.org/?mlat=${org.locationLat}&mlon=${org.locationLng}#map=15/${org.locationLat}/${org.locationLng}`, "href")} target="_blank" class="text-sm text-primary hover:underline mt-2 inline-block">
View on Map →
</a>`} </div>` : renderTemplate`<p class="text-sm text-muted-foreground italic">Location not available.</p>`} </div>
          ` })} </div> <!-- Right Content: Info --> <div class="md:col-span-2"> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            <div class="p-4 border-b"> <h2 class="text-xl font-semibold">Organization Information</h2> </div>
            <div class="p-6"> ${org.aboutUs ? renderTemplate`<div class="space-y-4"> <div> <h4 class="font-medium mb-2">Overview</h4> <p class="text-muted-foreground">${org.aboutUs}</p> </div> ${org.contactName && renderTemplate`<div> <h4 class="font-medium mb-2">Contact Person</h4> <p class="text-muted-foreground">${org.contactName}</p> </div>`} ${org.yearOfEstablishment && renderTemplate`<div> <h4 class="font-medium mb-2">Established</h4> <p class="text-muted-foreground">${org.yearOfEstablishment}</p> </div>`} </div>` : renderTemplate`<div class="text-center py-8"> <svg class="w-12 h-12 mx-auto text-muted-foreground mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0H3"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21v-4m0 0h6a2 2 0 012 2v4m-8-6H7a2 2 0 00-2 2v4m0-6v6"></path> </svg> <p class="text-muted-foreground">No detailed information available.</p> </div>`} </div>
          ` })} <!-- CTA --> ${renderComponent($$result2, "Card", $$Card, { "class": "mt-6 bg-primary/5 border-primary/20" }, { "default": async ($$result3) => renderTemplate`
            <div class="p-6 text-center"> <h3 class="font-semibold mb-2">Is your organization missing?</h3> <p class="text-sm text-muted-foreground mb-4">Register your government agency, NGO, or nonprofit on TIMORLIST.</p> <a href="/register?type=organization"> ${renderComponent($$result3, "Button", $$Button, {}, { "default": async ($$result4) => renderTemplate`Add Your Organization` })} </a> </div>
          ` })} </div> </div> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/organization/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/organization/[slug].astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/organization/[slug].astro";
const $$url = "/organization/[slug]";
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
