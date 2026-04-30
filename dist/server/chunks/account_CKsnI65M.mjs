globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead, a as addAttribute, F as Fragment } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$Layout } from "./Layout_BEjekyZM.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
import { $ as $$Card } from "./Card_BQQgFSSe.mjs";
import { $ as $$CardHeader, a as $$CardTitle } from "./CardTitle_DVNpBoWB.mjs";
import { $ as $$CardDescription } from "./CardDescription_CrTHqvHg.mjs";
import { $ as $$CardContent } from "./CardContent_BkLgdmcK.mjs";
import { $ as $$CardFooter } from "./CardFooter_D-3T-IgM.mjs";
const prerender = false;
const $$Account = createComponent(async ($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Account;
  const cookieHeader = Astro.request.headers.get("cookie") || "";
  let user = null;
  let userBusiness = null;
  let subscription = null;
  let businessReviews = [];
  try {
    const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const { db } = await import("./db_DBymDTwI.mjs");
      const { sessions, users, businessPages, orders, reviews } = await import("./index_CI1oSuTR.mjs").then((n) => n.s);
      const { eq, and, desc, sql } = await import("./index_BxPtajE1.mjs");
      const session = await db.select().from(sessions).where(eq(sessions.token, tokenMatch[1])).limit(1).get();
      if (session && session.expiresAt && new Date(session.expiresAt) > /* @__PURE__ */ new Date()) {
        const userRecord = await db.select().from(users).where(eq(users.id, session.userId)).limit(1).get();
        if (userRecord) {
          user = {
            id: userRecord.id,
            name: userRecord.name || "",
            email: userRecord.email
          };
          const business = await db.select({
            id: businessPages.id,
            title: businessPages.title,
            slug: businessPages.slug,
            planType: businessPages.planType,
            expiryDate: businessPages.expiryDate
          }).from(businessPages).where(eq(businessPages.ownerId, user.id)).limit(1).get();
          if (business) {
            userBusiness = business;
            const reviewsList = await db.select().from(reviews).where(eq(reviews.businessPageId, business.id)).orderBy(desc(reviews.createdAt)).limit(20);
            const reviewerIds = [...new Set(reviewsList.map((r) => r.userId))];
            const reviewerList = reviewerIds.length > 0 ? await db.select({
              id: users.id,
              name: users.name
            }).from(users).where(sql`${users.id} IN (${sql.join(reviewerIds.map((id) => sql`${id}`), sql`, `)})`) : [];
            const reviewerMap = new Map(reviewerList.map((u) => [u.id, u]));
            businessReviews = reviewsList.map((r) => ({
              ...r,
              reviewerName: reviewerMap.get(r.userId)?.name || "Anonymous"
            }));
            const latestOrder = await db.select().from(orders).where(and(eq(orders.businessPageId, business.id), eq(orders.status, "paid"))).orderBy(desc(orders.paidDate)).limit(1).get();
            if (latestOrder) {
              subscription = {
                planType: latestOrder.planType || "basic",
                amount: latestOrder.amount || 0,
                status: latestOrder.status,
                expiryDate: latestOrder.expiryDate
              };
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Auth check failed:", e);
  }
  if (!user) {
    return Astro.redirect("/login?redirect=/account");
  }
  const isSubscriptionExpired = subscription?.expiryDate ? new Date(subscription.expiryDate) < /* @__PURE__ */ new Date() : false;
  const isSubscriptionActive = subscription?.status === "paid" && !isSubscriptionExpired;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "My Account - TIMORLIST" }, { "default": async ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-8"> <div class="flex items-center justify-between mb-8"> <h1 class="text-3xl font-bold">My Account</h1> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Main Content --> <div class="lg:col-span-2"> <!-- Profile Section --> ${renderComponent($$result2, "Card", $$Card, { "class": "mb-6" }, { "default": async ($$result3) => renderTemplate`
          ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
            ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Profile Information` })}
            ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": async ($$result5) => renderTemplate`Manage your account details` })}
          ` })}
          ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": async ($$result4) => renderTemplate`
            <div class="flex items-center gap-4 mb-6"> <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold"> ${user.name.charAt(0).toUpperCase()} </div> <div> <p class="font-semibold">${user.name}</p> <p class="text-sm text-muted-foreground">${user.email}</p> </div> </div>
          ` })}
        ` })} <!-- My Business --> ${userBusiness ? renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, { "class": "flex flex-row items-center justify-between" }, { "default": async ($$result4) => renderTemplate`
              <div> ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`My Business` })} ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": async ($$result5) => renderTemplate`${userBusiness.title}` })} </div>
              <div class="flex gap-2"> <a${addAttribute(`/business/${userBusiness.slug}`, "href")}> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "size": "sm"
  }, { "default": async ($$result5) => renderTemplate`View` })} </a> <a${addAttribute(`/business/${userBusiness.slug}/edit`, "href")}> ${renderComponent($$result4, "Button", $$Button, { "size": "sm" }, { "default": async ($$result5) => renderTemplate`Edit` })} </a> </div>
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": async ($$result4) => renderTemplate`
              <div class="flex items-center gap-4"> <span${addAttribute(`px-3 py-1 text-sm rounded-full ${isSubscriptionActive ? "bg-green-100 text-green-800" : isSubscriptionExpired ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${isSubscriptionActive ? "Active" : isSubscriptionExpired ? "Expired" : "Inactive"} </span> <span class="text-sm text-muted-foreground"> ${subscription ? `${subscription.planType.replace("-", " ").toUpperCase()} Plan` : "Free Plan"} </span> </div>
            ` })}
          ` })}${renderComponent($$result2, "Card", $$Card, { "class": "mt-6" }, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Customer Reviews` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": async ($$result5) => renderTemplate`View and reply to customer reviews` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": async ($$result4) => renderTemplate`${businessReviews.length > 0 ? renderTemplate`<div class="space-y-4"> ${businessReviews.map((review) => renderTemplate`<div class="border rounded-lg p-4"> <div class="flex items-center justify-between mb-2"> <div class="flex items-center gap-2"> <span class="font-medium">${review.reviewerName}</span> <div class="flex"> ${Array.from({ length: 5 }).map((_, i) => renderTemplate`<span${addAttribute(i, "key")}${addAttribute(i < review.rating ? "text-yellow-400" : "text-gray-300", "class")}>★</span>`)} </div> </div> <span class="text-sm text-muted-foreground"> ${review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""} </span> </div> <p class="text-gray-700 mb-3">${review.comment || "No comment"}</p> ${review.reply ? renderTemplate`<div class="bg-gray-50 rounded-lg p-3 ml-4 border-l-4 border-primary"> <p class="text-sm font-medium mb-1">Your Reply:</p> <p class="text-sm">${review.reply}</p> <p class="text-xs text-muted-foreground mt-1"> ${review.repliedAt ? `Replied on ${new Date(review.repliedAt).toLocaleDateString()}` : ""} </p> <div class="flex gap-2 mt-2"> <button class="text-sm text-blue-600 hover:text-blue-800 edit-reply-btn"${addAttribute(review.id, "data-review-id")}${addAttribute(review.reply, "data-reply")}>
Edit Reply
</button> <button class="text-sm text-red-600 hover:text-red-800 delete-reply-btn"${addAttribute(review.id, "data-review-id")}>
Delete Reply
</button> </div> </div>` : renderTemplate`<button class="text-sm text-primary hover:text-primary/80 reply-btn"${addAttribute(review.id, "data-review-id")}>
Reply to Review
</button>`} </div>`)} </div>` : renderTemplate`<p class="text-muted-foreground text-center py-4">No reviews yet</p>`}` })}
          ` })}` : renderTemplate`${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
            ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
              ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Create Your Business` })}
              ${renderComponent($$result4, "CardDescription", $$CardDescription, {}, { "default": async ($$result5) => renderTemplate`Get started with your first business listing` })}
            ` })}
            ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": async ($$result4) => renderTemplate`
              <a href="/listing/create?type=business"> ${renderComponent($$result4, "Button", $$Button, {}, { "default": async ($$result5) => renderTemplate`Create Business` })} </a>
            ` })}
          ` })}`} </div> <!-- Sidebar --> <div> <!-- Subscription Card --> ${renderComponent($$result2, "Card", $$Card, { "class": "mb-6" }, { "default": async ($$result3) => renderTemplate`
          ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
            ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Subscription` })}
          ` })}
          ${renderComponent($$result3, "CardContent", $$CardContent, {}, { "default": async ($$result4) => renderTemplate`${isSubscriptionActive ? renderTemplate`<div class="text-center"> <p class="text-2xl font-bold text-green-600">Active</p> <p class="text-sm text-muted-foreground mt-1"> ${subscription?.planType.replace("-", " ").toUpperCase()} Plan
</p> ${subscription?.expiryDate && renderTemplate`<p class="text-xs text-muted-foreground mt-2">
Expires: ${new Date(subscription.expiryDate).toLocaleDateString()} </p>`} </div>` : renderTemplate`<div class="text-center"> ${isSubscriptionExpired ? renderTemplate`${renderComponent($$result4, "Fragment", Fragment, {}, { "default": ($$result5) => renderTemplate` <p class="text-2xl font-bold text-red-600">Expired</p> <p class="text-sm text-muted-foreground mt-1">
Your subscription has expired
</p> <p class="text-xs text-muted-foreground mt-2">
Renew to continue enjoying premium features
</p> ` })}` : userBusiness ? renderTemplate`${renderComponent($$result4, "Fragment", Fragment, {}, { "default": ($$result5) => renderTemplate` <p class="text-2xl font-bold text-yellow-600">Inactive</p> <p class="text-sm text-muted-foreground mt-1">
No active subscription
</p> ` })}` : renderTemplate`${renderComponent($$result4, "Fragment", Fragment, {}, { "default": ($$result5) => renderTemplate` <p class="text-2xl font-bold text-gray-500">Free</p> <p class="text-sm text-muted-foreground mt-1">
Create a business to get started
</p> ` })}`} </div>`}` })}
          ${renderComponent($$result3, "CardFooter", $$CardFooter, { "class": "flex-col gap-2" }, { "default": async ($$result4) => renderTemplate`
            <a href="/pricing" class="w-full"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "outline",
    "class": "w-full"
  }, { "default": async ($$result5) => renderTemplate`${isSubscriptionExpired ? "Renew Subscription" : isSubscriptionActive ? "Change Plan" : "View Plans"}` })} </a>
            ${!isSubscriptionActive && userBusiness && renderTemplate`<a${addAttribute(`/subscribe?plan=basic-monthly`, "href")} class="w-full"> ${renderComponent($$result4, "Button", $$Button, { "class": "w-full" }, { "default": async ($$result5) => renderTemplate`Subscribe Now` })} </a>`}` })}
        ` })} <!-- Quick Links --> ${renderComponent($$result2, "Card", $$Card, {}, { "default": async ($$result3) => renderTemplate`
          ${renderComponent($$result3, "CardHeader", $$CardHeader, {}, { "default": async ($$result4) => renderTemplate`
            ${renderComponent($$result4, "CardTitle", $$CardTitle, {}, { "default": async ($$result5) => renderTemplate`Quick Links` })}
          ` })}
          ${renderComponent($$result3, "CardContent", $$CardContent, { "class": "space-y-2" }, { "default": async ($$result4) => renderTemplate`
            <a href="/listing" class="block"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "ghost",
    "class": "w-full justify-start"
  }, { "default": async ($$result5) => renderTemplate`Browse Directory` })} </a>
            <a href="/products-services" class="block"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "ghost",
    "class": "w-full justify-start"
  }, { "default": async ($$result5) => renderTemplate`Products & Services` })} </a>
            <a href="/pricing" class="block"> ${renderComponent($$result4, "Button", $$Button, {
    "variant": "ghost",
    "class": "w-full justify-start"
  }, { "default": async ($$result5) => renderTemplate`Pricing` })} </a>
            <form action="/api/auth/sign-out" method="POST"> ${renderComponent($$result4, "Button", $$Button, {
    "type": "submit",
    "variant": "ghost",
    "class": "w-full justify-start text-red-500 hover:text-red-600"
  }, { "default": async ($$result5) => renderTemplate`
                Log Out
              ` })} </form>
          ` })}
        ` })} </div> </div> </div>

  
  <div id="reply-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50"> <div class="bg-background rounded-lg p-6 max-w-md w-full mx-4"> <h3 class="text-lg font-semibold mb-4" id="reply-modal-title">Reply to Review</h3> <textarea id="reply-text" class="w-full border rounded-lg p-3 h-32 resize-none" placeholder="Write your reply..."></textarea> <input type="hidden" id="reply-review-id" value=""> <input type="hidden" id="reply-action" value="create"> <div class="flex gap-2 mt-4 justify-end"> ${renderComponent($$result2, "Button", $$Button, {
    "variant": "outline",
    "id": "reply-modal-cancel"
  }, { "default": async ($$result3) => renderTemplate`Cancel` })} ${renderComponent($$result2, "Button", $$Button, { "id": "reply-modal-submit" }, { "default": async ($$result3) => renderTemplate`Submit` })} </div> </div> </div>

  ${renderScript($$result2, "/home/jasonwill/dev-projects/timorlist/src/pages/account.astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/account.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/account.astro";
const $$url = "/account";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Account,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
