globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
const prerender = false;
const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Create;
  const cookieHeader = Astro.request.headers.get("cookie") || "";
  let user = null;
  let hasExistingListing = false;
  let existingListing = null;
  try {
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const { db } = await import("./db_DBymDTwI.mjs");
      const { sessions, users, businessPages } = await import("./index_CI1oSuTR.mjs").then((n) => n.s);
      const { eq } = await import("./index_BxPtajE1.mjs");
      const session = await db.select().from(sessions).where(eq(sessions.token, tokenMatch[1])).limit(1).get();
      if (session && session.expiresAt && new Date(session.expiresAt) > /* @__PURE__ */ new Date()) {
        const userRecord = await db.select().from(users).where(eq(users.id, session.userId)).limit(1).get();
        if (userRecord) {
          user = { id: userRecord.id };
          const existing = await db.select().from(businessPages).where(eq(businessPages.ownerId, user.id)).limit(1).get();
          if (existing) {
            hasExistingListing = true;
            existingListing = existing;
          }
        }
      }
    }
  } catch (e) {
    console.error("Auth check failed:", e);
  }
  if (!user) {
    return Astro.redirect("/login?redirect=/listing/create");
  }
  const url = new URL(Astro.request.url);
  const selectedType = url.searchParams.get("type") || "";
  const showTypeSelector = !selectedType;
  const showForm = Boolean(selectedType);
  const isBusiness = selectedType === "business";
  const isFreeType = selectedType === "government" || selectedType === "nonprofit";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Create Listing - TIMORLIST" }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8 max-w-4xl"> ${hasExistingListing ? renderTemplate`<div class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center"> <div class="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center"> <svg class="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg> </div> <h2 class="text-xl font-bold text-amber-900 mb-2">You Already Have a Listing</h2> <p class="text-amber-700 mb-4">Each account can only create one listing.</p> <div class="bg-white rounded-lg p-4 mb-6 text-left max-w-md mx-auto border border-amber-100"> <p class="font-medium">${existingListing?.title}</p> <p class="text-sm text-muted-foreground capitalize">${existingListing?.entityType}</p> </div> <div class="flex gap-4 justify-center"> <a href="/account" class="px-6 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors">
Go to Dashboard
</a> <a${addAttribute(`/business/${existingListing?.slug}`, "href")} class="px-6 py-2 border border-amber-300 text-amber-800 font-medium rounded-lg hover:bg-amber-100 transition-colors">
View Listing
</a> </div> </div>` : null} ${!hasExistingListing && showTypeSelector ? renderTemplate`<div> <div class="mb-8"> <h1 class="text-3xl font-bold">Create Your Listing</h1> <p class="text-muted-foreground mt-2">Fill in your details to get started</p> </div> <h2 class="text-lg font-semibold mb-4">What type of listing?</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <a href="/listing/create?type=business" class="block"> <div class="border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-all h-full"> <div class="text-4xl mb-3">🏪</div> <h3 class="font-semibold text-lg mb-1">Business</h3> <p class="text-sm text-muted-foreground">For commercial businesses and enterprises</p> <p class="text-xs text-amber-600 mt-2">Requires subscription</p> </div> </a> <a href="/listing/create?type=government" class="block"> <div class="border rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all h-full"> <div class="text-4xl mb-3">🏛️</div> <h3 class="font-semibold text-lg mb-1">Government</h3> <p class="text-sm text-muted-foreground">For government agencies and offices</p> <p class="text-xs text-green-600 mt-2">Free listing</p> </div> </a> <a href="/listing/create?type=nonprofit" class="block"> <div class="border rounded-xl p-6 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all h-full"> <div class="text-4xl mb-3">❤️</div> <h3 class="font-semibold text-lg mb-1">NGO / Nonprofit</h3> <p class="text-sm text-muted-foreground">For NGOs, nonprofits, and foundations</p> <p class="text-xs text-green-600 mt-2">Free listing</p> </div> </a> </div> </div>` : null} ${!hasExistingListing && showForm ? renderTemplate`<div id="create-form"> <div class="flex items-center mb-6"> <a href="/listing/create" class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"> <span>←</span> Back to type selection
</a> </div> ${isBusiness ? renderTemplate`<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"> <p class="text-amber-800 text-sm"> <strong>Business listings require a subscription.</strong> <a href="/pricing" class="underline ml-1">View pricing plans →</a> </p> </div>` : null} ${isFreeType ? renderTemplate`<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"> <p class="text-green-800 text-sm"> <strong>Free listing!</strong> Government and nonprofit organizations get a free listing on TIMORLIST.
</p> </div>` : null} <form id="listing-form" class="space-y-6"> <input type="hidden" id="entityType" name="entityType"${addAttribute(selectedType, "value")}> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Basic Information` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": async ($$result5) => renderTemplate`The main details about your listing` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": async ($$result4) => renderTemplate`
              <div> <label for="title" class="block text-sm font-medium mb-1">Name *</label> <input type="text" id="title" name="title" required class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="Your name"> </div>

              <div> <label for="slug" class="block text-sm font-medium mb-1">URL Slug *</label> <input type="text" id="slug" name="slug" required class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="your-name"> <p class="text-xs text-muted-foreground mt-1" id="slug-help">
Your URL will be generated automatically
</p> </div>
            ` })}
          ` })} ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Contact Information` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": async ($$result5) => renderTemplate`How people can reach you` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-4" }, { "default": async ($$result4) => renderTemplate`
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="contactName" class="block text-sm font-medium mb-1">Contact Person</label> <input type="text" id="contactName" name="contactName" class="w-full px-3 py-2 border rounded-lg bg-background"> </div> <div> <label for="contactNumber" class="block text-sm font-medium mb-1">Phone</label> <input type="tel" id="contactNumber" name="contactNumber" class="w-full px-3 py-2 border rounded-lg bg-background" placeholder="+670 7x xxx xxx"> </div> </div>
              <div> <label for="email" class="block text-sm font-medium mb-1">Email</label> <input type="email" id="email" name="email" class="w-full px-3 py-2 border rounded-lg bg-background"> </div>
              <div> <label for="address" class="block text-sm font-medium mb-1">Address</label> <textarea id="address" name="address" rows="2" class="w-full px-3 py-2 border rounded-lg bg-background"></textarea> </div>
            ` })}
          ` })} <div class="flex gap-4"> ${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "save-draft-btn"
  }, { "default": async ($$result3) => renderTemplate`Save as Draft` })} ${isBusiness ? renderTemplate`${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "subscribe-btn",
    "variant": "outline"
  }, { "default": async ($$result3) => renderTemplate`Subscribe & Publish` })}` : renderTemplate`${renderComponent($$result2, "Button", $$Button, {
    "type": "button",
    "id": "publish-btn",
    "class": "bg-green-600 hover:bg-green-700"
  }, { "default": async ($$result3) => renderTemplate`Publish (Free)` })}`} </div> </form> </div>` : null} </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/listing/create.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/listing/create.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/listing/create.astro";
const $$url = "/listing/create";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
