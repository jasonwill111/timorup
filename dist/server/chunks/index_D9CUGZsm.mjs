globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
import { $ as $$BusinessCard } from "./BusinessCard_DcuvtDRQ.mjs";
import { db } from "./db_DBymDTwI.mjs";
import { b as businessPages, d as categories } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let organizations = [];
  let totalCount = 0;
  try {
    const result = await db.select().from(businessPages).where(eq(businessPages.entityType, "organization")).orderBy(desc(businessPages.likes)).limit(20).all();
    const cats = await db.select().from(categories).all();
    const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
    organizations = result.map((org) => ({
      id: org.id,
      title: org.title,
      slug: org.slug,
      organizationType: org.organizationType,
      aboutUs: org.aboutUs,
      contactNumber: org.contactNumber,
      countryCode: org.countryCode,
      address: org.address,
      bannerImageId: org.bannerImageId,
      profileImageId: org.profileImageId,
      verifiedBadge: org.verifiedBadge,
      categoryName: categoryMap.get(org.categoryId) || "Organization"
    }));
    const countResult = await db.select({ count: sql`count(*)` }).from(businessPages).where(eq(businessPages.entityType, "organization")).get();
    totalCount = Number(countResult?.count) || 0;
  } catch (e) {
    console.error("Failed to fetch organizations:", e);
  }
  const typeLabels = {
    government: "Government",
    ngo: "NGO",
    nonprofit: "Non-Profit",
    foundation: "Foundation"
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TIMORLIST Organizations",
    "description": "Government agencies, NGOs, and nonprofits in Timor-Leste",
    "url": "https://timorlist.com/organization",
    "areaServed": {
      "@type": "Country",
      "name": "Timor-Leste"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
    "title": "Organizations - TIMORLIST",
    "description": "Government agencies, NGOs, and nonprofits in Timor-Leste",
    "structuredData": structuredData
  }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8"> <div class="text-center mb-8"> <h1 class="text-3xl font-bold mb-2">Organizations in Timor-Leste</h1> <p class="text-muted-foreground">Government agencies, NGOs, nonprofits, and foundations</p> </div> <div class="flex flex-wrap gap-4 mb-8 justify-center"> <select id="type-filter" class="px-4 py-2 border rounded-lg bg-background"> <option value="">All Types</option> <option value="government">Government</option> <option value="ngo">NGO</option> <option value="nonprofit">Non-Profit</option> <option value="foundation">Foundation</option> </select> <input type="search" id="search-input" placeholder="Search organizations..." class="px-4 py-2 border rounded-lg bg-background flex-1 max-w-md"> </div> <div class="mb-4 text-sm text-muted-foreground">
Showing <span id="result-count" class="font-medium text-foreground">${organizations.length}</span> organizations
</div> <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> ${organizations.length > 0 ? organizations.map((org) => renderTemplate`${renderComponent($$result2, "BusinessCard", $$BusinessCard, {
    "title": org.title,
    "slug": org.slug,
    "category": typeLabels[org.organizationType || ""] || "Organization",
    "thumbnail": org.bannerImageId ? `/api/media/${org.bannerImageId}` : null,
    "rating": 0,
    "likes": org.likes || 0,
    "reviews": 0,
    "location": org.address?.split(",")[0] || "",
    "tag": org.organizationType ? typeLabels[org.organizationType] : "",
    "type": "organization",
    "orgType": org.organizationType || "",
    "verified": org.verifiedBadge || false
  })}`) : renderTemplate`<div class="col-span-full text-center py-12"> <p class="text-lg text-muted-foreground">No organizations found</p> <a href="/register?type=organization" class="mt-4 inline-block"> ${renderComponent($$result2, "Button", $$Button, {}, { "default": async ($$result3) => renderTemplate`Register Organization` })} </a> </div>`} </div> ${renderComponent($$result2, "Card", $$Card, { "class": "mt-12 bg-primary/10 border-primary/20" }, { "default": async ($$result3) => renderTemplate`
      ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "p-8 text-center" }, { "default": async ($$result4) => renderTemplate`
        <h2 class="text-2xl font-bold mb-2">Is your organization missing?</h2>
        <p class="text-muted-foreground mb-6">Register your government agency, NGO, or nonprofit to be listed on TIMORLIST.</p>
        <div class="flex gap-4 justify-center"> <a href="/register?type=organization"> ${renderComponent($$result4, "Button", $$Button, { "size": "lg" }, { "default": async ($$result5) => renderTemplate`Register Organization` })} </a> <a href="/businesses"> ${renderComponent($$result4, "Button", $$Button, {
    "size": "lg",
    "variant": "outline"
  }, { "default": async ($$result5) => renderTemplate`Browse Businesses` })} </a> </div>
      ` })}
    ` })} </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/organization/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/organization/index.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/organization/index.astro";
const $$url = "/organization";
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
